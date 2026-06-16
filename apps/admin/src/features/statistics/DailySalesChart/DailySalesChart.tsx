'use client';

import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { useState } from 'react';

import * as styles from './DailySalesChart.css';

import type { DailySalesItem } from '@/features/statistics/types';

import { formatManwon, toManwon } from '@/utils/formatCurrency';
import { calcDayCount, formatDisplayDate } from '@/utils/formatDate';

interface Props {
  data: DailySalesItem[];
  startDate: string;
  endDate: string;
}

/** SVG 좌표 */
const VW = 800; // 전체 너비
const VH = 300; // 전체 높이
const PAD_TOP = 24;
const PAD_RIGHT = 24;
const PAD_BOTTOM = 48; // x축 날짜 공간
const PAD_LEFT = 80; // y축 금액 공간
const CHART_W = VW - PAD_LEFT - PAD_RIGHT; // 차트 너비
const CHART_H = VH - PAD_TOP - PAD_BOTTOM; // 차트 높이

const INFOBOX_W = 164;
const INFOBOX_H = 64;
const INFOBOX_OFFSET = 12; // 인포박스와 커서 사이 간격
const INFOBOX_PAD_X = 10; // 인포박스 텍스트 좌측 여백
const INFOBOX_LINE_H = 18; // 인포박스 줄 간격

const TICK_FONT_SIZE = 11; // 축·인포박스 텍스트 크기
const AXIS_LABEL_GAP = 8; // y축 레이블과 차트 사이 간격
const X_LABEL_OFFSET = 20; // x축 날짜 레이블 차트 하단 오프셋

export default function DailySalesChart({ data, startDate, endDate }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const subtitle = `${formatDisplayDate(startDate)} ~ ${formatDisplayDate(endDate)} ${calcDayCount(startDate, endDate)}일`;

  if (data.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <p className={`${typography.f16EB} ${styles.headerTitle}`}>
            일별 거래 추이
          </p>
          <p className={`${typography.f12R} ${styles.headerSubtitle}`}>
            {subtitle}
          </p>
        </div>
        <div className={styles.empty}>
          <p className={typography.f16R}>데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  const dataCount = data.length;

  // 최고 거래 금액
  const maxManwon = Math.max(
    ...data.map((d) => Math.floor(d.totalTransactionAmount / 10_000)),
    0,
  );

  const BASE_STEP = 500; // 기본 눈금 간격
  const TARGET_TICKS = 5; // 눈금 개수

  // 눈금 간격 조정
  const stepMult = Math.max(
    1,
    Math.ceil(maxManwon / (BASE_STEP * TARGET_TICKS)),
  );
  const step = BASE_STEP * stepMult;
  const yMax = Math.ceil(maxManwon / step) * step || step; // y축 최댓값

  // x좌표 인덱스
  const xOf = (i: number): number =>
    dataCount === 1
      ? PAD_LEFT + CHART_W / 2
      : PAD_LEFT + (i / (dataCount - 1)) * CHART_W;
  // y좌표 인덱스
  const yOf = (won: number): number =>
    PAD_TOP + CHART_H - (Math.floor(won / 10_000) / yMax) * CHART_H;

  // y축 가이드선
  const yTicks: { y: number; label: string }[] = [];
  for (let v = 0; v <= yMax; v += step) {
    yTicks.push({
      y: PAD_TOP + CHART_H - (v / yMax) * CHART_H,
      label: v === 0 ? '0' : formatManwon(v),
    });
  }

  // 데이터 배열
  const points = data.map((d, i) => ({
    x: xOf(i),
    y: yOf(d.totalTransactionAmount),
    d,
  }));

  const firstPt = points[0];
  const lastPt = points.at(-1);
  if (!firstPt || !lastPt) {
    return null;
  }

  // 꺾은선 그래프: M(시작) L L L ...
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
    .join(' ');
  // 그라데이션 채우기: 꺾은선 끝 → 오른쪽 바닥 → 왼쪽 바닥 → Z(닫기)
  const areaPath = `${linePath} L${lastPt.x},${PAD_TOP + CHART_H} L${firstPt.x},${PAD_TOP + CHART_H} Z`;

  // x축 가이드선
  const X_TICK_COUNT = 7;
  const tickIndices = new Set<number>();
  if (dataCount > 1) {
    const count = Math.min(X_TICK_COUNT, dataCount);
    for (let i = 0; i < count; i++) {
      tickIndices.add(Math.round((i * (dataCount - 1)) / (count - 1)));
    }
  } else {
    tickIndices.add(0);
  }
  const xTicks = points.filter((_, i) => tickIndices.has(i));

  const hovered = hoveredIdx === null ? null : (points[hoveredIdx] ?? null);

  // 상세정보 기본 오른쪽, 영역 벗어나면 왼쪽으로
  const infoboxTx = hovered
    ? hovered.x + INFOBOX_W + INFOBOX_OFFSET > VW - PAD_RIGHT
      ? hovered.x - INFOBOX_W - INFOBOX_OFFSET
      : hovered.x + INFOBOX_OFFSET
    : 0;
  const infoboxTy = hovered
    ? Math.max(
        PAD_TOP,
        Math.min(hovered.y - INFOBOX_H / 2, VH - PAD_BOTTOM - INFOBOX_H),
      )
    : 0;

  // 마우스 위치와 가장 가까운 데이터 추적
  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>): void {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();

    const svgX = ((e.clientX - rect.left) / rect.width) * VW; // 마우스 위치를 svg 좌표로 변환

    if (svgX < PAD_LEFT || svgX > VW - PAD_RIGHT) {
      setHoveredIdx(null);
      return;
    }

    const nearest = points.reduce(
      (best, p, i) => {
        const dist = Math.abs(p.x - svgX);
        return dist < best.dist ? { i, dist } : best;
      },
      { i: 0, dist: Infinity },
    ).i;
    setHoveredIdx(nearest);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={`${typography.f16EB} ${styles.headerTitle}`}>
          일별 거래 추이
        </p>
        <p className={`${typography.f12R} ${styles.headerSubtitle}`}>
          {subtitle}
        </p>
      </div>
      <div className={styles.chartArea}>
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="none"
          className={styles.svg}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoveredIdx(null);
          }}
        >
          <defs>
            <linearGradient id="salesAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={vars.color.blue300}
                stopOpacity={0.25}
              />
              <stop
                offset="100%"
                stopColor={vars.color.blue300}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          {yTicks.map((t) => (
            <g key={t.label}>
              <line
                x1={PAD_LEFT}
                y1={t.y}
                x2={VW - PAD_RIGHT}
                y2={t.y}
                stroke={vars.color.line200}
                strokeWidth={1}
              />
              <text
                x={PAD_LEFT - AXIS_LABEL_GAP}
                y={t.y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={TICK_FONT_SIZE}
                fill={vars.color.gray400}
              >
                {t.label}
              </text>
            </g>
          ))}

          {xTicks.map((p) => (
            <text
              key={p.d.date}
              x={p.x}
              y={PAD_TOP + CHART_H + X_LABEL_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={vars.color.gray400}
            >
              {Number.parseInt(p.d.date.slice(8), 10)}
            </text>
          ))}

          <path d={areaPath} fill="url(#salesAreaFill)" />

          <path
            d={linePath}
            fill="none"
            stroke={vars.color.blue300}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* hover 영역 설정 */}
          {points.map((p, i) => {
            const leftEdge =
              i === 0 ? PAD_LEFT : (p.x + (points[i - 1]?.x ?? p.x)) / 2;
            const rightEdge =
              i === dataCount - 1
                ? VW - PAD_RIGHT
                : (p.x + (points[i + 1]?.x ?? p.x)) / 2;
            return (
              <rect
                key={p.d.date}
                x={leftEdge}
                y={PAD_TOP}
                width={rightEdge - leftEdge}
                height={CHART_H}
                fill="transparent"
                onMouseEnter={() => {
                  setHoveredIdx(i);
                }}
              />
            );
          })}
          {/* hover 시 상세 정보 */}
          {hovered && (
            <g>
              <line
                x1={hovered.x}
                y1={PAD_TOP}
                x2={hovered.x}
                y2={PAD_TOP + CHART_H}
                stroke={vars.color.blue300}
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              <circle
                cx={hovered.x}
                cy={hovered.y}
                r={5}
                fill={vars.color.blue300}
                stroke={vars.color.white}
                strokeWidth={2}
              />
              <rect
                x={infoboxTx}
                y={infoboxTy}
                width={INFOBOX_W}
                height={INFOBOX_H}
                rx={4}
                fill={vars.color.black400}
                opacity={0.88}
              />
              <text
                x={infoboxTx + INFOBOX_PAD_X}
                y={infoboxTy + INFOBOX_LINE_H}
                fill={vars.color.white}
                fontSize={TICK_FONT_SIZE}
              >
                {hovered.d.date}
              </text>
              <text
                x={infoboxTx + INFOBOX_PAD_X}
                y={infoboxTy + INFOBOX_LINE_H * 2}
                fill={vars.color.white}
                fontSize={TICK_FONT_SIZE}
              >
                거래액: {toManwon(hovered.d.totalTransactionAmount)}원
              </text>
              <text
                x={infoboxTx + INFOBOX_PAD_X}
                y={infoboxTy + INFOBOX_LINE_H * 3}
                fill={vars.color.white}
                fontSize={TICK_FONT_SIZE}
              >
                건수: {hovered.d.totalTransactionCount}건
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

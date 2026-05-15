import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 className={typography.f24EB}>대시보드 테스트</h1>
      <p className={typography.f16R}>
        여기는 스크롤 테스트용 더미 페이지에요. 사이드바는 고정, 헤더는 sticky로
        붙어있고, 본문만 스크롤되는지 확인하세요.
      </p>

      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: vars.color.white,
            border: '1px solid #E6E6E6',
            borderRadius: '8px',
            padding: '24px',
          }}
        >
          <h2 className={typography.f18B}>섹션 {i + 1}</h2>
          <p className={typography.f14R} style={{ marginTop: '8px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p className={typography.f14R} style={{ marginTop: '8px' }}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <p
            className={typography.f12R}
            style={{ marginTop: '8px', color: '#999999' }}
          >
            마지막 수정: 2026-05-08 · 작성자: 관리자 #{i + 1}
          </p>
        </div>
      ))}

      <div
        style={{
          backgroundColor: '#1B92FF',
          color: vars.color.white,
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <p className={typography.f20EB}>여기까지 스크롤되면 정상</p>
        <p className={typography.f14R} style={{ marginTop: '8px' }}>
          사이드바와 헤더가 위에 그대로 붙어있어야 해요.
        </p>
      </div>
    </div>
  );
}

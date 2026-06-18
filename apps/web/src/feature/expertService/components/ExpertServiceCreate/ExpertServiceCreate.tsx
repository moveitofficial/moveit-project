'use client';

import { skipToken, useQuery } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';

import { getService } from '../../api';
import {
  SERVICE_FAQ_ANSWER_MAX,
  SERVICE_FAQ_QUESTION_MAX,
  SERVICE_MAX_STEPS,
  SERVICE_MAX_TECH_STACKS,
  SERVICE_RICH_MAX,
  SERVICE_SCOPE_MAX,
  SERVICE_STEP_DESC_MAX,
  SERVICE_STEP_TITLE_MAX,
  SERVICE_TITLE_MAX,
} from '../../constants';
import {
  toCreateServiceErrorMessage,
  useCreateService,
  useUpdateService,
} from '../../useCreateService';
import { RichTextEditor } from '../RichTextEditor';

import * as styles from './ExpertServiceCreate.css';

import CheckboxGroup from '@/feature/signup/components/common/CheckboxGroup';
import Dropdown from '@/feature/signup/components/common/Dropdown';
import FormHeader from '@/feature/signup/components/common/FormHeader';
import {
  SERVICE_CATEGORIES_BY_GROUP,
  type ServiceCategoryId,
} from '@/feature/signup/components/common/serviceCategories';
import {
  SERVICE_GROUPS_EXPERT,
  type ServiceGroupId,
} from '@/feature/signup/components/common/serviceGroups';
import { TECH_STACKS, type TechStackId } from '@/feature/signup/components/common/techStacks';
import DetailImageUpload from '@/feature/signup/components/ExpertPortfolioCreate/DetailImageUpload';
import MainImageUpload from '@/feature/signup/components/ExpertPortfolioCreate/MainImageUpload';
import UploadErrorModal from '@/feature/signup/components/ExpertPortfolioCreate/UploadErrorModal';
import { useBlockBack } from '@/feature/signup/useBlockBack';

interface Props {
  // 있으면 편집 모드(기존 서비스 프리필 + 수정).
  serviceId?: string;
}

interface ImageItem {
  file: File | null; // null이면 기존(이미 업로드된) 이미지
  url: string;
}

const MIN_IMAGE_WIDTH = 600;
const MAX_IMAGE_HEIGHT = 3000;

// 업로드 전 검증: 가로 ≥ 600px, 세로 ≤ 3000px / 메인은 추가로 1:1.
const isValidImageSize = (file: File, requireSquare: boolean): Promise<boolean> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.addEventListener('load', () => {
      URL.revokeObjectURL(url);
      const sizeOk =
        image.naturalWidth >= MIN_IMAGE_WIDTH &&
        image.naturalHeight <= MAX_IMAGE_HEIGHT;
      resolve(sizeOk && (!requireSquare || image.naturalWidth === image.naturalHeight));
    });
    image.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      resolve(false);
    });
    image.src = url;
  });

// 태그를 제거한 실제 텍스트가 비어있는지(에디터 빈 값 판별).
const isRichEmpty = (html: string): boolean =>
  html.replaceAll(/<[^>]*>/g, '').trim() === '';

const onlyDigits = (value: string): string => value.replaceAll(/[^0-9]/g, '');

export default function ExpertServiceCreate({ serviceId }: Props) {
  useBlockBack();
  const isEdit = serviceId !== undefined;

  const create = useCreateService();
  const update = useUpdateService(serviceId ?? '');
  const isPending = create.isPending || update.isPending;
  const errorMessage = toCreateServiceErrorMessage(
    isEdit ? update.error : create.error,
  );

  const { data: detail } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: serviceId ? () => getService(serviceId) : skipToken,
  });

  const [title, setTitle] = useState('');
  const [serviceGroup, setServiceGroup] = useState<ServiceGroupId | ''>('');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategoryId | ''>(
    '',
  );
  const [techStackNames, setTechStackNames] = useState<TechStackId[]>([]);
  const [workDuration, setWorkDuration] = useState('');
  const [revisionCount, setRevisionCount] = useState('');
  const [serviceScope, setServiceScope] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [description, setDescription] = useState('');
  const [preparationNotes, setPreparationNotes] = useState('');
  const [refundPolicy, setRefundPolicy] = useState('');
  const [steps, setSteps] = useState([{ title: '', description: '' }]);
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [mainImage, setMainImage] = useState<ImageItem | null>(null);
  const [detailImages, setDetailImages] = useState<ImageItem[]>([]);
  const [isImageErrorOpen, setIsImageErrorOpen] = useState(false);

  // 편집 모드: 기존 서비스 데이터로 폼 채우기.
  useEffect(() => {
    if (detail === undefined) {
      return;
    }
    const d = detail.data;
    setTitle(d.title);
    setServiceGroup(d.categoryRef.group);
    setServiceCategory(d.categoryRef.category);
    setTechStackNames(d.techStacks);
    setWorkDuration(String(d.workDuration));
    setRevisionCount(String(d.revisionCount));
    setServiceScope(d.serviceScope);
    setServicePrice(String(d.servicePrice));
    setDescription(d.description);
    setPreparationNotes(d.preparationNotes);
    setRefundPolicy(d.refundPolicy);
    setSteps(
      d.steps.length > 0
        ? d.steps.map((step) => ({
            title: step.title,
            description: step.description,
          }))
        : [{ title: '', description: '' }],
    );
    setFaqs(
      d.faqs.length > 0
        ? d.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))
        : [{ question: '', answer: '' }],
    );
    const main = d.images.find((image) => image.isMain);
    setMainImage(main ? { file: null, url: main.imgUrl } : null);
    setDetailImages(
      d.images
        .filter((image) => !image.isMain)
        .map((image) => ({ file: null, url: image.imgUrl })),
    );
  }, [detail]);

  const categoryOptions =
    serviceGroup === '' ? [] : SERVICE_CATEGORIES_BY_GROUP[serviceGroup];
  // IT 코칭은 월 단위/한달 가격이고 수정 횟수가 없다(프로젝트 의뢰와 다름).
  const isItCoaching = serviceGroup === 'IT_COACHING';

  const handleGroupChange = (id: string) => {
    setServiceGroup(id as ServiceGroupId);
    setServiceCategory('');
  };

  const selectImage = async (
    file: File,
    requireSquare: boolean,
    apply: (item: ImageItem) => void,
  ) => {
    if (!(await isValidImageSize(file, requireSquare))) {
      setIsImageErrorOpen(true);
      return;
    }
    apply({ file, url: URL.createObjectURL(file) });
  };

  const handleMainSelect = (file: File) => {
    void selectImage(file, true, setMainImage);
  };

  const handleDetailSelect = (file: File) => {
    void selectImage(file, false, (item) => {
      setDetailImages((prev) => [...prev, item]);
    });
  };

  const updateStep = (
    index: number,
    key: 'title' | 'description',
    value: string,
  ) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, [key]: value } : step)),
    );
  };

  const updateFaq = (
    index: number,
    key: 'question' | 'answer',
    value: string,
  ) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [key]: value } : faq)),
    );
  };

  const workDurationNumber = Number(workDuration);
  const revisionCountNumber = Number(revisionCount);
  const servicePriceNumber = Number(servicePrice);

  const canSubmit =
    title.trim() !== '' &&
    serviceGroup !== '' &&
    serviceCategory !== '' &&
    techStackNames.length > 0 &&
    workDuration !== '' &&
    workDurationNumber >= 1 &&
    (!isItCoaching || workDurationNumber <= 30) &&
    (isItCoaching || revisionCount !== '') &&
    servicePrice !== '' &&
    serviceScope.trim() !== '' &&
    !isRichEmpty(description) &&
    description.length <= SERVICE_RICH_MAX &&
    !isRichEmpty(preparationNotes) &&
    preparationNotes.length <= SERVICE_RICH_MAX &&
    !isRichEmpty(refundPolicy) &&
    refundPolicy.length <= SERVICE_RICH_MAX &&
    mainImage !== null &&
    detailImages.length > 0 &&
    steps.every(
      (step) => step.title.trim() !== '' && step.description.trim() !== '',
    ) &&
    faqs.every(
      (faq) => faq.question.trim() !== '' && faq.answer.trim() !== '',
    );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isPending) {
      return;
    }

    const body = {
      title: title.trim(),
      serviceGroup,
      serviceCategory,
      techStackNames,
      workDuration: workDurationNumber,
      revisionCount: isItCoaching ? 0 : revisionCountNumber,
      serviceScope: serviceScope.trim(),
      servicePrice: servicePriceNumber,
      description,
      preparationNotes,
      refundPolicy,
      steps,
      faqs,
    };

    if (isEdit) {
      // 편집: 이미지는 기존 url 유지(미변경) 또는 전체 새 업로드(useUpdateService 내부 처리).
      update.mutate({ mainImage, detailImages, body });
      return;
    }

    // 생성: 새 이미지 필수.
    if (mainImage.file === null) {
      return;
    }
    create.mutate({
      mainImage: mainImage.file,
      detailImages: detailImages
        .map((image) => image.file)
        .filter((file): file is File => file !== null),
      body,
    });
  };

  return (
    <section className={styles.container}>
      <FormHeader
        align="left"
        title={
          isEdit ? (
            <>
              서비스를
              <br />
              수정해주세요
            </>
          ) : (
            <>
              판매자님의 서비스를
              <br />
              등록해주세요!
            </>
          )
        }
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* 서비스 제목 */}
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            서비스 제목
          </label>
          <input
            id="title"
            type="text"
            className={styles.input}
            placeholder="서비스를 입력해주세요"
            maxLength={SERVICE_TITLE_MAX}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>

        {/* 카테고리 */}
        <div className={styles.field}>
          <span className={styles.label}>카테고리 선택</span>
          <Dropdown
            options={SERVICE_GROUPS_EXPERT}
            value={serviceGroup}
            onChange={handleGroupChange}
            placeholder="카테고리를 선택해주세요"
          />
        </div>

        {/* 상세분야 — 카테고리 선택 시 노출(단일 선택) */}
        {categoryOptions.length > 0 ? (
          <div className={styles.field}>
            <span className={styles.label}>상세분야</span>
            <div className={styles.categoryOptions}>
              {categoryOptions.map((option) => {
                const checked = serviceCategory === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={styles.categoryOption}
                    onClick={() => {
                      setServiceCategory(option.id);
                    }}
                  >
                    <span className={checked ? styles.radioChecked : styles.radio} />
                    <span className={styles.categoryLabel}>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* 개발 기술 */}
        <div className={styles.field}>
          <span className={styles.label}>개발 기술</span>
          <CheckboxGroup
            options={TECH_STACKS}
            selected={techStackNames}
            onChange={(next) => {
              setTechStackNames(next as TechStackId[]);
            }}
            max={SERVICE_MAX_TECH_STACKS}
            maxHeight={396}
            showChips
          />
        </div>

        {/* 작업 기간 — IT코칭: 월기준 N/30 / 프로젝트: 일 */}
        <div className={styles.field}>
          <label htmlFor="workDuration" className={styles.label}>
            {isItCoaching
              ? '작업 기간을 입력해주세요'
              : '작업 가능 일정을 입력해주세요'}
          </label>
          <div className={styles.inputWithUnit}>
            <input
              id="workDuration"
              type="text"
              inputMode="numeric"
              className={styles.input}
              placeholder="작업기간을 입력해주세요"
              value={workDuration}
              onChange={(event) => {
                const digits = onlyDigits(event.target.value);
                setWorkDuration(
                  isItCoaching && digits !== '' && Number(digits) > 30
                    ? '30'
                    : digits,
                );
              }}
            />
            <span className={styles.unit}>
              {isItCoaching
                ? `월기준 ${workDuration === '' ? '0' : workDuration}/30`
                : '일'}
            </span>
          </div>
        </div>

        {/* 수정 횟수 — 프로젝트 의뢰에서만 */}
        {isItCoaching ? null : (
          <div className={styles.field}>
            <label htmlFor="revisionCount" className={styles.label}>
              수정 횟수
            </label>
            <div className={styles.inputWithUnit}>
              <input
                id="revisionCount"
                type="text"
                inputMode="numeric"
                className={styles.input}
                placeholder="수정 가능 횟수를 숫자로 입력해주세요"
                value={revisionCount}
                onChange={(event) => {
                  setRevisionCount(onlyDigits(event.target.value));
                }}
              />
              <span className={styles.unit}>회</span>
            </div>
          </div>
        )}

        {/* 제공범위 */}
        <div className={styles.field}>
          <label htmlFor="serviceScope" className={styles.label}>
            제공범위를 입력해주세요
          </label>
          <div className={styles.inputWithUnit}>
            <input
              id="serviceScope"
              type="text"
              className={styles.input}
              placeholder="제공범위를 입력해주세요"
              maxLength={SERVICE_SCOPE_MAX}
              value={serviceScope}
              onChange={(event) => {
                setServiceScope(event.target.value);
              }}
            />
            <span className={styles.unit}>
              {serviceScope.length}/{SERVICE_SCOPE_MAX}
            </span>
          </div>
        </div>

        {/* 서비스 가격 — IT코칭: 원/한달 / 프로젝트: 원 */}
        <div className={styles.field}>
          <label htmlFor="servicePrice" className={styles.label}>
            {isItCoaching ? '서비스 가격' : '서비스 금액'}
          </label>
          <div className={styles.inputWithUnit}>
            <input
              id="servicePrice"
              type="text"
              inputMode="numeric"
              className={styles.input}
              placeholder={
                isItCoaching
                  ? '서비스 가격을 입력해주세요'
                  : '서비스 금액을 입력해주세요'
              }
              value={servicePrice}
              onChange={(event) => {
                setServicePrice(onlyDigits(event.target.value));
              }}
            />
            <span className={styles.unit}>{isItCoaching ? '원/ 한달' : '원'}</span>
          </div>
        </div>

        {/* 메인 이미지 */}
        <div className={styles.field}>
          <span className={styles.label}>메인 이미지 등록</span>
          <MainImageUpload
            value={mainImage?.url ?? null}
            onSelect={handleMainSelect}
            onRemove={() => {
              setMainImage(null);
            }}
          />
          <p className={styles.guide}>
            가로 600px 이상, 세로 3000px 이하 · 1:1 비율 이미지를 권장합니다.
          </p>
        </div>

        {/* 상세 이미지 */}
        <div className={styles.field}>
          <span className={styles.label}>
            상세 이미지 등록(1개 필수){' '}
            <span className={styles.labelCount}>{detailImages.length}/10</span>
          </span>
          <DetailImageUpload
            values={detailImages.map((image) => image.url)}
            onSelect={handleDetailSelect}
            onRemove={(index) => {
              setDetailImages((prev) => prev.filter((_, i) => i !== index));
            }}
          />
          <p className={styles.guide}>
            가로 600px 이상, 세로 3000px 이하 이미지를 최대 10개까지 등록할 수
            있습니다.
          </p>
        </div>

        {/* 이런 분께 추천드려요 */}
        <div className={styles.field}>
          <span className={styles.label}>이런 분께 추천드려요</span>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="진행할 내용을 작성해주세요"
          />
          <span className={styles.counterRight}>
            {description.length}/{SERVICE_RICH_MAX}
          </span>
        </div>

        {/* 진행 단계 */}
        <div className={styles.field}>
          <span className={styles.label}>이렇게 진행합니다</span>
          {steps.map((step, index) => (
            <div key={index} className={styles.repeatItem}>
              <div className={styles.repeatHeader}>
                <span className={styles.repeatTitle}>STEP {index + 1}</span>
                {steps.length > 1 ? (
                  <button
                    type="button"
                    className={styles.removeButton}
                    aria-label="단계 삭제"
                    onClick={() => {
                      setSteps((prev) => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <X size={16} aria-hidden />
                  </button>
                ) : null}
              </div>
              <input
                type="text"
                className={styles.input}
                placeholder="단계 제목을 입력해주세요"
                maxLength={SERVICE_STEP_TITLE_MAX}
                value={step.title}
                onChange={(event) => {
                  updateStep(index, 'title', event.target.value);
                }}
              />
              <input
                type="text"
                className={styles.input}
                placeholder="단계 내용을 짧게 설명해주세요"
                maxLength={SERVICE_STEP_DESC_MAX}
                value={step.description}
                onChange={(event) => {
                  updateStep(index, 'description', event.target.value);
                }}
              />
            </div>
          ))}
          {steps.length < SERVICE_MAX_STEPS ? (
            <button
              type="button"
              className={styles.addButton}
              onClick={() => {
                setSteps((prev) => [...prev, { title: '', description: '' }]);
              }}
            >
              <Plus size={16} aria-hidden />
              추가
            </button>
          ) : null}
        </div>

        {/* 준비해오시면 좋아요 */}
        <div className={styles.field}>
          <span className={styles.label}>준비해오시면 좋아요</span>
          <RichTextEditor
            value={preparationNotes}
            onChange={setPreparationNotes}
            placeholder="진행 전 준비하면 좋은 내용을 작성해주세요"
          />
          <span className={styles.counterRight}>
            {preparationNotes.length}/{SERVICE_RICH_MAX}
          </span>
        </div>

        {/* 자주 묻는 질문 */}
        <div className={styles.field}>
          <span className={styles.label}>자주 묻는 질문</span>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.repeatItem}>
              <div className={styles.repeatHeader}>
                <span className={styles.repeatTitle}>Q{index + 1}</span>
                {faqs.length > 1 ? (
                  <button
                    type="button"
                    className={styles.removeButton}
                    aria-label="질문 삭제"
                    onClick={() => {
                      setFaqs((prev) => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <X size={16} aria-hidden />
                  </button>
                ) : null}
              </div>
              <input
                type="text"
                className={styles.input}
                placeholder="질문을 입력해주세요"
                maxLength={SERVICE_FAQ_QUESTION_MAX}
                value={faq.question}
                onChange={(event) => {
                  updateFaq(index, 'question', event.target.value);
                }}
              />
              <div className={styles.textareaWrapper}>
                <textarea
                  className={styles.textarea}
                  placeholder="답변을 입력해주세요"
                  maxLength={SERVICE_FAQ_ANSWER_MAX}
                  value={faq.answer}
                  onChange={(event) => {
                    updateFaq(index, 'answer', event.target.value);
                  }}
                />
                <span className={styles.counter}>
                  {faq.answer.length}/{SERVICE_FAQ_ANSWER_MAX}
                </span>
              </div>
            </div>
          ))}
          <button
            type="button"
            className={styles.addButton}
            onClick={() => {
              setFaqs((prev) => [...prev, { question: '', answer: '' }]);
            }}
          >
            <Plus size={16} aria-hidden />
            추가
          </button>
        </div>

        {/* 환불규정 */}
        <div className={styles.field}>
          <span className={styles.label}>환불규정</span>
          <RichTextEditor
            value={refundPolicy}
            onChange={setRefundPolicy}
            placeholder="서비스 이용 시 적용되는 환불 규정을 입력해주세요"
          />
          <span className={styles.counterRight}>
            {refundPolicy.length}/{SERVICE_RICH_MAX}
          </span>
        </div>

        {errorMessage === null ? null : (
          <p className={styles.formError}>{errorMessage}</p>
        )}

        <div className={styles.submitArea}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!canSubmit || isPending}
          >
            {isEdit ? '수정 완료' : '서비스 등록'}
          </button>
        </div>
      </form>

      <UploadErrorModal
        open={isImageErrorOpen}
        onClose={() => {
          setIsImageErrorOpen(false);
        }}
      />
    </section>
  );
}

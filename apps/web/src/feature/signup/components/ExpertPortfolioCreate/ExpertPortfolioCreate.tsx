'use client';

import { skipToken, useQuery } from '@tanstack/react-query';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';

import { getPortfolio, type StackType } from '../../api';
import { useBlockBack } from '../../useBlockBack';
import {
  useCreatePortfolio,
  toCreatePortfolioErrorMessage,
} from '../../useCreatePortfolio';
import {
  useUpdatePortfolio,
  toUpdatePortfolioErrorMessage,
} from '../../useUpdatePortfolio';
import Dropdown from '../common/Dropdown';
import FormHeader from '../common/FormHeader';

import {
  BUSINESS_SECTORS,
  DESC_MAX_LENGTH,
  type BusinessSectorId,
} from './constants';
import DetailImageUpload from './DetailImageUpload';
import * as styles from './ExpertPortfolioCreate.css';
import MainImageUpload from './MainImageUpload';
import UploadErrorModal from './UploadErrorModal';

interface Props {
  portfolioId?: string;
  returnUrl?: string;
}

interface FormState {
  title: string;
  designStack: string;
  frontendStack: string;
  backendStack: string;
  clientName: string;
  businessSector: BusinessSectorId | '';
  description: string;
}

interface ImageItem {
  file: File | null; // null이면 기존(이미 업로드된) 이미지
  url: string;
}

const parseStacks = (value: string, stackType: StackType) =>
  value
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name !== '')
    .map((stackName) => ({ stackName, stackType }));

const joinStacks = (
  skills: { stackName: string; stackType: StackType }[],
  stackType: StackType,
) =>
  skills
    .filter((s) => s.stackType === stackType)
    .map((s) => s.stackName)
    .join(', ');

const MIN_IMAGE_WIDTH = 600;
const MAX_IMAGE_HEIGHT = 3000;

// 업로드 전 클라이언트 검증
// 공통: 가로 ≥ 600px, 세로 ≤ 3000px (백엔드와 동일) / 메인: 추가로 1:1 비율
const isValidImageSize = (
  file: File,
  requireSquare: boolean,
): Promise<boolean> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.addEventListener('load', () => {
      URL.revokeObjectURL(url);
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const sizeOk = width >= MIN_IMAGE_WIDTH && height <= MAX_IMAGE_HEIGHT;
      resolve(sizeOk && (!requireSquare || width === height));
    });
    img.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      resolve(false);
    });
    img.src = url;
  });

export default function ExpertPortfolioCreate({ portfolioId, returnUrl }: Props) {
  useBlockBack();
  const isEdit = portfolioId !== undefined;

  const { data: detail } = useQuery({
    queryKey: ['portfolio', portfolioId],
    queryFn: portfolioId ? () => getPortfolio(portfolioId) : skipToken,
  });

  const create = useCreatePortfolio(returnUrl);
  const update = useUpdatePortfolio(returnUrl);
  const isPending = create.isPending || update.isPending;
  const errorMessage = isEdit
    ? toUpdatePortfolioErrorMessage(update.error)
    : toCreatePortfolioErrorMessage(create.error);

  const [form, setForm] = useState<FormState>({
    title: '',
    designStack: '',
    frontendStack: '',
    backendStack: '',
    clientName: '',
    businessSector: '',
    description: '',
  });
  const [mainImage, setMainImage] = useState<ImageItem | null>(null);
  const [detailImages, setDetailImages] = useState<ImageItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!detail) return;
    const d = detail.data;
    setForm({
      title: d.title,
      designStack: joinStacks(d.skills, 'DESIGN'),
      frontendStack: joinStacks(d.skills, 'FRONTEND'),
      backendStack: joinStacks(d.skills, 'BACKEND'),
      clientName: d.clientName,
      businessSector: d.businessSector as BusinessSectorId,
      description: d.description,
    });
    const main = d.images.find((img) => img.isMain);
    setMainImage(main ? { file: null, url: main.imgUrl } : null);
    setDetailImages(
      d.images
        .filter((img) => !img.isMain)
        .map((img) => ({ file: null, url: img.imgUrl })),
    );
  }, [detail]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleBusinessSectorChange = (id: string) => {
    setForm((prev) => ({ ...prev, businessSector: id as BusinessSectorId }));
  };

  const selectImage = async (
    file: File,
    requireSquare: boolean,
    apply: (item: ImageItem) => void,
  ) => {
    if (!(await isValidImageSize(file, requireSquare))) {
      setModalOpen(true);
      return;
    }
    apply({ file, url: URL.createObjectURL(file) });
  };

  const handleMainSelect = (file: File) => {
    void selectImage(file, true, (item) => {
      setMainImage(item);
    });
  };

  const handleMainRemove = () => {
    setMainImage(null);
  };

  const handleDetailSelect = (file: File) => {
    void selectImage(file, false, (item) => {
      setDetailImages((prev) => [...prev, item]);
    });
  };

  const handleDetailRemove = (index: number) => {
    setDetailImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const canSubmit =
    form.title.trim() !== '' &&
    mainImage !== null &&
    detailImages.length > 0 &&
    form.designStack.trim() !== '' &&
    form.frontendStack.trim() !== '' &&
    form.backendStack.trim() !== '' &&
    form.clientName.trim() !== '' &&
    form.businessSector !== '' &&
    form.description.trim() !== '';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isPending) return;

    const body = {
      title: form.title,
      description: form.description,
      clientName: form.clientName,
      businessSector: form.businessSector,
      skills: [
        ...parseStacks(form.designStack, 'DESIGN'),
        ...parseStacks(form.frontendStack, 'FRONTEND'),
        ...parseStacks(form.backendStack, 'BACKEND'),
      ],
    };

    if (portfolioId !== undefined) {
      update.mutate({ portfolioId, mainImage, detailImages, body });
      return;
    }

    if (mainImage.file === null) return; // 생성은 새 이미지만
    create.mutate({
      mainImage: mainImage.file,
      detailImages: detailImages
        .map((d) => d.file)
        .filter((file): file is File => file !== null),
      body,
    });
  };

  return (
    <section className={styles.Container}>
      <FormHeader
        align="left"
        title={
          isEdit ? (
            <>
              포트폴리오를
              <br />
              수정해주세요
            </>
          ) : (
            <>
              나만의 포트폴리오를
              <br />
              등록해주세요!
            </>
          )
        }
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            포트폴리오 제목
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="포트폴리오 제목"
            value={form.title}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>메인 이미지 등록</span>
          <MainImageUpload
            value={mainImage?.url ?? null}
            onSelect={handleMainSelect}
            onRemove={handleMainRemove}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>
            상세 이미지 등록(1개 필수){' '}
            <span className={styles.labelCount}>{detailImages.length}/10</span>
          </span>
          <DetailImageUpload
            values={detailImages.map((d) => d.url)}
            onSelect={handleDetailSelect}
            onRemove={handleDetailRemove}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="designStack" className={styles.label}>
            디자인
          </label>
          <input
            id="designStack"
            type="text"
            name="designStack"
            placeholder="사용한 디자인 툴을 쉼표(,)로 구분하여 입력해주세요. (예: Sketch, Photoshop, Figma)"
            value={form.designStack}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="frontendStack" className={styles.label}>
            프론트엔드
          </label>
          <input
            id="frontendStack"
            type="text"
            name="frontendStack"
            placeholder="사용한 기술을 쉼표(,)로 구분하여 입력해주세요. (예: HTML, CSS, JavaScript)"
            value={form.frontendStack}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="backendStack" className={styles.label}>
            백엔드
          </label>
          <input
            id="backendStack"
            type="text"
            name="backendStack"
            placeholder="사용한 기술을 쉼표(,)로 구분하여 입력해주세요. (예:JavaScript, Nest, AWS)"
            value={form.backendStack}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="clientName" className={styles.label}>
            고객사
          </label>
          <input
            id="clientName"
            type="text"
            name="clientName"
            placeholder="고객사명을 입력해주세요"
            value={form.clientName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>업종</span>
          <Dropdown
            options={BUSINESS_SECTORS}
            value={form.businessSector}
            onChange={handleBusinessSectorChange}
            placeholder="업종을 선택해주세요"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>
            소개
          </label>
          <div className={styles.textareaWrapper}>
            <textarea
              id="description"
              name="description"
              placeholder="간단한 포트폴리오 설명을 입력해주세요"
              value={form.description}
              onChange={handleDescriptionChange}
              maxLength={DESC_MAX_LENGTH}
              className={styles.textarea}
            />
            <span className={styles.counter}>
              {form.description.length}/{DESC_MAX_LENGTH}
            </span>
          </div>
        </div>

        {errorMessage !== null && (
          <p className={styles.formError}>{errorMessage}</p>
        )}
        <div className={styles.submitArea}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!canSubmit || isPending}
          >
            {isEdit ? '수정 완료' : '포트폴리오 등록'}
          </button>
        </div>
      </form>

      <UploadErrorModal open={modalOpen} onClose={handleModalClose} />
    </section>
  );
}

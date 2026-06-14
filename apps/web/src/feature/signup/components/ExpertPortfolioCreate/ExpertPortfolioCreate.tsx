'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';

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

interface FormState {
  title: string;
  mainImage: string | null;
  detailImages: string[];
  designStack: string;
  frontendStack: string;
  backendStack: string;
  clientName: string;
  businessSector: BusinessSectorId | '';
  description: string;
}

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

export default function ExpertPortfolioCreate() {
  const [form, setForm] = useState<FormState>({
    title: '',
    mainImage: null,
    detailImages: [],
    designStack: '',
    frontendStack: '',
    backendStack: '',
    clientName: '',
    businessSector: '',
    description: '',
  });
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleMainSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, mainImage: url }));
  };

  const handleMainRemove = () => {
    setForm((prev) => ({ ...prev, mainImage: null }));
  };

  const handleDetailSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      detailImages: [...prev.detailImages, url],
    }));
  };

  const handleDetailRemove = (index: number) => {
    setForm((prev) => ({
      ...prev,
      detailImages: prev.detailImages.filter((_, i) => i !== index),
    }));
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const canSubmit =
    form.title.trim() !== '' &&
    form.mainImage !== null &&
    form.detailImages.length > 0 &&
    form.designStack.trim() !== '' &&
    form.frontendStack.trim() !== '' &&
    form.backendStack.trim() !== '' &&
    form.clientName.trim() !== '' &&
    form.businessSector !== '' &&
    form.description.trim() !== '';

  return (
    <section className={styles.Container}>
      <FormHeader
        align="left"
        title={
          <>
            나만의 포트폴리오를
            <br />
            등록해주세요!
          </>
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
            value={form.mainImage}
            onSelect={handleMainSelect}
            onRemove={handleMainRemove}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>
            상세 이미지 등록(1개 필수){' '}
            <span className={styles.labelCount}>
              {form.detailImages.length}/10
            </span>
          </span>
          <DetailImageUpload
            values={form.detailImages}
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

        <div className={styles.submitArea}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!canSubmit}
          >
            포트폴리오 등록
          </button>
        </div>
      </form>

      <UploadErrorModal open={modalOpen} onClose={handleModalClose} />
    </section>
  );
}

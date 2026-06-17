'use client';

import { X } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import * as styles from './ConsultationAttachedFileList.css';

interface Props {
  files: File[];
  onRemove: (index: number) => void;
}

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

function getFileKey(file: File, index: number): string {
  return `${file.name}-${String(file.size)}-${String(file.lastModified)}-${String(index)}`;
}

export default function ConsultationAttachedFileList({ files, onRemove }: Props) {
  const imagePreviewUrls = useMemo(
    () =>
      files.map((file) =>
        isImageFile(file) ? URL.createObjectURL(file) : null,
      ),
    [files],
  );

  useEffect(() => {
    return () => {
      for (const url of imagePreviewUrls) {
        if (url !== null) {
          URL.revokeObjectURL(url);
        }
      }
    };
  }, [imagePreviewUrls]);

  if (files.length === 0) {
    return null;
  }

  const imageFiles = files
    .map((file, index) => ({ file, index, previewUrl: imagePreviewUrls[index] }))
    .filter((item): item is { file: File; index: number; previewUrl: string } =>
      item.previewUrl !== null,
    );

  const documentFiles = files
    .map((file, index) => ({ file, index }))
    .filter(({ file }) => !isImageFile(file));

  return (
    <div className={styles.root}>
      {imageFiles.length > 0 ? (
        <ul className={styles.imageList}>
          {imageFiles.map(({ file, index, previewUrl }) => (
            <li key={getFileKey(file, index)} className={styles.imageItem}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={file.name}
                className={styles.imagePreview}
              />
              <button
                type="button"
                className={styles.imageRemoveButton}
                aria-label={`${file.name} 삭제`}
                onClick={() => {
                  onRemove(index);
                }}
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {documentFiles.length > 0 ? (
        <ul className={styles.documentList}>
          {documentFiles.map(({ file, index }) => (
            <li key={getFileKey(file, index)} className={styles.documentItem}>
              <span>{file.name}</span>
              <button
                type="button"
                className={styles.documentRemoveButton}
                aria-label={`${file.name} 삭제`}
                onClick={() => {
                  onRemove(index);
                }}
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

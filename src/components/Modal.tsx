'use client';

import React, { ReactNode } from 'react';
import { useModal } from '@/context/modal/useModal';

interface ModalProps {
  children: ReactNode;
}

export const Modal = ({ children }: ModalProps) => {
  const { isOpenModal, closeModal } = useModal();

  if (!isOpenModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-xs"
      onClick={closeModal}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()} 
      >
        {children}
      </div>
    </div>
  );
};

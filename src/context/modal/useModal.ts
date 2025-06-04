'use client';

import { useContext } from 'react';
import { ModalContext } from './ModalContext';

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal deve ser usado dentro de ModalProvider');
  }

  return context;
};

'use client';

import React, { createContext, useMemo, useState } from 'react';

interface ModalContextData {
  isOpenModal: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextData | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);

  const value = useMemo(
    () => ({
      isOpenModal,
      openModal,
      closeModal,
    }),
    [isOpenModal]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

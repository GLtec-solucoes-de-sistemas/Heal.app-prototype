'use client';

import React, { createContext, useMemo, useState } from 'react';

type ModalType = 'add' | 'delete' | null;

interface ModalContextData {
  modalType: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextData | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType>(null);

  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType(null);

  const value = useMemo(
    () => ({
      modalType,
      openModal,
      closeModal,
    }),
    [modalType]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

"use client";

import React, { useContext, createContext, useMemo, useState } from "react";

type ModalType = "add" | "edit" | null;

interface ModalContextData {
  modalType: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextData | undefined>(
  undefined
);

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

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal deve ser usado dentro de ModalProvider");
  }

  return context;
};

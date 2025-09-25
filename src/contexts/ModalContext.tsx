"use client";

import React, { createContext, useContext, useState, ReactNode, JSX } from "react";
import { Consultation, ConsultationStatus } from "@/models/consultation";

import { ModalAddMedicalConsultation } from "@/components/modals/ModalAddMedicalConsultation";
import { ModalEditMedicalConsultation } from "@/components/modals/ModalEditMedicalConsultation";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { ConfirmAppointmentModal } from "@/components/modals/ConfirmAppointmentModal";

enum ModalOptionsEnum {
  create = "CREATE",
  edit = "EDIT",
  confirm = "CONFIRM",
  confirmAppointment = "CONFIRM_APPOINTMENT",
}

type ConfirmModalConfig = {
  text: string;
  action: () => void;
  isLoading?: boolean;
};

type ConfirmAppointmentConfig = {
  consultation: Consultation;
  onConfirm: (status: ConsultationStatus) => void;
};

type ModalContextValue = {
  onAdd: () => void;
  onEdit: (consultation: Consultation) => void;
  onConfirm: (config: ConfirmModalConfig) => void;
  onConfirmAppointment: (config: ConfirmAppointmentConfig) => void;
  closeModal: () => void;
  openModal: boolean;
};

export const ModalContext = createContext<ModalContextValue>(undefined as any);

type ModalProviderProps = {
  children: ReactNode;
};

export function ModalProvider({ children }: ModalProviderProps) {
  const [consultation, setConsultation] = useState<Consultation | undefined>();
  const [modalOption, setModalOption] = useState<ModalOptionsEnum | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<ConfirmModalConfig | null>(null);
  const [confirmAppointmentConfig, setConfirmAppointmentConfig] = useState<ConfirmAppointmentConfig | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);

  const closeModal = () => {
    setConsultation(undefined);
    setConfirmConfig(null);
    setConfirmAppointmentConfig(null);
    setModalOption(null);
    setOpenModal(false);
  };

  const onAdd = () => {
    setModalOption(ModalOptionsEnum.create);
    handleOpen();
  };

  const onEdit = (c: Consultation) => {
    setConsultation(c);
    setModalOption(ModalOptionsEnum.edit);
    handleOpen();
  };

  const onConfirm = (config: ConfirmModalConfig) => {
    setConfirmConfig(config);
    setModalOption(ModalOptionsEnum.confirm);
    handleOpen();
  };

  const onConfirmAppointment = (config: ConfirmAppointmentConfig) => {
    setConfirmAppointmentConfig(config);
    setModalOption(ModalOptionsEnum.confirmAppointment);
    handleOpen();
  };

  const value: ModalContextValue = {
    onAdd,
    onEdit,
    onConfirm,
    onConfirmAppointment,
    closeModal,
    openModal,
  };

  const modalComponents: Record<ModalOptionsEnum, JSX.Element | null> = {
    [ModalOptionsEnum.create]: <ModalAddMedicalConsultation onClose={closeModal} />,
    [ModalOptionsEnum.edit]: consultation
      ? <ModalEditMedicalConsultation consultation={consultation} onClose={closeModal} />
      : null,
    [ModalOptionsEnum.confirm]: confirmConfig
      ? <ConfirmModal
          text={confirmConfig.text}
          onAction={confirmConfig.action}
          isLoading={confirmConfig.isLoading ?? false}
          onClose={closeModal}
        />
      : null,
    [ModalOptionsEnum.confirmAppointment]: confirmAppointmentConfig
      ? <ConfirmAppointmentModal
          consultation={confirmAppointmentConfig.consultation}
          onConfirm={confirmAppointmentConfig.onConfirm}
        />
      : null,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {openModal && modalOption && modalComponents[modalOption]}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal deve ser usado dentro de ModalProvider");
  return context;
}

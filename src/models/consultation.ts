export type ConsultationStatus =
  | "Atendido"
  | "Cancelado"
  | "Aguardando"
  | "Confirmação Pendente";

export interface Consultation {
  id: string;
  consultationDate: string;
  consultationType: string;
  document: string;
  email: string;
  patientName: string;
  phoneNumber: string;
  professionalName: string;
  status: ConsultationStatus;
};

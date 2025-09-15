export type ConsultationStatus =
  | "Atendido"
  | "Cancelado"
  | "Aguardando"
  | "Confirmação Pendente";

export type Consultation = {
  id: string;
  document: string;
  occurred_at: Date;
  consultation_type: string;
  healthcare: string;
  patient_email: string;
  patient_name: string;
  patient_phone: string;
  status: string;
};

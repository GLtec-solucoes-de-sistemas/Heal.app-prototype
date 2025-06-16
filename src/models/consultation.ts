export type ConsultationStatus = 'Atendido' | 'Cancelado' | 'Aguardando';

export type Consultation = {
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

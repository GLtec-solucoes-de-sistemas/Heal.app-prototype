import { NextResponse } from 'next/server';

export type Consultation = {
  id: string;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  consultationType: string;
  professional: string;
  date: string;
  time: string;
  status: 'Atendido' | 'Em andamento' | 'Cancelado';
};

const consultations: Consultation[] = [];

export async function GET() {
  return NextResponse.json(consultations);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newConsultation: Consultation = {
      id: crypto.randomUUID(),
      ...data,
    };

    consultations.push(newConsultation);

    console.log('Consulta cadastrada:', newConsultation);

    return NextResponse.json(newConsultation, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar consulta:', error);
    return NextResponse.json({ error: 'Erro ao processar os dados' }, { status: 500 });
  }
}

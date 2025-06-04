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
};

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
};

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID da consulta não fornecido' }, { status: 400 });
    }

    const index = consultations.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 });
    }

    consultations.splice(index, 1);

    console.log('Consulta deletada:', id);

    return NextResponse.json({ message: 'Consulta deletada com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar consulta:', error);
    return NextResponse.json({ error: 'Erro ao deletar consulta' }, { status: 500 });
  }
};

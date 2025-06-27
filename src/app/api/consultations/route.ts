import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { adminFirestore } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const snapshot = await adminFirestore.collection('consultations').get();

    const consultations = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        consultationDate: data.consultationDate?.toDate().toISOString() || null,
        consultationType: data.consultationType || '',
        document: data.document || '',
        email: data.email || '',
        patientName: data.patientName || '',
        phoneNumber: data.phoneNumber || '',
        professionalName: data.professionalName || '',
        status: data.status || '',
      };
    });

    return NextResponse.json(consultations);
  } catch (error) {
    console.error('Erro ao buscar consultas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      consultationDate,
      consultationType,
      document,
      email,
      patientName,
      phoneNumber,
      professionalName,
      status = 'Confirmação Pendente',
    } = body;

    if (
      !consultationDate ||
      !consultationType ||
      !document ||
      !email ||
      !patientName ||
      !phoneNumber ||
      !professionalName
    ) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes' },
        { status: 400 }
      );
    }

    const confirmationToken = uuidv4();

    const consultationRef = await adminFirestore
      .collection('consultations')
      .add({
        consultationDate: Timestamp.fromDate(new Date(consultationDate)),
        consultationType,
        document,
        email,
        patientName,
        phoneNumber,
        professionalName,
        status,
        confirmationToken,
      });

    const whatsappApiUrl =
      'https://whatsapp-messenger-wj28.onrender.com/send-message';

    await fetch(whatsappApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phoneNumber,
        patientName,
        confirmationToken,
      }),
    });

    const createdDoc = await consultationRef.get();
    const createdData = createdDoc.data();

    return NextResponse.json({
      id: createdDoc.id,
      ...createdData,
      consultationDate:
        createdData?.consultationDate?.toDate().toISOString() || null,
    });
  } catch (error) {
    console.error('Erro ao criar consulta:', error);
    return NextResponse.json(
      { error: 'Erro ao criar consulta' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID da consulta não fornecido.' },
        { status: 400 }
      );
    }

    await adminFirestore.collection('consultations').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar consulta:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar consulta' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id || Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'ID da consulta ou dados de atualização ausentes.' },
        { status: 400 }
      );
    }

    const consultationRef = adminFirestore.collection('consultations').doc(id);
    const consultationDoc = await consultationRef.get();

    if (!consultationDoc.exists) {
      return NextResponse.json(
        { error: 'Consulta não encontrada.' },
        { status: 404 }
      );
    }

    await consultationRef.update({
      ...updateData,
      consultationDate: updateData.consultationDate
        ? Timestamp.fromDate(new Date(updateData.consultationDate))
        : undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar consulta' },
      { status: 500 }
    );
  }
}

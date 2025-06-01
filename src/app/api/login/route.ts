import { NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'Usuário sem dados no Firestore' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      ...userData,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[LOGIN ERROR]', error.message);
    } else {
      console.error('[LOGIN ERROR] Erro desconhecido:', error);
    }

    return NextResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
  }
}

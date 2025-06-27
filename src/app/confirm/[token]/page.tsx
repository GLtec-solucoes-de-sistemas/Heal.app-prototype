import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function ConfirmPage({ params }: { params: { token: string } }) {
  const { token } = params;

  const q = query(
    collection(db, 'consultations'),
    where('confirmationToken', '==', token)
  );
  const snapshot = await getDocs(q);

  let status: 'success' | 'error';

  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    await updateDoc(docRef, { status: 'Aguardando' });
    status = 'success';
  } else {
    status = 'error';
  }

  return (
    <div className="p-10 text-center">
      {status === 'success' && (
        <p className="text-green-600">✅ Consulta confirmada!</p>
      )}
      {status === 'error' && (
        <p className="text-red-600">
          ❌ Link inválido ou consulta não encontrada.
        </p>
      )}
    </div>
  );
}

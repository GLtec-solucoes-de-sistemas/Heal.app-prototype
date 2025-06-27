import { query, collection, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import React from "react";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    token: string;
  };
};

export default async function ConfirmPage({ params }: Props) {
  const token = params.token;

  let status: "success" | "error" = "error";

  try {
    const q = query(
      collection(db, "consultations"),
      where("confirmationToken", "==", token)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, { status: "Aguardando" });
      status = "success";
    }
  } catch (e) {
    console.error("Erro ao confirmar consulta:", e);
  }

  return (
    <div className="p-10 text-center">
      {status === "success" && (
        <p className="text-green-600">✅ Consulta confirmada!</p>
      )}
      {status === "error" && (
        <p className="text-red-600">
          ❌ Link inválido ou consulta não encontrada.
        </p>
      )}
    </div>
  );
}

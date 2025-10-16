"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { CardHome } from "@/components/CardHome";
import { Columns3Cog, LifeBuoy, CalendarHeart } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p className="p-6 text-gray-700">Carregando...</p>;
  }

  return (
    <div className="h-screen mt-5 px-5 flex flex-col items-center justify-start bg-gray-50 text-gray-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <CardHome
          title="Consultas Marcadas"
          description="Controle da agenda e agendamentos"
          icon={CalendarHeart}
          onClick={() => router.push("/")}
        />
        <CardHome
          title="Gestão e Métricas"
          description="Acompanhe estatísticas e performance da equipe de saúde."
          icon={Columns3Cog}
          // onClick={() => router.push("/gestao")}
        />
        <CardHome
          title="Central de Ajuda"
          description="Tire dúvidas, leia artigos e entre em contato com o suporte."
          icon={LifeBuoy}
          // onClick={() => router.push("/ajuda")}
        />
      </div>
    </div>
  );
}

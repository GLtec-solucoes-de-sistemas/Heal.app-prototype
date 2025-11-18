"use client";

import { useRouter } from "next/navigation";
import { CardHome } from "@/components/ui/CardHome";
import { Columns3Cog, LifeBuoy, CalendarHeart } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="h-screen mt-5 px-5 flex flex-col items-center justify-start bg-gray-50 text-gray-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <CardHome
          title="Consultas Marcadas"
          description="Controle da agenda e agendamentos"
          icon={CalendarHeart}
          onClick={() => router.push("/consultations")}
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

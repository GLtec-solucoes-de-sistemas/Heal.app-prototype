"use client";

import { Mail, IdCard, Stethoscope } from "lucide-react";

type FiltersType = {
  patientName: string;
  email: string;
  cpf: string;
  consultationType: string;
  professionalName: string;
  startDate: string;
  endDate: string;
};

type Props = {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
};

const InputWithIcon = ({
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  icon: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => (
  <div className="relative w-full">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="pl-9 pr-3 py-2 bg-white text-gray-800 rounded-md w-full border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#3B695B]"
    />
  </div>
);

export const ConsultationFilters = ({ filters, setFilters }: Props) => {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm w-full max-w-xs space-y-4">
      <InputWithIcon
        icon={Mail}
        placeholder="Horário"
        value={filters.email}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, email: e.target.value }))
        }
      />

      <InputWithIcon
        icon={IdCard}
        placeholder="Buscar por CPF"
        value={filters.cpf}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, cpf: e.target.value }))
        }
      />

      <InputWithIcon
        icon={Stethoscope}
        placeholder="Profissional que irá atender"
        value={filters.professionalName}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, professionalName: e.target.value }))
        }
      />

      <InputWithIcon
        icon={Stethoscope}
        placeholder="Tipo de consulta"
        value={filters.consultationType}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, consultationType: e.target.value }))
        }
      />
    </div>
  );
};

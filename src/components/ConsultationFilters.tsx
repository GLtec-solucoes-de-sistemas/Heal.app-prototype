'use client';

import { User, Mail, IdCard, Stethoscope } from 'lucide-react';

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
  type = 'text',
}: {
  icon: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => (
  <div className="relative w-full max-w-xs">
    <Icon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="pl-8 pr-2 py-1.5 bg-zinc-900 text-white rounded-md w-full border border-zinc-700 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
    />
  </div>
);

const DateRangeInput = ({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: {
  startDate: string;
  endDate: string;
  onStartChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col gap-1 w-full max-w-xs">
    <label className="text-sm text-gray-300">Período da consulta</label>
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={startDate}
        onChange={onStartChange}
        className="bg-zinc-900 text-white rounded-md border border-zinc-700 text-sm px-2 py-1 w-32 focus:outline-none focus:ring-1 focus:ring-teal-400"
      />
      <span className="text-gray-400 text-sm">até</span>
      <input
        type="date"
        value={endDate}
        onChange={onEndChange}
        className="bg-zinc-900 text-white rounded-md border border-zinc-700 text-sm px-2 py-1 w-32 focus:outline-none focus:ring-1 focus:ring-teal-400"
      />
    </div>
  </div>
);

export const ConsultationFilters = ({ filters, setFilters }: Props) => {
  return (
    <div className="bg-zinc-800 p-4 rounded-lg shadow w-full max-w-xs space-y-4">
      <DateRangeInput
        startDate={filters.startDate}
        endDate={filters.endDate}
        onStartChange={(e) =>
          setFilters((prev) => ({ ...prev, startDate: e.target.value }))
        }
        onEndChange={(e) =>
          setFilters((prev) => ({ ...prev, endDate: e.target.value }))
        }
      />

      <InputWithIcon
        icon={User}
        placeholder="Buscar por nome"
        value={filters.patientName}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, patientName: e.target.value }))
        }
      />

      <InputWithIcon
        icon={Mail}
        placeholder="Buscar por e-mail"
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
        placeholder="Buscar por profissional"
        value={filters.professionalName}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            professionalName: e.target.value,
          }))
        }
      />

      <InputWithIcon
        icon={Stethoscope}
        placeholder="Tipo de consulta"
        value={filters.consultationType}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            consultationType: e.target.value,
          }))
        }
      />
    </div>
  );
};

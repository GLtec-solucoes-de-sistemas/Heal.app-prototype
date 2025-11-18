"use client";

import { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import "../../styles/calendar-custom.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ConsultationCalendarProps = {
  consultations: {
    id: string;
    consultationDate: string;
    patientName: string;
  }[];
  onSelectDate?: (date: Date | null) => void;
};

export function ConsultationCalendar({ consultations, onSelectDate }: ConsultationCalendarProps) {
  const [value, setValue] = useState<Date>(new Date());
  const [activeMonth, setActiveMonth] = useState<Date>(new Date());

  const handleChange: CalendarProps["onChange"] = (selectedValue) => {
    if (selectedValue instanceof Date) {
      setValue(selectedValue);
      onSelectDate?.(selectedValue);
    }
  };

  const hasConsultation = (date: Date) =>
    consultations.some((c) => isSameDay(parseISO(c.consultationDate), date));

  const goToPrevMonth = () => {
    setActiveMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setActiveMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const goToToday = () => {
    const today = new Date();
    setActiveMonth(today);
    setValue(today);
    onSelectDate?.(today);
  };

  const showAllConsultations = () => {
    setValue(new Date());
    onSelectDate?.(null);
  };

  return (
    <div className="bg-white p-4 w-full text-black rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded hover:bg-gray-100 transition"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="text-lg font-semibold capitalize">
          {format(activeMonth, "MMMM yyyy", { locale: ptBR })}
        </h2>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded hover:bg-gray-100 transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mb-2">
        <button
          onClick={goToToday}
          className="px-3 py-1 text-sm text-white bg-[#3B695B] rounded hover:bg-[#2f594c] transition cursor-pointer"
        >
          Hoje
        </button>
        <button
          onClick={showAllConsultations}
          className="px-3 py-1 text-sm text-black border border-[#3B695B] rounded hover:bg-gray-100 transition cursor-pointer"
        >
          Mostrar todas as consultas
        </button>
      </div>

      <Calendar
        onChange={handleChange}
        value={value}
        locale="pt-BR"
        activeStartDate={activeMonth}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setActiveMonth(activeStartDate);
        }}
        prevLabel={null}
        nextLabel={null}
        prev2Label={null}
        next2Label={null}
        formatShortWeekday={(locale, date) =>
          ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"][date.getDay()]
        }
        tileContent={({ date }) =>
          hasConsultation(date) ? (
            <div className="flex justify-center mt-1">
              <span className="w-2 h-2 bg-[#000000] rounded-full"></span>
            </div>
          ) : null
        }
      />
    </div>
  );
}

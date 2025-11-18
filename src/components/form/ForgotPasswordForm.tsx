"use client";

import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
};

export const ForgotPasswordForm = ({
  onBack,
  onSent,
}: {
  onBack: () => void;
  onSent: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Enviar link de reset para:", data.email);
    onSent();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[400px] space-y-6 font-sans text-sm"
    >
      <div className="space-y-1">
        <div className="relative h-[42px]">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="email"
            placeholder="E-mail"
            {...register("email", { required: "E-mail é obrigatório" })}
            className="w-full h-full pl-10 pr-3 py-2 rounded-md text-[#4C505E] outline-none focus:ring-2 focus:ring-[#009388] placeholder-gray-400"
          />
        </div>
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-[#009388] hover:bg-[#00796d] text-white py-2 rounded-md font-medium transition-colors cursor-pointer"
      >
        Enviar link de redefinição
      </button>

      <button
        type="button"
        onClick={onBack}
        className="text-sm text-[#606370] cursor-pointer hover:text-[#00796d] w-full text-center"
      >
        Voltar para o login
      </button>
    </form>
  );
};

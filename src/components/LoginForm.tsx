"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

type FormData = {
  patient_email: string;
  password: string;
};

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        data.patient_email,
        data.password,
      );

      const idToken = await user.getIdToken(true);

      router.push("/");
      return idToken;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Erro ao fazer login:", err.message);
      } else {
        console.error("Erro desconhecido:", err);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[400px] space-y-6 font-sans text-sm"
    >
      <div className="space-y-1">
        <div className="relative h-[42px]">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            size={18}
          />
          <input
            type="patient_email"
            placeholder="E-MAIL"
            {...register("patient_email", { required: "E-mail é obrigatório" })}
            className={`w-full h-full pl-10 pr-3 py-2 rounded-md bg-[#2A2A2A] text-white border ${
              errors.patient_email ? "border-red-500" : "border-gray-600"
            } outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400`}
          />
        </div>
        {errors.patient_email && (
          <span className="text-red-500 text-xs">{errors.patient_email.message}</span>
        )}
      </div>

      <div className="space-y-1">
        <div className="relative h-[42px]">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            size={18}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="SENHA"
            {...register("password", { required: "Senha é obrigatória" })}
            className={`w-full h-full pl-10 pr-10 py-2 rounded-md bg-[#2A2A2A] text-white border ${
              errors.password ? "border-red-500" : "border-gray-600"
            } outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-[#00B09B] hover:bg-[#009688] text-white py-2 rounded-md font-medium transition-colors cursor-pointer"
      >
        Entrar
      </button>
    </form>
  );
};

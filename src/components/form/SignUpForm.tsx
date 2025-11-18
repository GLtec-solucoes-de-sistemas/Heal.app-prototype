"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

type FormData = {
  name: string;
  email: string;
  phone: number;
  password: string;
  confirmPassword: string;
};

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      console.log("Usuário criado:", user);
      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        console.error("Erro desconhecido:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[400px] space-y-6 font-sans text-sm"
    >
      <div className="space-y-1">
        <div className="relative h-[42px]">
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="name"
            placeholder="Nome"
            {...register("name", { required: "Nome é obrigatório" })}
            className="w-full h-full pl-10 pr-3 py-2 rounded-md text-[#4C505E] outline-none focus:ring-2 focus:ring-[#009388] placeholder-gray-400"
          />
        </div>
        {errors.name && (
          <span className="text-red-500 text-xs">
            {errors.name.message}
          </span>
        )}
      </div>

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
          <span className="text-red-500 text-xs">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="relative h-[42px]">
          <Phone
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="phone"
            placeholder="Telefone"
            {...register("phone", { required: "Telefone é obrigatório" })}
            className="w-full h-full pl-10 pr-3 py-2 rounded-md text-[#4C505E] outline-none focus:ring-2 focus:ring-[#009388] placeholder-gray-400"
          />
        </div>
        {errors.phone && (
          <span className="text-red-500 text-xs">
            {errors.phone.message}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="relative h-[42px]">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            {...register("password", {
              required: "Senha é obrigatória",
              minLength: {
                value: 6,
                message: "Senha mínima de 6 caracteres",
              },
            })}
            className="w-full h-full pl-10 pr-10 py-2 rounded-md text-[#4C505E] outline-none focus:ring-2 focus:ring-[#009388] placeholder-gray-400"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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

      <div className="space-y-1">
        <div className="relative h-[42px]">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar senha"
            {...register("confirmPassword", {
              required: "Confirmação obrigatória",
              validate: (value) =>
                value === watch("password") ||
                "As senhas não coincidem",
            })}
            className="w-full h-full pl-10 pr-10 py-2 rounded-md text-[#4C505E] outline-none focus:ring-2 focus:ring-[#009388] placeholder-gray-400"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="text-red-500 text-xs">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#009388] hover:bg-[#00796d] text-white py-2 rounded-md font-medium transition-colors cursor-pointer"
      >
        {loading ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
};

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, Variable } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@apollo/client/react";
import { LoginDocument } from "@/graphql/generated/graphql";

interface FormData {
  email: string;
  password: string;
};

export const LoginForm = ({ onForgotPassword }: { onForgotPassword: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
  const { setUser } = useAuth();
  const [loginMutate] = useMutation(LoginDocument);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true);

      // const { data: dataMutation } = await loginMutate({
      //   variables: {
      //     payload: {
      //       email: formData.email,
      //       password: formData.password
      //     }
      //   }
      // });

      // console.log(dataMutation);

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("E-mail ou senha inválidos");
        
        return;
      }

      const user = getUserFromToken(data.accessToken);

      setUser(user);

      router.replace("/");
    } catch(error) {
      toast.error(`Erro ao logar: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[400px] space-y-6 font-sans text-sm"
      noValidate
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

      <div className="space-y-1">
        <div className="relative h-[42px]">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            {...register("password", { required: "Senha é obrigatória" })}
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
          <span className="text-red-500 text-xs">{errors.password.message}</span>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-[#606370] cursor-pointer hover:text-[#00796d] hover:underline"
        >
          Esqueci minha senha
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-[#009388] hover:bg-[#00796d] text-white py-2 rounded-md font-medium transition-colors cursor-pointer
    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

    </form>
  );
};

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";
import loginPage from "../../../public/loginPage.svg";
import loginTitle from "../../../public/loginTitle.svg";

const LoginPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || user)
    return <p className="p-6 text-white">Redirecionando...</p>;

  return (
    <div className="flex h-screen w-screen bg-white">
      <div className="w-1/2 h-full">
        <Image
          src={loginPage}
          alt="Imagem da página de login"
          className="w-full h-full object-cover"
          priority
        />
      </div>

      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="w-[400px] rounded-lg bg-white shadow-[0_0_20px_5px_rgba(0,0,0,0.2)] p-10 flex flex-col items-center justify-center gap-6">
          <Image
            src={loginTitle}
            alt="Logo da página de login"
            height={120}
            width={200}
            priority
          />
          <h1 className="text-[#009388] text-3xl font-medium flex self-start">Fazer login</h1>
          <h2 className="text-[#4C505E] font-normal text-left">
            Seja bem-vindo(a)! Insira seu e-mail e senha para entrar em sua conta.
          </h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

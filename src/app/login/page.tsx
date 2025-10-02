"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { CreateAccount } from "@/components/CreateAccount";
import Image from "next/image";
import loginPage from "../../../public/loginPage.svg";
import loginTitle from "../../../public/loginTitle.svg";

type ViewState = "login" | "forgot" | "sent";

const LoginPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<ViewState>("login");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || user) return <p className="p-6 text-white">Redirecionando...</p>;

  const renderTitle = () => {
    return view === "login"
      ? "Fazer login"
      : view === "forgot"
      ? "Redefinir senha"
      : "";
  };

  const renderSubtitle = () => {
    return view === "login"
      ? "Seja bem-vindo(a)! Insira seu e-mail e senha para entrar em sua conta."
      : view === "forgot"
      ? "Informe seu e-mail e enviaremos um link para redefinir sua senha."
      : "";
  };

  return (
    <div className="flex h-screen w-screen bg-white flex-col lg:flex-row">
      <div className="hidden lg:block lg:w-1/2 h-1/3 lg:h-full">
        <Image
          src={loginPage}
          alt="Imagem da página de login"
          className="w-full h-full object-cover"
          priority
        />
      </div>

      <div className="flex w-full lg:w-1/2 h-full items-center justify-center p-6">
        <div className="w-full max-w-md rounded-lg bg-white shadow-[0_0_20px_5px_rgba(0,0,0,0.2)] p-6 sm:p-10 flex flex-col items-center justify-center gap-6">
          <Image
            src={loginTitle}
            alt="Logo da página de login"
            height={120}
            width={200}
            priority
          />

          <h1 className="text-[#009388] text-2xl sm:text-3xl font-medium self-start">
            {renderTitle()}
          </h1>

          {renderSubtitle() && (
            <h2 className="text-[#4C505E] font-normal text-sm sm:text-base text-left">
              {renderSubtitle()}
            </h2>
          )}

          {view === "login" && (
            <>
              <LoginForm onForgotPassword={() => setView("forgot")} />
              <CreateAccount />
            </>
          )}

          {view === "forgot" && (
            <ForgotPasswordForm
              onBack={() => setView("login")}
              onSent={() => setView("sent")}
            />
          )}

          {view === "sent" && (
            <div className="w-full max-w-[400px] space-y-6 font-sans text-sm text-center">
              <p className="text-[#009388] text-base">E-mail enviado com sucesso!</p>
              <p className="text-[#4C505E] text-sm">
                Por favor, verifique sua caixa de entrada para redefinir sua senha.
              </p>
              <button
                type="button"
                onClick={() => setView("login")}
                className="w-full bg-[#009388] hover:bg-[#00796d] text-white py-2 rounded-md font-medium transition-colors cursor-pointer"
              >
                Voltar para o login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

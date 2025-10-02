"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import loginPage from "../../../public/loginPage.svg";
import loginTitle from "../../../public/loginTitle.svg";
import { SignupForm } from "@/components/SignUpForm";

const CreateAccount = () => {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push("/login");
  }
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
            Criação de Conta
          </h1>

          <h2 className="text-[#4C505E] font-normal text-sm sm:text-base text-left">
            Preencha os campos abaixo para criar sua conta e começar a usar a Heal!
          </h2>

          <SignupForm />

          <button
            type="button"
            onClick={handleBackToLogin}
            className="text-sm text-[#606370] cursor-pointer hover:text-[#00796d] w-full text-center"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;

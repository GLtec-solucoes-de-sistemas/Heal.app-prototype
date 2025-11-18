"use client";

import { useRouter } from "next/navigation";

export const CreateAccount = () => {
  const router = useRouter();

  return (
    <div className="w-full text-center mt-2">
      <p className="text-sm text-[#606370]">
        Ainda não tem uma conta?
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="text-[#009388] font-medium cursor-pointer ml-1 hover:text-[#00796d] hover:underline"
        >
          Crie sua conta
        </button>
      </p>
    </div>
  );
};

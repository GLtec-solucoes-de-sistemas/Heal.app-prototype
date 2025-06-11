'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import Image from 'next/image';
import loginPage from '../../../public/loginPage.svg';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || user)
    return <p className="p-6 text-white">Redirecionando...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-[600px] h-[700px] bg-[#1E1E1E] rounded-lg shadow-lg p-10 flex flex-col items-center justify-center gap-6">
        <Image
          src={loginPage}
          alt="Logo da página de login"
          height={120}
          width={200}
          priority
        />
        <h2 className="text-white text-lg font-medium">Acesse sua conta</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;

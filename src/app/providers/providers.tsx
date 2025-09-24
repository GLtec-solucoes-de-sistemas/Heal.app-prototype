'use client';

import { ApolloProvider } from "@apollo/client/react";
import { client } from '@/graphql/apollo-client';
import { ModalProvider } from '@/contexts/ModalContext';
import { AuthProvider } from '@/contexts/AuthContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
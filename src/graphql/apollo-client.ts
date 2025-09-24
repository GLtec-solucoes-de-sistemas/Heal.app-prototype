// lib/apollo-client.ts
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
// import * as session from '../session'; // quando integrar com seu sistema de auth

export function createSimpleClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql',
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
      },
      watchQuery: {
        fetchPolicy: 'network-only',
      },
    },
  });

  return client;
}

// Versão completa com auth (comentada para você integrar depois)
export function createClient(
  endpoint: string,
  options?: Partial<ConstructorParameters<typeof ApolloClient>[0]>,
) {
  const httpLink = new HttpLink({
    uri: endpoint,
  });

  // Para upload de arquivos (descomente se precisar)
  // const httpLink = createUploadLink({
  //   uri: endpoint,
  // });

  const errorLink = new ErrorLink(({ error }) => {
    // Verifica se é um erro GraphQL
    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach((gqlError) => {
        if (
          gqlError.message === 'Unauthorized' ||
          gqlError.extensions?.status === 401 ||
          gqlError.message === 'Forbidden resource'
        ) {
          // session.logout(); // descomente quando integrar
          // Por enquanto, apenas limpe o token local
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }

        console.log(
          `[GraphQL error]: Message: ${gqlError.message}, Location: ${JSON.stringify(gqlError.locations)}, Path: ${gqlError.path}`,
        );
      });
    } else {
      // Erro de rede ou outro tipo
      console.log(`[Network error]: ${error}`);

      // Se for erro 401/403 baseado na mensagem
      if (error.message.includes('401') || error.message.includes('403') ||
        error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    }
  });

  const authLink = new SetContextLink((prevContext) => {
    // Pega o token do localStorage (ou do seu sistema de session)
    // const token = session.getToken(); // quando integrar
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    return {
      headers: {
        ...prevContext.headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const apolloClient = new ApolloClient({
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
      },
      watchQuery: {
        fetchPolicy: 'network-only',
      },
    },
    cache: new InMemoryCache(),
    ...options,
    link: ApolloLink.from([authLink, errorLink, httpLink]),
  });

  // Quando integrar com seu sistema de session
  // session.onSignOut(() => {
  //   apolloClient.clearStore();
  // });

  // Por enquanto, você pode usar um listener simples
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === 'token' && !e.newValue) {
        // Token foi removido, limpa o cache
        apolloClient.clearStore();
      }
    });
  }

  return apolloClient;
}

// Cliente padrão para usar
export const client = createClient(
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql'
);
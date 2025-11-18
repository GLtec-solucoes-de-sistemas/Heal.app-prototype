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
import { deleteCookie } from 'cookies-next';

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
    const handleLogout = () => {
      if (typeof window !== "undefined") {
        deleteCookie("accessToken");
        window.location.href = "/login";
      }
    };
    // Verifica se é um erro GraphQL
    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach((gqlError) => {
        if (
          gqlError.message === 'Unauthorized' ||
          gqlError.extensions?.status === 401 ||
          gqlError.message === 'Forbidden resource'
        ) {
          handleLogout()
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
        handleLogout()
      }
    }
  });

  const authLink = new SetContextLink((prevContext) => {
    const token = typeof window !== "undefined"
      ? document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1]
      : null;

    return {
      headers: {
        ...prevContext.headers,
        authorization: token ? `Bearer ${token}` : "",
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

  return apolloClient;
}

// Cliente padrão para usar
export const client = createClient(
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql'
);
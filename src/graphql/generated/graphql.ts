import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type Authorization = {
  __typename: 'Authorization';
  accessToken: Scalars['String']['output'];
  refreshToken: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  user: User;
};

export type AuthorizeInput = {
  userId: Scalars['ID']['input'];
};

export type ConsultationType = {
  __typename: 'ConsultationType';
  /** Data de criação */
  createdAt: Scalars['DateTime']['output'];
  /** Data que o tipo de consulta foi deletado */
  deletedAt: Maybe<Scalars['DateTime']['output']>;
  /** ID do healthcare_user */
  healthcareUserId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  /** Nome do tipo de consulta */
  slugName: Scalars['String']['output'];
  /** Data de modificação */
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateConsultationTypeInput = {
  defaultPrice: Scalars['Float']['input'];
  healthcareUserId: Scalars['ID']['input'];
  slugName: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: UserRole;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
  authorize: Authorization;
  createConsultationType: ConsultationType;
  createUser: User;
  login: Authorization;
  updateConsultationType: ConsultationType;
};


export type MutationAuthorizeArgs = {
  payload: AuthorizeInput;
};


export type MutationCreateConsultationTypeArgs = {
  payload: CreateConsultationTypeInput;
};


export type MutationCreateUserArgs = {
  payload: CreateUserInput;
};


export type MutationLoginArgs = {
  payload: LoginInput;
};


export type MutationUpdateConsultationTypeArgs = {
  id: Scalars['ID']['input'];
  payload: UpdateConsultationTypeInput;
};

export type Query = {
  __typename: 'Query';
  hello: Scalars['String']['output'];
  me: User;
};

export type UpdateConsultationTypeInput = {
  defaultPrice?: InputMaybe<Scalars['Float']['input']>;
  slugName?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename: 'User';
  /** Data de criação */
  createdAt: Scalars['DateTime']['output'];
  /** Data que a usuario foi deletado */
  deletedAt: Maybe<Scalars['DateTime']['output']>;
  /** e-mail do usuário */
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Nome do usuário */
  name: Scalars['String']['output'];
  /** Token de atualização do usuário */
  refreshToken: Maybe<Scalars['String']['output']>;
  /** Função do usuário */
  role: Scalars['String']['output'];
  /** Data de modificação */
  updatedAt: Scalars['DateTime']['output'];
};

/** Possíveis funções do usuário */
export enum UserRole {
  Admin = 'admin',
  Healthcare = 'healthcare',
  Secretary = 'secretary'
}

export type BaseLoginFragment = { __typename: 'Authorization', accessToken: string, refreshToken: string | null, type: string, user: { __typename: 'User', id: string, email: string, name: string, role: string } };

export type LoginMutationVariables = Exact<{
  payload: LoginInput;
}>;


export type LoginMutation = { login: { __typename: 'Authorization', accessToken: string, refreshToken: string | null, type: string, user: { __typename: 'User', id: string, email: string, name: string, role: string } } };

export type BaseUserFragment = { __typename: 'User', id: string, name: string, email: string, role: string, createdAt: string, deletedAt: string | null, refreshToken: string | null, updatedAt: string };

export type CreateUserMutationVariables = Exact<{
  payload: CreateUserInput;
}>;


export type CreateUserMutation = { createUser: { __typename: 'User', id: string, name: string, email: string, role: string, createdAt: string, deletedAt: string | null, refreshToken: string | null, updatedAt: string } };

export const BaseLoginFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseLogin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Authorization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<BaseLoginFragment, unknown>;
export const BaseUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<BaseUserFragment, unknown>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseLogin"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseLogin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Authorization"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payload"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payload"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BaseUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BaseUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
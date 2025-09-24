import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  documents: [
    'src/graphql/**/*.graphql',
    'src/graphql/**/*.gql',
    '!src/graphql/generated/**/*'
  ],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node'
      ],
      config: {
        scalars: {
          DateTime: 'string',
          Date: 'string',
          UUID: 'string',
          JSON: 'any',
        },
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        avoidOptionals: {
          field: true,
          inputValue: false
        },
        defaultScalarType: 'unknown'
      }
    },
    './schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true
      }
    }
  }
}

export default config

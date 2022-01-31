import { linkToExecutor } from '@graphql-tools/utils';
import { makeRemoteExecutableSchema as graphqlToolsMakeRemoteExecutableSchema } from '@graphql-tools/wrap';
import { GraphQLSchema } from 'graphql'
import { importSchema } from 'graphql-import'
import { SharedLink } from './SharedLink'

const typeDefsCache: { [schemaPath: string]: string } = {}
const remoteSchemaCache: { [endpoint: string]: GraphQLSchema } = {}

export function getCachedTypeDefs(
  schemaPath: string,
  disableCache: boolean = false,
): string {
  if (typeDefsCache[schemaPath]) {
    return typeDefsCache[schemaPath]
  }

  const schema = importSchema(schemaPath)

  if (!disableCache) {
    typeDefsCache[schemaPath] = schema
  }

  return schema
}

export function getCachedRemoteSchema(
  endpoint: string,
  typeDefs: string,
  link: SharedLink,
  disableCache: boolean = false,
): GraphQLSchema {
  if (remoteSchemaCache[endpoint]) {
    return remoteSchemaCache[endpoint]
  }

  const remoteSchema = (() => {
    const args = {
    link: link,
    schema: typeDefs,
  };
    if (args.link) {
      args.link = linkToExecutor(args.link);
    }
    return graphqlToolsMakeRemoteExecutableSchema(args);
  })()

  if (!disableCache) {
    remoteSchemaCache[endpoint] = remoteSchema
  }

  return remoteSchema
}

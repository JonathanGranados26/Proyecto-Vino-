'use client';

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://pci-weights-tommy-ashley.trycloudflare.com/graphql', // ← TU URL DE API
  credentials: 'include',
});

const apolloClient = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

export default apolloClient;
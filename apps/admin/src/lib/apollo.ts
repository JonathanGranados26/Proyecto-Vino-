import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// URL de la API (cambiar según entorno)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';

// Link HTTP base
const httpLink = new HttpLink({
  uri: API_URL,
});

// Link de autenticación: agrega el token JWT a cada petición
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('admin_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Cliente Apollo combinado
export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
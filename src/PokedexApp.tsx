import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppRouter } from './AppRouter';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import {
  persistQueryClient,
  PersistQueryClientProvider,
} from '@tanstack/react-query-persist-client';

const queryClient = new QueryClient({
  // TODO: configurar después
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
});

export const PokedexApp = () => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: localStoragePersister }}
    >
      {/* <QueryClientProvider client={queryClient}> */}
      <AppRouter />
      <ReactQueryDevtools initialIsOpen={false} />
      {/* </QueryClientProvider> */}
    </PersistQueryClientProvider>
  );
};

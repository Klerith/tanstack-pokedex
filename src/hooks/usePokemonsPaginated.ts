import { useSearchParams } from 'react-router';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { getPokemonsByPage } from '../actions';

export const usePokemonsPaginated = () => {
  // Obtener los parámetros de búsqueda de la URL
  const [searchParams] = useSearchParams();
  const pageParam = Number(searchParams.get('page') ?? '1');
  const currentPage = pageParam > 0 ? pageParam : 1;

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['pokemons', 'page', currentPage],
    queryFn: () => getPokemonsByPage({ currentPage }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const pokemons = data?.pokemons ?? [];
  const totalPages = data?.totalPages ?? 0;

  const onPrefetchNextPage = (page: number) => {
    if (page > totalPages) return;
    if (page < 1) return;
    if (page === currentPage) return;

    queryClient.prefetchQuery({
      queryKey: ['pokemons', 'page', page],
      queryFn: () => getPokemonsByPage({ currentPage: page }),
      staleTime: 1000 * 60 * 5, // 5 minutos
    });
  };

  return {
    pokemons,
    totalPages,
    currentPage,
    isLoading,

    // Methods
    onPrefetchNextPage,
  };
};

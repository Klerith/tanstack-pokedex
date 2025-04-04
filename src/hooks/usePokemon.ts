import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPokemonByTerm, getRecommendationAgainst } from '../actions';

export const usePokemon = (nameOrId: string) => {
  const queryClient = useQueryClient();

  const {
    data: pokemon,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: () => getPokemonByTerm(nameOrId),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const { data: recommendations = [], isLoading: isLoadingRecommendations } =
    useQuery({
      queryKey: ['pokemon', nameOrId, 'recommendations'],
      queryFn: () => getRecommendationAgainst(pokemon!),
      enabled: !!pokemon,
      staleTime: 1000 * 60 * 5, // 5 minutos
    });

  useEffect(() => {
    if (pokemon) {
      queryClient.setQueryData(['pokemon', pokemon.name], pokemon);
      queryClient.setQueryData(['pokemon', pokemon.id], pokemon);
    }
  }, [pokemon]);

  useEffect(() => {
    if (recommendations.length > 0 && pokemon) {
      queryClient.setQueryData(
        ['pokemon', pokemon.name, 'recommendations'],
        recommendations
      );
      queryClient.setQueryData(
        ['pokemon', pokemon.id, 'recommendations'],
        recommendations
      );
    }
  }, [recommendations, pokemon]);

  // Prefetch del siguiente y anterior pokemon
  useEffect(() => {
    if (pokemon) {
      const id = `${pokemon.id + 1}`;
      queryClient.prefetchQuery({
        queryKey: ['pokemon', id],
        queryFn: () => getPokemonByTerm(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
      });
    }

    if (pokemon && pokemon.id > 1) {
      const id = `${pokemon.id - 1}`;
      queryClient.prefetchQuery({
        queryKey: ['pokemon', id],
        queryFn: () => getPokemonByTerm(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
      });
    }
  }, [pokemon]);

  return {
    pokemon,
    isError,
    isLoading,
    error,
    recommendations,
    isLoadingRecommendations,
  };
};

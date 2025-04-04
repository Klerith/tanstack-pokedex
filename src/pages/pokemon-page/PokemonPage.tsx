import { Link, useParams } from 'react-router';

import { RecommendationCard } from '../../components/RecommendationCard';
import { FullScreenLoading } from '../../components/FullScreenLoading';
import { PokemonInfo } from './ui/PokemonInfo';
import { SearchBar } from '../../components/SearchBar';
import { usePokemon } from '../../hooks/usePokemon';

export const PokemonPage = () => {
  const { nameOrId = '' } = useParams();

  const {
    pokemon,
    isError,
    isLoading,
    error,
    recommendations,
    isLoadingRecommendations,
  } = usePokemon(nameOrId);

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <div className="flex flex-col items-center gap-6">
          <Link
            to="/"
            className="text-4xl font-bold text-gray-800 hover:underline"
          >
            Pokédex
          </Link>

          <SearchBar initialValue={nameOrId} />

          {isError && (
            <div className="text-red-500 font-semibold">
              {JSON.stringify(error)}
            </div>
          )}

          {isLoading && <FullScreenLoading />}

          {pokemon && <PokemonInfo pokemon={pokemon} />}

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Pokémon Recomendados
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isLoadingRecommendations && (
                <span className="text-3xl">Cargando recomendaciones</span>
              )}

              {recommendations.map((rec) => (
                <RecommendationCard key={rec.id} pokemon={rec} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

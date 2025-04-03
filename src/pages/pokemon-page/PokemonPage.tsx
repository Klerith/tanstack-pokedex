import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';

import type { BasicPokemon } from '../../types/basic-pokemon.interface';
import type { Pokemon } from '../../types/pokemon.interface';

import { RecommendationCard } from '../../components/RecommendationCard';
import { FullScreenLoading } from '../../components/FullScreenLoading';
import { PokemonInfo } from './ui/PokemonInfo';
import { SearchBar } from '../../components/SearchBar';
import { getPokemonByTerm, getRecommendationAgainst } from '../../actions';

export const PokemonPage = () => {
  const { nameOrId = '' } = useParams();

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState<BasicPokemon[]>([]);

  const fetchPokemon = async (nameOrId: string) => {
    try {
      setIsLoading(true);
      setError('');
      const pokemon = await getPokemonByTerm(nameOrId);
      setPokemon(pokemon);
      await fetchRecommendations(pokemon);
    } catch (err) {
      setError('Pokemon not found!');
      setPokemon(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async (pokemon: Pokemon) => {
    try {
      const recommendations = await getRecommendationAgainst(pokemon);
      setRecommendations(recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
      setError('Failed to fetch recommendations');
    }
  };

  useEffect(() => {
    fetchPokemon(nameOrId);
  }, [nameOrId]);

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

          {error && <div className="text-red-500 font-semibold">{error}</div>}

          {isLoading && <FullScreenLoading />}

          {pokemon && <PokemonInfo pokemon={pokemon} />}

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Pokémon Recomendados
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

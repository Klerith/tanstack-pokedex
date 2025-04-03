import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';

import type { BasicPokemon } from '../../types/basic-pokemon.interface';
import type { Pokemon } from '../../types/pokemon.interface';

import { RecommendationCard } from '../../components/RecommendationCard';
import { FullScreenLoading } from '../../components/FullScreenLoading';
import { PokemonInfo } from './ui/PokemonInfo';
import { SearchBar } from '../../components/SearchBar';
import { getPokemonByTerm } from '../../actions';

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
      await fetchRecommendations(pokemon.id);
    } catch (err) {
      setError('Pokemon not found!');
      setPokemon(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async (currentPokemonId: number) => {
    try {
      const recommendedIds = generateRandomIds(currentPokemonId);
      const recommendations = await Promise.all(
        recommendedIds.map(async (id) => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
          );
          const data = (await response.json()) as Pokemon;
          const randomMove =
            data.moves[Math.floor(Math.random() * data.moves.length)].move.name;
          return {
            id: data.id,
            name: data.name,
            move: randomMove,
            image: data.sprites.other?.['official-artwork'].front_default ?? '',
            types: data.types.map((type) => type.type.name),
          };
        })
      );
      setRecommendations(recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const generateRandomIds = (currentId: number): number[] => {
    const ids = new Set<number>();
    while (ids.size < 4) {
      const randomId = Math.floor(Math.random() * 1010) + 1;
      if (randomId !== currentId) {
        ids.add(randomId);
      }
    }
    return Array.from(ids);
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

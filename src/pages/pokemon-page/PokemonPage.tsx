import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

import type { BasicPokemon } from '../../types/basic-pokemon.interface';
import type { Pokemon } from '../../types/pokemon.interface';
import { Link, useNavigate, useParams } from 'react-router';
import { RecommendationCard } from '../../components/RecommendationCard';
import { FullScreenLoading } from '../../components/FullScreenLoading';
import { PokemonInfo } from './ui/PokemonInfo';

export const PokemonPage = () => {
  const { nameOrId = '' } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState<BasicPokemon[]>([]);

  const fetchPokemon = async (identifier: string | number) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${identifier}`
      );
      if (!response.ok) throw new Error('Pokemon not found!');
      const data = await response.json();
      setPokemon(data);
      await fetchRecommendations(data.id);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchPokemon(searchTerm);
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

          <form onSubmit={handleSearch} className="w-full max-w-md relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o número..."
              className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-red-500 focus:outline-none pr-12"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
            >
              <Search size={24} />
            </button>
          </form>

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

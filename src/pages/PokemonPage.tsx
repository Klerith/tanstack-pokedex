import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

import type { BasicPokemon } from '../types/basic-pokemon.interface';
import type { Pokemon } from '../types/pokemon.interface';
import { useParams } from 'react-router';
import { ColorPicker } from '../helpers/color-type';

export const PokemonPage = () => {
  const { id = '' } = useParams();
  const pokemonId = isNaN(Number(id)) ? 1 : Number(id);

  const [searchTerm, setSearchTerm] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [currentId, setCurrentId] = useState(pokemonId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState<BasicPokemon[]>([]);

  const fetchPokemon = async (identifier: string | number) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${identifier}`
      );
      if (!response.ok) throw new Error('Pokemon not found!');
      const data = await response.json();
      setPokemon(data);
      setCurrentId(data.id);
      await fetchRecommendations(data.id);
    } catch (err) {
      setError('Pokemon not found!');
      setPokemon(null);
    } finally {
      setLoading(false);
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

  const handleNavigation = (direction: 'prev' | 'next') => {
    const newId = direction === 'prev' ? currentId - 1 : currentId + 1;
    if (newId > 0 && newId <= 1010) {
      setCurrentId(newId);
      fetchPokemon(newId);
    }
  };

  useEffect(() => {
    fetchPokemon(id);
  }, []);

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold text-gray-800">Pokédex</h1>

          <form onSubmit={handleSearch} className="w-full max-w-md relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or number..."
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

          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : pokemon ? (
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => handleNavigation('prev')}
                  className="p-2 rounded-full hover:bg-gray-100"
                  disabled={currentId <= 1}
                >
                  <ChevronLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {pokemon.name} #{pokemon.id.toString().padStart(3, '0')}
                </h2>
                <button
                  onClick={() => handleNavigation('next')}
                  className="p-2 rounded-full hover:bg-gray-100"
                  disabled={currentId >= 1010}
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2">
                  <img
                    src={
                      pokemon.sprites.other?.['official-artwork'].front_default
                    }
                    alt={pokemon.name}
                    className="w-full h-auto"
                  />
                </div>

                <div className="w-full md:w-1/2 space-y-4">
                  <div className="flex gap-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`${ColorPicker.byType(
                          type.type.name
                        )} px-3 py-1 rounded-full text-white text-sm capitalize`}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600">Height</p>
                      <p className="font-bold">{pokemon.height / 10}m</p>
                    </div>
                    <div className="text-center p-2 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="font-bold">{pokemon.weight / 10}kg</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800">Base Stats</h3>
                    {pokemon.stats.map((stat) => (
                      <div key={stat.stat.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">
                            {stat.stat.name.replace('-', ' ')}
                          </span>
                          <span className="font-semibold">
                            {stat.base_stat}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{
                              width: `${(stat.base_stat / 255) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Recommended Pokémon
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => fetchPokemon(rec.id)}
                    >
                      <img
                        src={rec.image}
                        alt={rec.name}
                        className="w-full h-24 object-contain mb-2"
                      />
                      <h4 className="font-semibold text-gray-800 capitalize text-center">
                        {rec.name}
                      </h4>
                      <p className="text-sm text-gray-600 text-center capitalize">
                        {rec.move.replace('-', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

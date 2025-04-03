import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

import { BasicPokemon } from '../../types/basic-pokemon.interface';

import { SearchBar } from '../../components/SearchBar';
import { FullScreenLoading } from '../../components/FullScreenLoading';
import { PokemonCard } from '../../components/PokemonCard';
import { getPokemonsByPage } from '../../actions';
import { useNavigate, useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

export const PaginatedPage = () => {
  const navigate = useNavigate();

  // Obtener los parámetros de búsqueda de la URL
  const [searchParams] = useSearchParams();
  const pageParam = Number(searchParams.get('page') ?? '1');
  const currentPage = pageParam > 0 ? pageParam : 1;

  // const [pokemons, setPokemons] = useState<BasicPokemon[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  const { data, isLoading } = useQuery({
    queryKey: ['pokemons', currentPage],
    queryFn: () => getPokemonsByPage({ currentPage }),
  });
  const pokemons = data?.pokemons ?? [];
  const totalPages = data?.totalPages ?? 0;

  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   getPokemonsByPage({ currentPage: currentPage })
  //     .then((data) => {
  //       setPokemons(data.pokemons);
  //       setTotalPages(data.totalPages);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching pokemons:', error);
  //       alert('Error fetching pokemons');
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // }, [currentPage]);

  const toggleFavorite = (pokemonId: number) => {
    setFavorites((prev) =>
      prev.includes(pokemonId)
        ? prev.filter((id) => id !== pokemonId)
        : [...prev, pokemonId]
    );
  };

  const displayedPokemons = showFavorites
    ? pokemons.filter((pokemon) => favorites.includes(pokemon.id))
    : pokemons;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-6">Pokédex</h1>
        <div className="flex gap-4 w-full max-w-2xl mb-6">
          <SearchBar />
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              showFavorites
                ? 'bg-red-700 text-white'
                : 'bg-red-100 text-red-900 border border-red-200 hover:bg-red-200'
            }`}
          >
            <Heart className={showFavorites ? 'fill-current' : ''} size={20} />
            Favoritos
          </button>
        </div>
      </div>

      {/* Header End */}

      {/* Loading Pokemons / Cargando siguiente página */}
      {isLoading && <FullScreenLoading />}

      {/* Si no hay pokemons que mostrar */}
      {!isLoading && displayedPokemons.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <p className="text-white text-lg">No hay Pokémons que mostrar</p>
        </div>
      )}

      {/* Listado de Pokemons */}
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              isFavorite={favorites.includes(pokemon.id)}
              onFavoriteClick={() => toggleFavorite(pokemon.id)}
            />
          ))}
        </div>

        {!showFavorites && (
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={() => navigate(`?page=${currentPage - 1}`)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 bg-red-100 border border-red-200 rounded-lg disabled:opacity-50 hover:bg-red-200 text-red-900"
            >
              <ChevronLeft size={20} /> Anterior
            </button>
            <span className="text-white font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => navigate(`?page=${currentPage + 1}`)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 bg-red-100 border border-red-200 rounded-lg disabled:opacity-50 hover:bg-red-200 text-red-900"
            >
              Siguiente <ChevronRight size={20} />
            </button>
          </div>
        )}
      </>
    </>
  );
};

import { useState } from 'react';
import { Heart } from 'lucide-react';

import SearchBar from '../components/SearchBar';
import { BasicPokemon } from '../types/basic-pokemon.interface';

const ITEMS_PER_PAGE = 12;

export const PaginatedPage = () => {
  const [pokemons, setPokemons] = useState<BasicPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-6">Pokédex</h1>
        <div className="flex gap-4 w-full max-w-2xl mb-6">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
          />
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              showFavorites
                ? 'bg-red-700 text-white'
                : 'bg-red-100 text-red-900 border border-red-200 hover:bg-red-200'
            }`}
          >
            <Heart className={showFavorites ? 'fill-current' : ''} size={20} />
            Favorites
          </button>
        </div>
      </div>
    </>
  );
};

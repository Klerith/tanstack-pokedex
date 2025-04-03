import { Search } from 'lucide-react';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router';

interface Props {
  initialValue?: string;
}

export const SearchBar: FC<Props> = ({ initialValue = '' }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === '') {
      navigate('/');
      return;
    }

    const term = searchTerm.trim().toLowerCase();
    navigate(`/pokemons/${term}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md relative ">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busca un Pokémon por nombre o ID"
          className="w-full pl-10 pr-4 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
    </form>
  );
};

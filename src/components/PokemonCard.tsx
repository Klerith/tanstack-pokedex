import { FC } from 'react';
import { Heart } from 'lucide-react';
import { ColorPicker } from '../helpers/color-type';

import type { BasicPokemon } from '../types/basic-pokemon.interface';

interface Props {
  pokemon: BasicPokemon;
  isFavorite: boolean;
  onFavoriteClick: () => void;
}

const PokemonCard: FC<Props> = ({ pokemon, isFavorite, onFavoriteClick }) => {
  return (
    <div className="bg-red-50 rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
      <div className="relative">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-full h-44 object-contain bg-red-100 p-4"
        />
        <button
          onClick={onFavoriteClick}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
        >
          <Heart
            size={24}
            className={`${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold capitalize text-red-900">
            {pokemon.name}
          </h2>
          <span className="text-red-700 font-medium">#{pokemon.id}</span>
        </div>
        <div className="flex gap-2">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={`${ColorPicker.byType(
                type
              )} px-3 py-1 rounded-full text-white text-sm capitalize`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;

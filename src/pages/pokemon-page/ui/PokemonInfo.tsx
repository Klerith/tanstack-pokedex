import { FC } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { Pokemon } from '../../../types/pokemon.interface';
import { ColorPicker } from '../../../helpers/color-type';

interface Props {
  pokemon: Pokemon;
}

export const PokemonInfo: FC<Props> = ({ pokemon }) => {
  const navigate = useNavigate();

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (!pokemon) return;
    const currentId = Number(pokemon.id);

    const newId = direction === 'prev' ? currentId - 1 : currentId + 1;
    if (newId > 0 && newId <= 1010) {
      navigate(`/pokemons/${newId}`);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => handleNavigation('prev')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 capitalize">
          {pokemon.name} #{pokemon.id.toString().padStart(3, '0')}
        </h2>
        <button
          onClick={() => handleNavigation('next')}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/2">
          <img
            src={pokemon.sprites.other?.['official-artwork'].front_default}
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
              <p className="text-sm text-gray-600">Altura</p>
              <p className="font-bold">{pokemon.height / 10} m</p>
            </div>
            <div className="text-center p-2 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">Peso</p>
              <p className="font-bold">{pokemon.weight / 10} kg</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Estadísticas Base</h3>
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">
                    {stat.stat.name.replace('-', ' ')}
                  </span>
                  <span className="font-semibold">{stat.base_stat}</span>
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
    </div>
  );
};

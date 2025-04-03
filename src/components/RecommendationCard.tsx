import { FC } from 'react';
import { useNavigate } from 'react-router';

import { BasicPokemon } from '../types/basic-pokemon.interface';
import { ColorPicker } from '../helpers/color-type';

interface Props {
  pokemon: BasicPokemon;
}

export const RecommendationCard: FC<Props> = ({ pokemon }) => {
  const { id, image, name, move, types } = pokemon;

  const navigate = useNavigate();

  return (
    <div
      key={id}
      className="flex flex-col justify-center bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={() => navigate(`/pokemons/${id}`)}
    >
      <img src={image} alt={name} className="w-full h-24 object-contain mb-2" />
      <h4 className="font-semibold text-gray-800 capitalize text-center">
        {name}
      </h4>
      <span
        className={`${ColorPicker.byType(
          types[0]
        )} px-3 py-1 rounded-full text-white text-sm capitalize text-center`}
      >
        {move}
      </span>
    </div>
  );
};

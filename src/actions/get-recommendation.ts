import { BasicPokemon } from '../types/basic-pokemon.interface';
import { Pokemon } from '../types/pokemon.interface';
import { getPokemonByTerm } from './get-pokemon-by-term';

// const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

//! Esto es temporal, la idea es generar 4 aleatorios que no sea el Pokémon actual
const generateRandomIds = (pokemonId: number): number[] => {
  const ids = new Set<number>();
  while (ids.size < 4) {
    const randomId = Math.floor(Math.random() * 1010) + 1;
    if (randomId !== pokemonId) {
      ids.add(randomId);
    }
  }
  return Array.from(ids);
};

export const getRecommendationAgainst = async (
  pokemon: Pokemon
): Promise<BasicPokemon[]> => {
  try {
    const recommendedIds = generateRandomIds(pokemon.id);

    const recommendations = await Promise.all(
      recommendedIds.map(async (id) => {
        const pokemon = await getPokemonByTerm(`${id}`);
        return {
          id: pokemon.id,
          name: pokemon.name,
          move: pokemon.moves[0].move.name,
          image:
            pokemon.sprites.other?.['official-artwork'].front_default ?? '',
          types: pokemon.types.map((type) => type.type.name),
        };
      })
    );

    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw new Error('Failed to fetch recommendations');
  }
};

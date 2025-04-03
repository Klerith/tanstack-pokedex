import { sleep } from '../helpers/sleep';
import { Pokemon } from '../types/pokemon.interface';

export const getPokemonByTerm = async (nameOrId: string): Promise<Pokemon> => {
  //? Simular un retraso de 1.5 segundos
  await sleep(1500);

  const searchTerm = nameOrId.trim().toLowerCase();

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
    );

    const pokemon = await response.json();

    return pokemon;
  } catch (error) {
    console.log(error);
    throw new Error(`Pokemon by ${nameOrId} not found - Check logs`);
  }
};

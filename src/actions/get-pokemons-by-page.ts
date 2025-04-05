import { sleep } from '../helpers/sleep';
import type { BasicPokemon } from '../types/basic-pokemon.interface';
import { BasicPokemon } from '../types/basic-pokemon.interface';
import { Pokemon } from '../types/pokemon.interface';

interface Options {
  currentPage?: number;
  itemsPerPage?: number;
}

export const getPokemonsByPage = async (options: Options) => {
  //? Simular un retraso de 1.5 segundos
  await sleep(1500);

  const { currentPage = 1, itemsPerPage = 12 } = options;

  try {
    const offset = (currentPage - 1) * itemsPerPage;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`
    );

    const data = await response.json();
    const totalPages = Math.ceil(data.count / itemsPerPage);

    const pokemonDetails: BasicPokemon[] = await Promise.all(
      data.results.map(async (pokemon: any) => {
        const res = await fetch(pokemon.url);
        const details = (await res.json()) as Pokemon;
        return {
          id: details.id,
          name: details.name,
          image: details.sprites.other?.['official-artwork'].front_default,
          types: details.types.map((type: any) => type.type.name),
        };
      })
    );

    return {
      pokemons: pokemonDetails,
      totalPages: totalPages,
    };
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching pokemons - Check logs');
  }
};

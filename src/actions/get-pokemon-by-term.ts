import { BasicPokemon } from '../types/basic-pokemon.interface';

export const getPokemonByTerm = async (
  nameOrId: string
): Promise<BasicPokemon> => {
  const searchTerm = nameOrId.trim().toLowerCase();

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
    );

    const data = await response.json();

    return {
      id: data.id,
      name: data.name,
      image: data.sprites.other['official-artwork'].front_default,
      types: data.types.map((type: any) => type.type.name),
      move: data.moves[0].move.name ?? 'Tackle',
    };
  } catch (error) {
    console.log(error);
    throw new Error(`Pokemon by ${nameOrId} not found - Check logs`);
  }
};

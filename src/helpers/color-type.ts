const typeColors: Record<string, string> = {
  bug: 'bg-green-600',
  dark: 'bg-gray-800',
  dragon: 'bg-indigo-700',
  electric: 'bg-yellow-400',
  fairy: 'bg-pink-300',
  fighting: 'bg-red-700',
  fire: 'bg-red-500',
  flying: 'bg-indigo-400',
  ghost: 'bg-purple-700',
  grass: 'bg-green-500',
  ground: 'bg-yellow-600',
  ice: 'bg-blue-200',
  normal: 'bg-gray-400',
  poison: 'bg-purple-500',
  psychic: 'bg-pink-500',
  rock: 'bg-yellow-800',
  shadow: 'bg-purple-900',
  steel: 'bg-gray-500',
  water: 'bg-blue-500',

  default: 'bg-gray-400',
  unknown: 'bg-gray-300',
};

export class ColorPicker {
  static byType(type: string): string {
    return typeColors[type] ?? typeColors.default;
  }
}

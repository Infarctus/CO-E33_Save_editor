export enum ECharacterAttributeEnum {
  Vitality = 'Vitality',
  Strength = 'Strength',
  Intelligence = 'Intelligence',
  Agility = 'Agility',
  Defense = 'Defense',
  Luck = 'Luck',
  Invalid = 'Invalid',
}

export function getECharacterAttributeEnumValue(index: number): string {
  return (
    Object.entries(ECharacterAttributeEnum).find((_indx, value) => value == index)?.[0] ||
    'What is this shit'
  )
}

export enum E_WorldMapExplorationCapacity {
  Base = "Unlock Esquie",
  HardenLands = "Break rocks",
  Swim = "Swim",
  SwimBoost = "Swim through coral", // I think it's breaking coral ability
  Fly = "Fly"
}

export function getE_WorldMapExplorationCapacity(index: number): string {
  return (
    Object.entries(E_WorldMapExplorationCapacity).find((_indx, value) => value == index)?.[0] ||
    'What is this shit'
  )
}
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
        Object.entries(ECharacterAttributeEnum).find(
            (_indx, value) => value == index
        )?.[0] || 'What is this shit'
    )
}

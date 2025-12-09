export interface CharCustomizationMapping {
  Faces: any
  Skins: any
}

export interface PictoData {
  name: string
  effect: string
  type: string
  stats: string
  cost: number
}

export interface CustomPictosMapping {
  [internalName: string]: PictoData
}

export interface CustomMusicMapping {
  MusicDisks: any
}

export interface CustomJournalMapping {
  Journals: {
    [journalKey: string]: string
  }
}

export interface GradientSkillsMapping {
  GradientSkills: { [characterName: string]: string[] }
}

export interface MonocoSkillsMapping {
  MonocoSkills: { [key: string]: { skillname: string; itemrequirements: string } }
}


export interface PictoInfo {
  name: string
  friendlyName: string
  found: boolean
  mastered: boolean
  level: number
}

export interface QuestItemsInfo {
  name: string
  friendlyName: string
  inInventory: boolean
  value: number
}

export interface MusicDisckInfo {
  name: string
  friendlyName: string
  found: boolean
}

export interface WeaponData {
  name: string
  element: string
  power: number
  attributes: string
  passives: {
    lvl4: { desc: string; id?: string | null }
    lvl10: { desc: string; id?: string | null }
    lvl20: { desc: string; id?: string | null }
  }
  image: string
}

export interface WeaponInfoType {
  name: string
  friendlyName: string
  found: boolean
  level: number
  data?: WeaponData
}

export interface BackupInfoType {
  name: string
  friendlyName: string
  date: Date
}

export interface CustomWeaponsMapping {
  Weapons: {
    [charname: string]: {
      [weaponKey: string]: WeaponData
    }
  }
}

export interface QuestItemsMapping {
  QuestItems: {
    [questTitle: string]: string
  }
}

export interface JournalInfo {
  name: string
  friendlyName: string
  found: boolean
}

export interface FlagsMapping {
  Flags: {
    [locationName: string]: {
      LevelKey: string
      MainSpawnPoint: string
      SubFlags: { [key: string]: [flagname: string] }
    }
  }
}

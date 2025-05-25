export interface CharCustomizationMapping {
  Faces: any
  Skins: any
}

export interface CustomPictosMapping {
  Pictos: any
}

export interface CustomMusicMapping {
  MusicDisks: any
}

export interface CustomJournalMapping {
  Journals: {
    [journalKey: string]: string
  }
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

export interface WeaponInfoType {
  name: string
  friendlyName: string
  found: boolean
  level: number
}

export interface BackupInfoType {
  name: string
  friendlyName: string
  date: Date
}

export interface CustomWeaponsMapping {
  Weapons: {
    [charname: string]: {
      [weaponKey: string]: string
    }
  }
}

export interface QuestItemsMapping {
  QuestItems: {
    [questTitle: string]:  string
  }
}

export interface JournalInfo {
  name: string
  friendlyName: string
  found: boolean
}

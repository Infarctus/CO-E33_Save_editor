export interface CharCustomizationMapping {
  Faces: any;
  Skins: any;
}

export interface CustomPictosMapping {
  Pictos: any;
}

export interface CustomMusicMapping {
  MusicDisks: any;
}

export interface CustomJournalMapping{
  Journals : {
    [journalKey: string]:  string;
  }
}

export interface PictoInfo {
  name: string
  friendlyName: string
  found: boolean;
  mastered: boolean
  level: number
}

export interface MusicDisckInfo {
  name: string
  friendlyName: string
  found: boolean;
}

// to be used inside a dict, with the real weapon name as a key
export interface WeaponInfoType {
  name: string
  friendlyName: string
  found: boolean
  level: number,
}

export interface CustomWeaponsMapping {
  Weapons: {
    [charname: string]: {
      [weaponKey: string]: string;
    };
  };
}

export interface JournalInfo {
  name: string
  friendlyName: string
  found: boolean
}
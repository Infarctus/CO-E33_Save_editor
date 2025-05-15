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
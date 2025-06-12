'use client'

import type {
  CharCustomizationMapping,
  CustomPictosMapping,
  CustomMusicMapping,
  CustomWeaponsMapping,
  CustomJournalMapping,
  QuestItemsMapping,
  FlagsMapping,
  GradientSkillsMapping,
  MonocoSkillsMapping,
} from '../types/jsonCustomMapping'
import { trace, debug } from '@tauri-apps/plugin-log'
import { BeginMapping } from '../types/jsonSaveMapping'
import { generateInventoryItems_0 } from './jsonSaveMapping'
import { invoke } from '@tauri-apps/api/core'

let skinsJson: CharCustomizationMapping = { Skins: {}, Faces: {} }
let pictosJson: CustomPictosMapping = { Pictos: {} }
let musicJson: CustomMusicMapping = { MusicDisks: {} }
let weaponsJson: CustomWeaponsMapping = { Weapons: {} }
let journalsJson: CustomJournalMapping = { Journals: {} }
let monocoSkillsJson: MonocoSkillsMapping = { MonocoSkills: {} }
let questItemsJson: QuestItemsMapping = { QuestItems: {} }
let gradientSkillsJson: GradientSkillsMapping = { GradientSkills: {} }
let flagsJson: FlagsMapping = { Flags: {} }
let manorDoorsJson: { ManorDoors: string[] } = { ManorDoors: [] }
let basecharactersavemappingJson : any = {Characters : {}}

let mappingsInitialized = false

export async function initGameMappings() {
  if (mappingsInitialized) return
  
  try {
    // Load all mappings
    skinsJson = JSON.parse(await invoke('getskinmapping'))
    pictosJson = JSON.parse(await invoke('getpictomapping'))
    musicJson = JSON.parse(await invoke('getmusicdiskmapping'))
    weaponsJson = JSON.parse(await invoke('getweaponmapping'))
    journalsJson = JSON.parse(await invoke('getjournalsmapping'))
    monocoSkillsJson = JSON.parse(await invoke('getmonocoskillsmapping'))
    questItemsJson = JSON.parse(await invoke('getquestitemsmapping'))
    gradientSkillsJson = JSON.parse(await invoke('getgradientskillmapping'))
    flagsJson = JSON.parse(await invoke('getflagmapping'))
    manorDoorsJson = JSON.parse(await invoke("getmanordoormapping"))
    basecharactersavemappingJson = JSON.parse(await invoke("getbasecharactersavemapping"))

    // Validate mappings
    if (!('Faces' in skinsJson) || !('Skins' in skinsJson))
      throw 'Skins/Faces Json (characterCuztomization) not as expected'

    if (!('Pictos' in pictosJson)) throw 'Pictos Json not as expected'

    if (!('MusicDisks' in musicJson)) throw 'Music Json not as expected'

    if (!('Weapons' in weaponsJson)) throw 'Weapons Json not as expected'

    if (!('Journals' in journalsJson)) throw 'Journals Json not as expected'

    if (!('MonocoSkills' in monocoSkillsJson)) throw 'MonocoSkills Json not as expected'

    if (!('QuestItems' in questItemsJson)) throw 'QuestItems Json not as expected'

    if (!('GradientSkills' in gradientSkillsJson)) throw 'GradientSkills Json not as expected'

    if (!('Flags' in flagsJson)) throw 'Flags Json not as expected'

    if (!('ManorDoors' in manorDoorsJson)) throw 'ManorDoors Json not as expected'

    if (!('Characters' in basecharactersavemappingJson)) throw 'BaseCharacterSaveMapping Json not as expected'

    mappingsInitialized = true

  } catch (e: any) {
    trace(e)
    alert(
      'Failed to get some mapping files. Some stuff will not work !\nYou should re-download this mod.',
    )
  }
}

export function getPossibleSkinsFor(characterName: string): [string, string][] {
  if (characterName == 'Frey') characterName = 'Gustave'
  if (characterName in skinsJson.Skins) {
    return Object.entries(skinsJson.Skins[characterName])
  } else {
    return [['nothing', 'nothing']]
  }
}

export function getUnlockedSkinsFor(characterName: string, inventory: string[]): string[] {
  // debug("getting unlocked skins for "+characterName+" with inventory "+inventory)

  if (characterName == 'Frey') characterName = 'Gustave'
  if (skinsJson.Skins && characterName in skinsJson.Skins) {
    const allSkinNames = Object.keys(skinsJson.Skins[characterName])
    const unlockedSkins = allSkinNames.filter((el) => inventory.includes(el))
    // debug("getting unlocked skins for "+characterName+" amongst "+ allSkinNames.join(",")+"gave out "+unlockedSkins.length +": "+unlockedSkins.join("+ "))
    return unlockedSkins
  } else {
    return ['nothing']
  }
}

export function getPossibleFacesFor(characterName: string): [string, string][] {
  debug('getting faces for ' + characterName)
  if (characterName == 'Frey') characterName = 'Gustave'
  if (skinsJson.Faces && characterName in skinsJson.Faces) {
    return Object.entries(skinsJson.Faces[characterName])
  } else {
    return [['nothing', 'nothing']]
  }
}

export function getUnlockedFacesFor(characterName: string, inventory: string[]): string[] {
  // debug("getting unlocked faces for "+characterName+" with inventory "+inventory)
  if (characterName == 'Frey') characterName = 'Gustave'
  if (skinsJson.Faces && characterName in skinsJson.Faces) {
    const allFaceNames = Object.keys(skinsJson.Faces[characterName])
    const unlockedFaces = allFaceNames.filter((el) => inventory.includes(el))
    // debug("getting unlocked faces for "+characterName+" amongst "+ allFaceNames.join(",")+"gave out "+unlockedFaces.length +": "+unlockedFaces.join("+ "))
    return unlockedFaces
  } else {
    return ['nothing']
  }
}

export function getPossibleGrandientSkillsFor(characterName: string): string[] {
  return gradientSkillsJson.GradientSkills[characterName] || ['nothing']
}

export function getPossiblePictos(): [string, string][] {
  debug('getting pictos')
  if (pictosJson.Pictos) {
    return Object.entries(pictosJson.Pictos)
  } else {
    return [['nothing', 'nothing']]
  }
}

export function getPossibleMusicDisks(): [string, string][] {
  debug('getting music disks')
  if (musicJson.MusicDisks) {
    return Object.entries(musicJson.MusicDisks)
  } else {
    return [['nothing', 'nothing']]
  }
}

export function getPossibleWeapons(): [string, { [weaponKey: string]: string }][] {
  debug('getting weapons')
  if (weaponsJson.Weapons) {
    return Object.entries(weaponsJson.Weapons)
  } else {
    return [['nothing', {}]]
  }
}

export function getPossibleJournals(): [string, string][] {
  debug('getting journals')
  if (journalsJson.Journals) {
    return Object.entries(journalsJson.Journals)
  } else {
    return [['nothing', 'nothing']]
  }
}

export function getPossibleMonocoSkills(): [
  string,
  { skillname: string; itemrequirements: string },
][] {
  debug('getting monoco skills')
  if (monocoSkillsJson.MonocoSkills) {
    return Object.entries(monocoSkillsJson.MonocoSkills)
  } else {
    return [['nothing', { skillname: 'nothing', itemrequirements: 'nothing' }]]
  }
}

export function getPossibleQuestItems(): [string, string][] {
  debug('getting quest items')
  if (questItemsJson.QuestItems) {
    return Object.entries(questItemsJson.QuestItems)
  } else {
    return [['nothing', 'nothing']]
  }
}

export function getPossibleManorDoors(): string[] {
  debug('getting manor doors')
  if (manorDoorsJson.ManorDoors) {
    return manorDoorsJson.ManorDoors
  } else {
    return ['nothing']
  }
}

export function getPossibleFlags() {
  debug('getting flags')
  if (flagsJson.Flags) {
    return flagsJson.Flags
  } else {
    return []
  }
}

export function getPossibleBaseCharacterSaveMapping(): string[] {
  debug('getting base character save mapping')
  if (basecharactersavemappingJson.Characters) {
    return Object.keys(basecharactersavemappingJson.Characters)
  } else {
    return ['nothing']
  }
}

export function SetInventoryItem(
  jsonMapping: BeginMapping,
  name: string,
  newValue: number,
  newfound: boolean = true,
): string {
  // Find the item in the InventoryItems_0.Map array and update its value

  const itemIndex = jsonMapping.root.properties.InventoryItems_0.Map.findIndex(
    (el) => el.key.Name.toLowerCase() === name.toLowerCase(),
  )
  // triggerSaveNeeded()
  if (itemIndex != -1) {
    if (newfound) {
      jsonMapping.root.properties.InventoryItems_0.Map[itemIndex].value.Int = newValue
      return `set inventory item ${name} to ${newValue} `
    } else {
      jsonMapping.root.properties.InventoryItems_0.Map.splice(itemIndex, 1)
      return `removed ${name} from inventory`
    }
  } else {
    if (newfound) {
      const newvalue = generateInventoryItems_0(name, newValue)
      jsonMapping.root.properties.InventoryItems_0.Map.push(newvalue)
      return `${name} added to inventory and set to ${newValue}`
    }
  }
  return 'How did we get here'
}

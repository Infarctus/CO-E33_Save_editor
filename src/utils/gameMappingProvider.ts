'use client'

import { readTextFile } from '@tauri-apps/plugin-fs'
import { resolveResource } from '@tauri-apps/api/path'
import type {
  CharCustomizationMapping,
  CustomPictosMapping,
  CustomMusicMapping,
  CustomWeaponsMapping,
  CustomJournalMapping,
  QuestItemsMapping,
  FlagsMapping,
} from '../types/jsonCustomMapping'
import { trace, debug } from '@tauri-apps/plugin-log'
import { path } from '@tauri-apps/api'
import { BeginMapping } from '../types/jsonSaveMapping'
import { generateInventoryItems_0 } from './jsonSaveMapping'
import { invoke } from '@tauri-apps/api/core'

let skinsJson: CharCustomizationMapping
let pictosJson: CustomPictosMapping
let musicJson: CustomMusicMapping
let weaponsJson: CustomWeaponsMapping
let journalsJson: CustomJournalMapping
let monocoSkillsJson: {
  MonocoSkills: { [key: string]: { skillname: string; itemrequirements: string } }
}
let questItemsJson: QuestItemsMapping
let gradientSkillsJson: {
  GradientSkills: { [characterName: string]: string[] }
}
let flagsJson: FlagsMapping

const manorDoorsJson: { ManorDoors: string[] } = await invoke("getmanordoors")

//initGameMappings()
export async function initGameMappings() {
  try {
    const MainDirPath = await resolveResource('resources/customjsonmappings/')
    const resourceSkinsPath = await path.join(MainDirPath, 'skins.json')
    const stringSkinsJson = await readTextFile(resourceSkinsPath)
    skinsJson = JSON.parse(stringSkinsJson)
    // trace("Skins keys is " + Object.keys(skinsJson))
    if (!('Faces' in skinsJson) || !('Skins' in skinsJson))
      throw 'Skins/Faces Json (characterCuztomization) not as expected'

    const resourcePictosPath = await path.join(MainDirPath, 'pictos.json')
    const stringPictosJson = await readTextFile(resourcePictosPath)
    pictosJson = JSON.parse(stringPictosJson)
    if (!('Pictos' in pictosJson)) throw 'Pictos Json not as expected'

    const resourceMusicPath = await path.join(MainDirPath, 'musicdisks.json')
    const stringMusicJson = await readTextFile(resourceMusicPath)
    musicJson = JSON.parse(stringMusicJson)
    if (!('MusicDisks' in musicJson)) throw 'Music Json not as expected'

    const resourceWeaponsPath = await path.join(MainDirPath, 'weapons.json')
    const stringWeaponsJson = await readTextFile(resourceWeaponsPath)
    weaponsJson = JSON.parse(stringWeaponsJson)
    if (!('Weapons' in weaponsJson)) throw 'Weapons Json not as expected'

    const resourceJournalsPath = await path.join(MainDirPath, 'journals.json')
    const stringJournalsJson = await readTextFile(resourceJournalsPath)
    journalsJson = JSON.parse(stringJournalsJson)
    if (!('Journals' in journalsJson)) throw 'Journals Json not as expected'

    const resourceMonocoSkillsPath = await path.join(MainDirPath, 'monocoskills.json')
    const stringMonocoSkillsJson = await readTextFile(resourceMonocoSkillsPath)
    monocoSkillsJson = JSON.parse(stringMonocoSkillsJson)
    if (!('MonocoSkills' in monocoSkillsJson)) throw 'MonocoSkills Json not as expected'

    const resourceQuestItemsPath = await path.join(MainDirPath, 'questitems.json')
    const stringQuestItemsJson = await readTextFile(resourceQuestItemsPath)
    questItemsJson = JSON.parse(stringQuestItemsJson)
    if (!('QuestItems' in questItemsJson)) throw 'QuestItems Json not as expected'

    const resourceGradientSkillsPath = await path.join(MainDirPath, 'gradientskills.json')
    const stringGradientSkillsJson = await readTextFile(resourceGradientSkillsPath)
    gradientSkillsJson = JSON.parse(stringGradientSkillsJson)
    if (!('GradientSkills' in gradientSkillsJson)) throw 'GradientSkills Json not as expected'

    const resourceFlagsPath = await path.join(MainDirPath, 'flags.json')
    const stringFlagsJson = await readTextFile(resourceFlagsPath)
    flagsJson = JSON.parse(stringFlagsJson)
    if (!('Flags' in flagsJson)) throw 'Flags Json not as expected'

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

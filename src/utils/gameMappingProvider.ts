"use client"


import { readTextFile } from "@tauri-apps/plugin-fs"
import { resolveResource } from '@tauri-apps/api/path';
import { CharCustomizationMapping,CustomPictosMapping } from "../types/jsonCustomMapping";

let skinsJson : CharCustomizationMapping ;
let pictosJson : CustomPictosMapping;

//initGameMappings()
export async function initGameMappings() {
    try {
        const resourceSkinsDirPath = await resolveResource("resources/customjsonmappings/skins.json");
        const stringSkinsJson = await readTextFile(resourceSkinsDirPath)
        skinsJson = JSON.parse(stringSkinsJson)
        console.log("Skins keys is " + Object.keys(skinsJson))
        if (!("Faces" in skinsJson) || !("Skins" in skinsJson))
            throw "Skins/Faces Json (characterCuztomization) not as expected"
        
        const resourcePictosDirPath = await resolveResource("resources/customjsonmappings/pictos.json");
        const stringPictosJson = await readTextFile(resourcePictosDirPath)
        pictosJson = JSON.parse(stringPictosJson)
        if( !("Pictos" in pictosJson))
            throw "Pictos Json not as expected"
    } catch (e) {
        console.log(e)
        alert("Failed to get some mapping files. Stome stuff will not work !\nYou should re-download this mod.")
    }


    
}

export function getPossibleSkinsFor(characterName: string) : [string, string][]{
    if (characterName == "Frey") characterName = "Gustave"
    if (characterName in skinsJson.Skins) {
        return Object.entries(skinsJson.Skins[characterName])
    } else {
        return [["nothing", "nothing"]]
    }

}


export function getUnlockedSkinsFor(characterName: string, inventory: string[]) : string[]{
        console.debug("getting unlocked skins for "+characterName+" with inventory "+inventory)

    if (characterName == "Frey") characterName = "Gustave"
    if (skinsJson.Skins && characterName in skinsJson.Skins) {
        const allSkinNames = Object.keys(skinsJson.Skins[characterName]);
        const unlockedSkins = allSkinNames.filter((el) => inventory.includes(el))
        console.debug("getting unlocked skins for "+characterName+" amongst "+ allSkinNames.join(",")+"gave out "+unlockedSkins.length +": "+unlockedSkins.join(", "))
        return unlockedSkins
    } else {
        return ["nothing"]
    }

}

export function getPossibleFacesFor(characterName: string) : [string, string][]{
    console.debug("getting faces for "+characterName)
    if (characterName == "Frey") characterName = "Gustave"
    if (skinsJson.Faces && characterName in skinsJson.Faces) {
        return Object.entries(skinsJson.Faces[characterName])
    } else {
        return [["nothing", "nothing"]]
    }
}

export function getUnlockedFacesFor(characterName: string, inventory: string[]) : string[]{
    console.debug("getting unlocked faces for "+characterName+" with inventory "+inventory)
    if (characterName == "Frey") characterName = "Gustave"
    if (skinsJson.Faces && characterName in skinsJson.Faces) {
        const allFaceNames = Object.keys(skinsJson.Faces[characterName]);
        const unlockedFaces = allFaceNames.filter((el) => inventory.includes(el))
        console.debug("getting unlocked faces for "+characterName+" amongst "+ allFaceNames.join(",")+"gave out "+unlockedFaces.length +": "+unlockedFaces.join(", "))
        return unlockedFaces
    } else {
        return ["nothing"]
    }
}

export function getPossiblePictos() : [string, string][]{
    console.debug("getting pictos")
    if (pictosJson.Pictos) {
        return Object.entries(pictosJson.Pictos)
    } else {
        return [["nothing", "nothing"]]
    }
}
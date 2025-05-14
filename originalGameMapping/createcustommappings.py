import os
import json

output_dir = "./src-tauri/resources/customjsonmappings"
os.makedirs(output_dir, exist_ok=True)
def oldtestgenpictomapping():
    # Path to the input JSON file
    intput_pictosdefs = "originalGameMapping/DT_PictosDefinitions.json"
    input_pictosnames = "originalGameMapping/ST_PassiveEffects.json"

    # Path to the output directory and file
    output_path = os.path.join(output_dir, "pictos.json")

    # Load the input JSON
    with open(intput_pictosdefs, "r", encoding="utf-8") as f:
        pictoslist = json.load(f)[0].get("Rows")


    with open(input_pictosnames, "r", encoding="utf-8") as f:
        pictosnamesdef = json.load(f)[0].get("StringTable").get("KeysToEntries")

    # Prepare the output JSON structure
    output_data = {
        "Pictos": {},
        #"Unused": []
    }
    for picto in pictoslist:
        pictoname = pictosnamesdef.get("PASSIVE_"+picto+"_Name")
        if pictoname:
            output_data["Pictos"][picto] = pictoname
        else:
            output_data["Pictos"][picto] = "NULL"
            #output_data["Unused"].append(picto)

    # Write the output JSON
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2)

    print("Picto mapping generated successfully.")

def testpictoname(testpictodeffromfilename, GearPictosKey,pictosnamesdef):
    # if "CriticalBreak" in testpictodeffromfilename or "CriticalBreak" in GearPictosKey:
    #     print("testpictodeffromfilename", testpictodeffromfilename)
    #     print("GearPictosKey", GearPictosKey)
    pictoname = pictosnamesdef.get("PASSIVE_"+GearPictosKey+"_Name")
    if not pictoname:
        pictoname = pictosnamesdef.get("PASSIVE_"+testpictodeffromfilename+"_Name")
    if not pictoname:
        pictoname = pictosnamesdef.get("PASSIVE_"+GearPictosKey.replace("+1","")+"_Name")
    if not pictoname:
        pictoname = pictosnamesdef.get("PASSIVE_"+testpictodeffromfilename.replace("_","")+"_Name")
    if not pictoname:
        pictoname = pictosnamesdef.get("PASSIVE_"+testpictodeffromfilename.replace("_2","B")+"_Name")
    if not pictoname:
        pictoname = pictosnamesdef.get("PASSIVE_"+testpictodeffromfilename.replace("_3","C")+"_Name")

    # if "CriticalBreak" in testpictodeffromfilename or "CriticalBreak" in GearPictosKey:
    #     print(pictoname)
    return pictoname

def genpictomapping():
    input_pictosnames = "originalGameMapping/ST_PassiveEffects.json"

    with open(input_pictosnames, "r", encoding="utf-8") as f:
        pictosnamesdef = json.load(f)[0].get("StringTable").get("KeysToEntries")

    output_path = os.path.join(output_dir, "pictos.json")
    output_data = {
        "Pictos": {},
        #"Unused": []
    }
    for filename in os.listdir("originalGameMapping/Gear"):
        full_path = os.path.join("originalGameMapping/Gear", filename)
        if not os.path.isfile(full_path):
            print(f"Skipping {filename}, not a file.")
            continue
        if not filename.startswith("DA_Gear"):
            continue
        if filename.endswith(".json"):
            with open(os.path.join("originalGameMapping/Gear", filename), "r", encoding="utf-8") as f:
                passiveeffectname = json.load(f)[0].get("Properties").get("PassiveEffects")
                if passiveeffectname:
                    passiveeffectname = passiveeffectname[0].get("Row_2_8FD54A69441F52BAEE473DB8C91D1621").get("RowName")
                    
                if passiveeffectname:
                    GearPictosKey = passiveeffectname
                    testpictodeffromfilename = filename.removesuffix(".json").removeprefix("DA_GearPictos_")
                    pictoname = testpictoname(testpictodeffromfilename, GearPictosKey, pictosnamesdef)
                    if pictoname:
                        output_data["Pictos"][GearPictosKey] = pictoname
                    #else:
                    #    output_data["Pictos"][GearPictosKey] = "NULL"

    for filename in os.listdir("originalGameMapping/Gear/NewLumina"):
        full_path = os.path.join("originalGameMapping/Gear/NewLumina", filename)
        if not os.path.isfile(full_path):
            continue
        if not filename.startswith("DA_Gear"):
            continue
        if filename.endswith(".json"):
            with open(os.path.join("originalGameMapping/Gear/NewLumina", filename), "r", encoding="utf-8") as f:
                passiveeffectname = json.load(f)[0].get("Properties").get("PassiveEffects")
                if passiveeffectname:
                    passiveeffectname = passiveeffectname[0].get("Row_2_8FD54A69441F52BAEE473DB8C91D1621").get("RowName")
                    
                if passiveeffectname:
                    GearPictosKey = passiveeffectname
                    if GearPictosKey:
                        testpictodeffromfilename = filename.removesuffix(".json").removeprefix("DA_GearPictos_")
                        pictoname = testpictoname(testpictodeffromfilename, GearPictosKey, pictosnamesdef)
                        if not pictoname:
                            pictoname = pictosnamesdef.get("PASSIVE_"+GearPictosKey+"_Name")

                        if pictoname:
                            output_data["Pictos"][GearPictosKey] = pictoname
                        #else:
                        #    output_data["Pictos"][GearPictosKey] = "NULL"

                           
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2)

    print("Picto mapping generated successfully.")
                    
                



def genskinmapping():
    input_cc = "originalGameMapping/DT_CharacterCustomizationItems.json"

    output_path = os.path.join(output_dir, "skins.json")

    with open(input_cc, "r", encoding="utf-8") as f:
        cclist = json.load(f)[0].get("Rows")
    

    output_data = {
        "Skins": {},
        "Faces" : {}
    }
    for cc in cclist:
        if cc.endswith("Default"):
            continue
        ccign =  cclist[cc].get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("SourceString")
        isskin = True if cc.startswith("Skin") else False 
        if isskin:
            char = cc.removeprefix("Skin").split("_")[0]
            if char not in output_data["Skins"]:
                output_data["Skins"][char] = {}
            output_data["Skins"][char][cc] = ccign
        else:
            char = cc.removeprefix("Face").split("_")[0]
            if char not in output_data["Faces"]:
                output_data["Faces"][char] = {}
            output_data["Faces"][char][cc] = ccign

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print("Skin mapping generated successfully.")

def genmusicdiskmapping():
    input_music = "originalGameMapping/DT_MusicRecords.json"
    output_path = os.path.join(output_dir, "musicdisks.json")

    with open(input_music, "r", encoding="utf-8") as f:
        musiclist = json.load(f)[0].get("Rows")

    output_data = {
        "MusicDisks": {}
    }
    for music in musiclist:
        musicname = musiclist[music].get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("SourceString")
        if musicname:
            output_data["MusicDisks"][music] = musicname

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print("Music disk mapping generated successfully.")

genpictomapping()
genskinmapping()
genmusicdiskmapping()
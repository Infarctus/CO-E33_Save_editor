import os
import json

output_dir = "./src-tauri/resources/customjsonmappings"
os.makedirs(output_dir, exist_ok=True)

def jsondump(obj, file):
    with open(file, "w", encoding="utf-8") as f:
        #json.dump(obj, f, indent=2, ensure_ascii=False)
        json.dump(obj, f, separators=(',', ':'), ensure_ascii=False) # for release to minify the jsons


itemtypes = {'E_jRPG_ItemType::NewEnumerator0': 'Weapon', 'E_jRPG_ItemType::NewEnumerator6': 'N/A', 'E_jRPG_ItemType::NewEnumerator7': 'Consumable', 'E_jRPG_ItemType::NewEnumerator10': 'Pictos', 'E_jRPG_ItemType::NewEnumerator11': 'Key', 'E_jRPG_ItemType::NewEnumerator12': 'Inventory', 'E_jRPG_ItemType::NewEnumerator14': 'Shard', 'E_jRPG_ItemType::NewEnumerator15': 'Gold', 'E_jRPG_ItemType::NewEnumerator16': 'CharacterCustomization', 'E_jRPG_ItemType::NewEnumerator17': 'SkillUnlocker'}
itemsubtypes = {'E_jRPG_ItemSubtype::NewEnumerator0': 'Lune', 'E_jRPG_ItemSubtype::NewEnumerator1': 'Monoco', 'E_jRPG_ItemSubtype::NewEnumerator2': 'Sciel', 'E_jRPG_ItemSubtype::NewEnumerator11': 'Consumable', 'E_jRPG_ItemSubtype::NewEnumerator14': 'Maelle', 'E_jRPG_ItemSubtype::NewEnumerator15': 'Pictos', 'E_jRPG_ItemSubtype::NewEnumerator16': 'Noah', 'E_jRPG_ItemSubtype::NewEnumerator18': 'Key', 'E_jRPG_ItemSubtype::NewEnumerator19': 'Inventory', 'E_jRPG_ItemSubtype::NewEnumerator20': 'Invalid', 'E_jRPG_ItemSubtype::NewEnumerator21': 'Verso', 'E_jRPG_ItemSubtype::NewEnumerator22': 'Journal', 'E_jRPG_ItemSubtype::NewEnumerator23': 'Music Record'}


def genpictomapping():
    items = "originalGameMapping/DT_jRPG_Items_Composite.json"

    with open(items, "r", encoding="utf-8") as f:
        itemsdef = json.load(f)[0].get("Rows")

    output_path = os.path.join(output_dir, "pictos.json")
    output_data = {
        "Pictos": {}
    }

    for item in itemsdef:
        curritem = itemsdef[item]
        if curritem.get("Item_Type_88_2F24F8FB4235429B4DE1399DBA533C78") != 'E_jRPG_ItemType::NewEnumerator10':
            continue
        pictoname = curritem.get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("SourceString")
        if pictoname == None:
            pictoname = curritem.get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("CultureInvariantString")+"**"
        
        output_data["Pictos"][item] = pictoname
    

    jsondump(output_data, output_path)

    print("Picto mapping generated successfully.")              
                
def genskinmapping():
    items = "originalGameMapping/DT_jRPG_Items_Composite.json"

    disabledchar = ["Sophie","AliciaEpilogue","Alicia"]

    output_path = os.path.join(output_dir, "skins.json")
    
    with open(items, "r", encoding="utf-8") as f:
        itemsdef = json.load(f)[0].get("Rows")

    output_data = {
        "Skins": {},
        "Faces" : {}
    }
    
    for item in itemsdef:
        curritem = itemsdef[item]
        if curritem.get("Item_Type_88_2F24F8FB4235429B4DE1399DBA533C78") != 'E_jRPG_ItemType::NewEnumerator16':
            continue
        charname = item.removeprefix("Skin").split("_")[0]
        type = "Skins" if item.startswith("Skin") else "Faces"
        charname = item.removeprefix(type[:-1]).split("_")[0]
        if charname in disabledchar:
            continue
        if charname not in output_data[type]:
            output_data[type][charname] = {}
        skinname = curritem.get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("SourceString")
        output_data[type][charname][item] = skinname

    jsondump(output_data, output_path)

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

    jsondump(output_data, output_path)

    print("Music disk mapping generated successfully.")

def genweaponmapping():
    items = "originalGameMapping/DT_jRPG_Items_Composite.json"
    output_path = os.path.join(output_dir, "weapons.json")

    with open(items, "r", encoding="utf-8") as f:
        itemsdef = json.load(f)[0].get("Rows")

    #with open ("originalGameMapping/ST_Items.json", "r", encoding="utf-8") as f:
    #    STItems = json.load(f)[0].get("StringTable").get("KeysToEntries")

    output_data = {
        "Weapons": {}
    }

    for item in itemsdef:
        curritem = itemsdef[item]
        if curritem.get("Item_Type_88_2F24F8FB4235429B4DE1399DBA533C78") != 'E_jRPG_ItemType::NewEnumerator0':
            continue
        
        charname = itemsubtypes[curritem.get("Item_Subtype_87_0CE0028F4D632385B61EDABBFBDF5360")]
        charname= charname if charname != "Noah" else "Gustave" 

        if charname not in output_data["Weapons"]:
            output_data["Weapons"][charname] = {}
        weaponname = curritem.get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("SourceString")
        if weaponname == None:
            weaponname = curritem.get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("CultureInvariantString")
        output_data["Weapons"][charname][item] = weaponname
    

    jsondump(output_data, output_path)

    print("Weapon mapping generated successfully.")

def genjournalsmapping():
    input_journals = "originalGameMapping/DT_Items_Journals.json"
    output_path = os.path.join(output_dir, "journals.json")

    with open(input_journals, "r", encoding="utf-8") as f:
        journalslist = json.load(f)[0].get("Rows")

    output_data = {
        "Journals": {}
    }

    for journal in journalslist:
        journalname = journalslist[journal].get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("SourceString")
        if journalname:
            output_data["Journals"][journal] = journalname

    jsondump(output_data, output_path)

    print("Journal mapping generated successfully.")



#genweaponmapping()    
#genjournalsmapping()
#genpictomapping()
#genskinmapping()
#genmusicdiskmapping()
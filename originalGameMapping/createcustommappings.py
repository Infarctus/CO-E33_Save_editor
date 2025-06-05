import os
import json

output_dir = "./src-tauri/resources/customjsonmappings"
os.makedirs(output_dir, exist_ok=True)

def jsondump(obj, file):
    with open(file, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)
        #json.dump(obj, f, separators=(',', ':'), ensure_ascii=False) # for release to minify the jsons


itemtypes = {'E_jRPG_ItemType::NewEnumerator0': 'Weapon', 'E_jRPG_ItemType::NewEnumerator6': 'N/A', 'E_jRPG_ItemType::NewEnumerator7': 'Consumable', 'E_jRPG_ItemType::NewEnumerator10': 'Pictos', 'E_jRPG_ItemType::NewEnumerator11': 'Key', 'E_jRPG_ItemType::NewEnumerator12': 'Inventory', 'E_jRPG_ItemType::NewEnumerator14': 'Shard', 'E_jRPG_ItemType::NewEnumerator15': 'Gold', 'E_jRPG_ItemType::NewEnumerator16': 'CharacterCustomization', 'E_jRPG_ItemType::NewEnumerator17': 'SkillUnlocker'}
itemsubtypes = {'E_jRPG_ItemSubtype::NewEnumerator0': 'Lune', 'E_jRPG_ItemSubtype::NewEnumerator1': 'Monoco', 'E_jRPG_ItemSubtype::NewEnumerator2': 'Sciel', 'E_jRPG_ItemSubtype::NewEnumerator11': 'Consumable', 'E_jRPG_ItemSubtype::NewEnumerator14': 'Maelle', 'E_jRPG_ItemSubtype::NewEnumerator15': 'Pictos', 'E_jRPG_ItemSubtype::NewEnumerator16': 'Noah', 'E_jRPG_ItemSubtype::NewEnumerator18': 'Key', 'E_jRPG_ItemSubtype::NewEnumerator19': 'Inventory', 'E_jRPG_ItemSubtype::NewEnumerator20': 'Invalid', 'E_jRPG_ItemSubtype::NewEnumerator21': 'Verso', 'E_jRPG_ItemSubtype::NewEnumerator22': 'Journal', 'E_jRPG_ItemSubtype::NewEnumerator23': 'Music Record'}





def genpictomapping():
    unavalablepictos = [
        "The Best Defense",
        "Bloody Bullet",
        "Passive Defense",
        "Dodge Specialist",
        "Dodge Helper",
        "Lucky Aim",
        "Successive Parry",
        "Parry Specialist",
        "Solidifying Meditation",
        "Great Energy Tint",
        "Great Healing Tint",
        "Charybde To Scylla",
        "Evasive Healer",
        "Charging Recovery",
        "Gradient Recovery",
        "Better Healing Tint",
        "Parry Helper",
        "Physical Fighter",
        "Shield Breaker",
        "Soul Eater",
    ]
    items = "originalGameMapping/DT_jRPG_Items_Composite.json"

    with open(items, "r", encoding="utf-8") as f:
        itemsdef = json.load(f)[0].get("Rows")

    output_path = os.path.join(output_dir, "pictos.json")
    output_data = {
        "Pictos": {}
    }
    Pictos1 = {}
    Pictos2 = {}

    for item in itemsdef:
        curritem = itemsdef[item]
        if curritem.get("Item_Type_88_2F24F8FB4235429B4DE1399DBA533C78") != 'E_jRPG_ItemType::NewEnumerator10':
            continue
        pictoname = curritem.get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("SourceString")
        if pictoname == None:
            pictoname = curritem.get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("CultureInvariantString")+"**"
            Pictos2[item] = pictoname
        elif pictoname in unavalablepictos:
            Pictos1[item] = pictoname+"*"
        else:
            output_data["Pictos"][item] = pictoname
    
    output_data["Pictos"] = dict(
        sorted(output_data["Pictos"].items(), key=lambda x: x[1])
    )
    Pictos1 = dict(
        sorted(Pictos1.items(), key=lambda x: x[1])
    )
    Pictos2 = dict(
        sorted(Pictos2.items(), key=lambda x: x[1])
    )
    output_data["Pictos"].update(Pictos1)
    output_data["Pictos"].update(Pictos2)

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

    deluxeskins = ["Flowers","Gommage","Clair","Obscur"]
    
    for item in itemsdef:
        curritem = itemsdef[item]
        if curritem.get("Item_Type_88_2F24F8FB4235429B4DE1399DBA533C78") != 'E_jRPG_ItemType::NewEnumerator16':
            continue
        if item.endswith("_Default"):
            continue
        charname = item.removeprefix("Skin").split("_")[0]
        type = "Skins" if item.startswith("Skin") else "Faces"
        charname = item.removeprefix(type[:-1]).split("_")[0]
        if charname in disabledchar:
            continue
        if charname not in output_data[type]:
            output_data[type][charname] = {}
        skinname = curritem.get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("SourceString")
        if skinname in deluxeskins:
            skinname = skinname + " (DLC)"
        output_data[type][charname][item] = skinname

    for char in output_data["Skins"]:
        output_data["Skins"][char] = dict(
            sorted(output_data["Skins"][char].items(), key=lambda x: x[1])
        )
    for char in output_data["Faces"]:
        output_data["Faces"][char] = dict(
            sorted(output_data["Faces"][char].items(), key=lambda x: x[1])
        )
    
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

    output_data["MusicDisks"] = dict(
        sorted(output_data["MusicDisks"].items(), key=lambda x: x[1])
    )

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

    unobtainableweapons = ["Velokan","Telarim", "Milerim", "Nibalum", "Beselbum", "Gelerim"]

    for item in itemsdef:
        curritem = itemsdef[item]
        if curritem.get("Item_Type_88_2F24F8FB4235429B4DE1399DBA533C78") != 'E_jRPG_ItemType::NewEnumerator0':
            continue
        
        charname = itemsubtypes[curritem.get("Item_Subtype_87_0CE0028F4D632385B61EDABBFBDF5360")]
        charname= charname if charname != "Noah" else "Gustave" 

        if charname not in output_data["Weapons"]:
            output_data["Weapons"][charname] = {}
        weaponname = curritem.get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("SourceString")
        if weaponname in unobtainableweapons:
            weaponname = weaponname+"*"
        if weaponname == None:
            weaponname = curritem.get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("CultureInvariantString")+"**"
        output_data["Weapons"][charname][item] = weaponname


    # Sort the characters alphabetically
    output_data["Weapons"] = dict(
        sorted(output_data["Weapons"].items(), key=lambda x: x[0])
    )
    
    # Sort the characters alphabetically, then sort weapons for each character and group by availability
    for char in output_data["Weapons"]:
        weapons = list(output_data["Weapons"][char].items())
        normal = [(k, v) for k, v in weapons if not v.endswith("*")]
        single_starred = [(k, v) for k, v in weapons if v.endswith("*") and not v.endswith("**")]
        double_starred = [(k, v) for k, v in weapons if v.endswith("**")]
        
        # Sort each group alphabetically by weapon name
        normal = sorted(normal, key=lambda x: x[1])
        single_starred = sorted(single_starred, key=lambda x: x[1])
        double_starred = sorted(double_starred, key=lambda x: x[1])
        
        output_data["Weapons"][char] = dict(normal + single_starred + double_starred)

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

    output_data["Journals"] = dict(
        sorted(output_data["Journals"].items(), key=lambda x: x[1])
    )

    jsondump(output_data, output_path)

    print("Journal mapping generated successfully.")

def genquestitemsmapping():
    items = "originalGameMapping/DT_QuestItems.json"

    output_path = os.path.join(output_dir, "questitems.json")

    with open(items, "r", encoding="utf-8") as f:
        itemsdef = json.load(f)[0].get("Rows")
    
    output_data = {
        "QuestItems": {}
    }

    weirditems = {}

    for item in itemsdef:
        curritem = itemsdef[item]
        friendlyname = curritem.get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("SourceString")
        if not friendlyname:
            friendlyname = curritem.get("Item_DisplayName_89_41C0C54E4A55598869C84CA3B5B5DECA").get("CultureInvariantString")+"**"
            weirditems[item] = friendlyname
        else:
            output_data["QuestItems"][item] = friendlyname
    
    output_data["QuestItems"] = dict(
        sorted(output_data["QuestItems"].items(), key=lambda x: x[1])
    )
    weirditems = dict(
        sorted(weirditems.items(), key=lambda x: x[1])
    )
    output_data["QuestItems"].update(weirditems)


    jsondump(output_data, output_path)

    print("Quest item mapping generated successfully.")

def oldgenmonocoskillsmapping():
    skillsdir = "originalGameMapping/MonocoSkills"
    output_path = os.path.join(output_dir, "monocoskills.json")

    output_data = {
        "MonocoSkills": {}
    }

    for filename in os.listdir(skillsdir):
        if not filename.endswith(".json"):
            continue
        with open(os.path.join(skillsdir, filename), "r", encoding="utf-8") as f:
            skilldef = json.load(f)[0].get("Properties")
            skillkey = skilldef.get("NameID")
            skillname = skilldef.get("name").get("SourceString")
            if not skillname:
                skillname = skilldef.get("name").get("CultureInvariantString")+"**"
            output_data["MonocoSkills"][skillkey] = skillname

    output_data["MonocoSkills"] = dict(
        sorted(output_data["MonocoSkills"].items(), key=lambda x: x[1].lower().replace("é", "e"))
    )

    jsondump(output_data, output_path)

    print("Monoco skill mapping generated successfully.")

def genmonocoskillsmapping():
    output_path = os.path.join(output_dir, "monocoskills.json")
    input_skills = "originalGameMapping/DA_SkillGraph_Monoco.json"

    with open(input_skills, "r", encoding="utf-8") as f:
        skillstreedef = json.load(f)[0].get("Properties").get("Nodes")
    output_data = {
        "MonocoSkills": {},
        "MonocoGradient":{}
    }

    for item in skillstreedef:
        item = item.get("SkillUnlock_3_15FA1C06433ACE049603919CDF6155FF")
        itemrequirement = item.get("RequiresUnlockItem_18_D9EBC20F41097DD7517E428E4A57655E").get("RowName")
        fileskillDA = item.get("Skill_2_9E4FC5804778258FBAA04BBF7F68F799").get("ObjectPath").replace("/Game/Gameplay/SkillTree/Content/Monoco/Skills/","originalGameMapping/MonocoSkills/").replace(".0", ".json")
        with open(fileskillDA, "r", encoding="utf-8") as f:
            skill = json.load(f)[0].get("Properties")
            skillkey = skill.get("NameID")
            skillname = skill.get("name").get("SourceString")

         # Skip if the item requirement is "None"
        if "GradientUnlock" in itemrequirement:
            output_data["MonocoGradient"][skillkey] = skillname
            continue
        else:
            output_data["MonocoSkills"][skillkey] = {"skillname":skillname,"itemrequirements":itemrequirement}
    
    # Sort the skills alphabetically by skill name
    output_data["MonocoSkills"] = dict(
        sorted(output_data["MonocoSkills"].items(), key=lambda x: x[1]["skillname"].lower().replace("é", "e"))
    )
    output_data["MonocoGradient"] = dict(
        sorted(output_data["MonocoGradient"].items(), key=lambda x: x[1].lower().replace("é", "e"))
    )

    jsondump(output_data, output_path)
    print("New Monoco skill mapping generated successfully.")
        
def gengrandientskillmapping():
    inputgradient = "originalGameMapping/DT_Items_GradientAttackUnlocks.json"
    output_path = os.path.join(output_dir, "gradientskills.json")
    with open(inputgradient, "r", encoding="utf-8") as f:
        gradientlist = json.load(f)[0].get("Rows")

    output_data = {
        "GradientSkills": {}
    }

    for gradient in gradientlist:
        if not "GradientUnlock_" in gradient:
            continue
        charname = str(gradient).removeprefix("GradientUnlock_")[:-1]
        if not output_data["GradientSkills"].get(charname):
            output_data["GradientSkills"][charname] = []
        output_data["GradientSkills"][charname].append(gradient)

    jsondump(output_data, output_path)
    print("Gradient skill mapping generated successfully.")

def genmanordoormapping():
    output_data = {
        "ManorDoors": []
    }
    files = ["DJBE7GX6HAETWSRXO6OFRJUAA","8IRVA8RSVAKD8FH2T72N3ATWP"]
    for file in files:
        inputmanorelements = f"originalGameMapping/levels/Manor/{file}.json" #unpublished files that are too big
        output_path = os.path.join(output_dir, "manordoors.json")
        with open(inputmanorelements, "r", encoding="utf-8") as f:
            manorelements = json.load(f)
        
        

        for element in manorelements:
            if not "BP_GPE_ManorInsideDoor_C" in element["Type"]:
                continue
            door = element["Properties"]["ObjectGlobalID"]
            output_data["ManorDoors"].append(door)

    jsondump(output_data, output_path)
    print("Manor door mapping generated successfully.")
            
def genflagmapping():
    inputflags = "originalGameMapping/DT_LevelData.json"
    output_path = os.path.join(output_dir, "flags.json")
    with open(inputflags, "r", encoding="utf-8") as f:
        levelsinfolist = json.load(f)[0].get("Rows")

    output_data = {
        "Flags": {}
    }

    for level in levelsinfolist:
        levelinfo = levelsinfolist[level]
        if levelinfo.get("LevelType_37_EE4A371F4388B884A49327A9EEC1B9F0") != "ELevelType::NewEnumerator0":
            continue
        levelname = levelinfo.get("DisplayName_10_D3213B974EE2CBDD44757B978CD84FD8").get("SourceString")
        if not levelname:
            if level != "Map_BattleTesting":
                print("Level name is empty for level that shouldnt be:", level)
            continue
        elif level == "SideLevel_CleasTower_Entrance":
            levelname += " Entrance"

        key = levelinfo.get("LevelAssetName_85_BF09694C41CC0444295731A40341A5F9")
        
        levelflaginfo = {}
        levelflaginfo["LevelKey"] = key
        
        mainspawnpoint = levelinfo.get("MainSpawnPoint_72_5C7B345E44E5B2867FCE0687BB65019F").get("TagName")
        levelflaginfo["MainSpawnPoint"] = mainspawnpoint

        subflags = {}
        for flag in levelinfo.get("SubAreas_73_B59A02D5470428064B9B03A1A3F5F82C"):
            flagkey = flag.get("Key").get("TagName")
            flagname = flag.get("Value").get("SourceString")
            if not flagname:
                print("Flag name is empty for flag:", flagkey, "in level:", levelname)
            subflags[flagkey] = flagname

        levelflaginfo["SubFlags"] = subflags


        if not output_data["Flags"].get(levelname):
            output_data["Flags"][levelname] = levelflaginfo
        else:
            print("Duplicate level name found:", levelname)
        
    # Sort the levels alphabetically
    # Separate normal levels from ones with **
    normal_levels = {k: v for k, v in output_data["Flags"].items() if not k.endswith("**")}
    starred_levels = {k: v for k, v in output_data["Flags"].items() if k.endswith("**")}
    
    # Sort each group alphabetically
    normal_levels = dict(sorted(normal_levels.items(), key=lambda x: x[0]))
    starred_levels = dict(sorted(starred_levels.items(), key=lambda x: x[0]))
    
    # Combine with ** levels at the end
    output_data["Flags"] = {**normal_levels, **starred_levels}

    jsondump(output_data, output_path)
    print("Flag mapping generated successfully.")

        




#gengrandientskillmapping()
#genmonocoskillsmapping()
#oldgenmonocoskillsmapping()
#genquestitemsmapping()
#genweaponmapping()    
#genjournalsmapping()
#genpictomapping()
#genskinmapping()
#genmusicdiskmapping()
#genmanordoormapping()
genflagmapping()
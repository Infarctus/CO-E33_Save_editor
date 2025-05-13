import os
import json

output_dir = "./customGameMapping"
os.makedirs(output_dir, exist_ok=True)
def genpicto():
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
        #else:
        #    output_data["Unused"].append(picto)

    # Write the output JSON
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=4)

    print(f"Custom mappings written to {output_path}")

def skinmapping():
    input_skindefs = "originalGameMapping/DT_CharacterCustomizationItems.json"

    output_path = os.path.join(output_dir, "skins.json")

    with open(input_skindefs, "r", encoding="utf-8") as f:
        pictoslist = json.load(f)[0].get("Rows")
    

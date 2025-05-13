import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import { triggerSaveNeeded, workingFileCurrent } from './filemanagement';
import { getMappingJsonFromJson, jsonMapping } from './mappingjson/mappingjson';


let editor: JSONEditor | null;
export let jsonChangedSinceInit = false;

export function initRawJsonEditor() {


    const commitButton = document.getElementById("CommitRawJsonChanges");

    if (commitButton) {
        commitButton.addEventListener("click", () => {
            console.log("Commited raw json changes")
            const jsonDataMaybe =editor?.get();
            if (workingFileCurrent != null && jsonDataMaybe != null) {
                jsonChangedSinceInit=false;
                triggerSaveNeeded();

                getMappingJsonFromJson(jsonDataMaybe)
            }
        });
    }


    document.addEventListener('tabActivatedRawJson', (event) => {
        console.log("RawJson tab recieved tabActivatedRawJson", JSON.stringify(event))

            console.log("RawJson tab recieved an activated event")
            if (workingFileCurrent != null)
                updateRawJsonEditor(jsonMapping);
            else updateRawJsonEditor("Nothing to show !");
    });

}


function updateRawJsonEditor(startJsonObject: any) {
    const container = document.querySelector('.RawJsonEditor') as HTMLElement;
    if (editor != null) editor.destroy();


    jsonChangedSinceInit = false;

    editor = new JSONEditor(container, {
        mode: 'tree', // You can also use 'view', 'form', 'text', etc.
        onChange: () => {
                jsonChangedSinceInit=true;
        }
    });
    editor.set(startJsonObject); // Set the initial JSON data
}



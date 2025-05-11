import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';


let editor: JSONEditor | null;

const json = {
    name: "John Doe",
    age: 30,
    city: "New York",
    hobbies: ["reading", "traveling", "swimming"],
    address: {
        street: "123 Main St",
        zip: "10001"
    }
};



export function updateRawJsonEditor() {
    const container = document.querySelector('.RawJsonEditor') as HTMLElement;
    if (editor == null) {
        const commitButton = document.getElementById("CommitRawJsonChanges");
    
        if (commitButton) {
            commitButton.addEventListener("click", () => {
                const jsonData = getJsonFromEditor();
                if (jsonData) {
                    console.log("JSON Object:", jsonData.jsonObject);
                    console.log("JSON String:", jsonData.jsonString);
                }
            });
        }
    
    }
    editor = new JSONEditor(container, {
        mode: 'tree', // You can also use 'view', 'form', 'text', etc.
    });
    editor.set(json); // Set the initial JSON data

}


function getJsonFromEditor() {
    if (editor) {
        // Get the JSON object
        const jsonObject = editor.get();

        // Get the JSON as plain text
        const jsonString = JSON.stringify(jsonObject, null, 2); // Pretty print with 2 spaces

        return {
            jsonObject,
            jsonString
        };
    } else {
        console.error("Editor is not initialized.");
        return null;
    }
}
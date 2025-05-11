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
    editor = new JSONEditor(container, {
        mode: 'tree', // You can also use 'view', 'form', 'text', etc.
    });
    editor.set(json); // Set the initial JSON data

}
use uesave::{Save, SaveReader};

#[tauri::command]
pub fn save_to_json(
    save_path: String,
    output_path: String, // must exist
) -> Result<(), String> {
    let save = Save::read(&mut std::fs::File::open(save_path).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;

    serde_json::to_writer(&mut std::fs::File::create(output_path).map_err(|e| e.to_string())?, &save)
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub fn json_to_save(
    json_path: String,
    output_path: String, // must exist
) -> Result<(), String> {
    let save: Save = serde_json::from_reader(&mut std::fs::File::open(json_path).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    
    save.write(&mut std::fs::File::create(output_path).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    
    Ok(())
}   

#[tauri::command]
pub fn test_resave(
    path: String,
    no_warn: bool,
    debug: bool,
) -> Result<(), String> {

    let path_obj = std::path::Path::new(&path);
    // Read the input file
    let input_data = std::fs::read(path_obj).map_err(|e| e.to_string())?;
    let mut input_cursor = std::io::Cursor::new(input_data);
    let mut output_cursor = std::io::Cursor::new(Vec::new());

    // Perform the resave operation
    SaveReader::new()
        .log(!no_warn)
        .read(&mut input_cursor)
        .map_err(|e| e.to_string())?
        .write(&mut output_cursor)
        .map_err(|e| e.to_string())?;

    // Compare input and output
    let original_data = input_cursor.into_inner();
    let resaved_data = output_cursor.into_inner();

    if original_data != resaved_data {
        if debug {
            std::fs::write("input.sav", &original_data)
                .map_err(|e| e.to_string())?;
            std::fs::write("output.sav", &resaved_data)
                .map_err(|e| e.to_string())?;
        }
        return Err("Resave did not match".to_string());
    }

    Ok(())
}

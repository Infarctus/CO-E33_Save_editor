use std::fs::File;
use std::io::BufReader;
use std::path::Path;
use uesave::Save;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Define paths relative to where we will run cargo (src-tauri dir)
    // The save file is in the project root, so we go up two levels from src-tauri/src/bin
    // Actually we run from src-tauri, so it's ../EXPEDITION_1.sav
    let input_path = Path::new("../EXPEDITION_1.sav");
    let output_path = Path::new("../EXPEDITION_1_EXTRACTED.json");

    println!(
        "Attempting to open save file at: {:?}",
        input_path
            .canonicalize()
            .unwrap_or(input_path.to_path_buf())
    );

    let mut file = BufReader::new(File::open(input_path)?);

    // Use uesave to parse the GVAS file
    // This matches the logic in src-tauri/src/commands/uesave.rs:
    // let save = Save::read(&mut std::fs::File::open(save_path)...)?
    let save = Save::read(&mut file)?;

    // Serialize to JSON
    // This matches: serde_json::to_writer(...)
    let output_file = File::create(output_path)?;
    serde_json::to_writer_pretty(output_file, &save)?;

    println!(
        "Successfully unpacked save to: {:?}",
        output_path
            .canonicalize()
            .unwrap_or(output_path.to_path_buf())
    );

    Ok(())
}

use tauri::Manager;
use tauri_plugin_log::Target;
use tauri_plugin_log::TargetKind;

mod commands;
use commands::getxboxfolder::getxboxsavesfrompath;
use commands::openexplorer::open_explorer;
use commands::uesave::{save_to_json, json_to_save,test_resave};

mod jsonmappings;
use jsonmappings::basecharactersavemapping::getbasecharactersavemapping;
use jsonmappings::manordoormapping::getmanordoormapping;
use jsonmappings::musicdiskmapping::getmusicdiskmapping;
use jsonmappings::skinmapping::getskinmapping;
use jsonmappings::pictomapping::getpictomapping;
use jsonmappings::journalsmapping::getjournalsmapping;
use jsonmappings::weaponmapping::getweaponmapping;
use jsonmappings::questitemsmapping::getquestitemsmapping;
use jsonmappings::monocoskillsmapping::getmonocoskillsmapping;
use jsonmappings::gradientskillmapping::getgradientskillmapping;
use jsonmappings::flagmapping::getflagmapping;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([
                    Target::new(TargetKind::Webview),
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir {
                        file_name: Some("logs".into()),
                    }),
                    // Target::new(TargetKind::LogDir { file_name: Some("webview".into()) }).filter(|metadata| metadata.target().starts_with(WEBVIEW_TARGET)),
                    // Target::new(TargetKind::LogDir { file_name: Some("rust".into()) }).filter(|metadata| !metadata.target().starts_with(WEBVIEW_TARGET)),
                ])
                .build(),
        )
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            getbasecharactersavemapping,
            getmanordoormapping,
            getmusicdiskmapping,
            getskinmapping,
            getpictomapping,
            getjournalsmapping,
            getweaponmapping,
            getquestitemsmapping,
            getmonocoskillsmapping,
            getgradientskillmapping,
            getflagmapping,
            open_explorer,
            getxboxsavesfrompath,
            save_to_json,
            json_to_save,
            test_resave
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

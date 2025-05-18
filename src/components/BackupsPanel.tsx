import { useEffect, useMemo, useState, type FC } from "react";
import { BackupInfoType } from "../types/jsonCustomMapping";
import { getAllBackups } from "../utils/fileManagement";
import { error, trace } from "@tauri-apps/plugin-log";
import { copyFile } from "@tauri-apps/plugin-fs";
import { appLocalDataDir, join } from "@tauri-apps/api/path";

const BackupsPanel: FC = () => {
  const [allBackups, setAllBackups] = useState<string[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  useEffect(() => {
    getAllBackups()
      .then((res) => setAllBackups(res))
      .catch((reason) => error("Could not get all backups:" + reason));
  }, []);

  // const allBackups = await getAllBackups()
  let existingSaves: BackupInfoType[] = useMemo(() => {
    trace("Triggered memo for saves, we have " + allBackups.length);
    return allBackups
      .filter((el) => el.includes("Z_"))
      .map((el) => {
        const indexOfTheEndOfTheDate = el.indexOf("Z_") + 1;
        const workingBkp: BackupInfoType = {
          name: el,
          friendlyName: el.substring(indexOfTheEndOfTheDate + 1),
          date: new Date(
            el.substring(0, indexOfTheEndOfTheDate).replace(/–/g, ":")
          ),
        };
        // trace(workingBkp.name + "   " + workingBkp.date)
        return workingBkp;
      });
  }, [allBackups]);

  let shownSaves: BackupInfoType[] = useMemo(() => {
    return existingSaves
      .filter((el) => el.friendlyName.includes(searchString))
      .sort((a, b) => {
        let datA: number = 0;
        let datB: number = 0;
        if (!isNaN(a.date.getTime())) {
          datA = a.date.getTime();
        }

        if (!isNaN(b.date.getTime())) {
          datB = b.date.getTime();
        }

        return datB - datA;
      })
      .slice(0, 100);
  }, [searchString, existingSaves]);

  async function onExportSave(name: string): Promise<boolean> {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const targetSavPath = await save({
      title: "Export backup to...",
      filters: [
        {
          name: `CO:E33 Save File`,
          extensions: ["*"],
        },
      ],
    });

    if (!targetSavPath) {
      error("Export canceled or no target SAV path selected.");
      return false;
    }
    const userDataPath = await appLocalDataDir();
    const sourceDir = await join(userDataPath, "data", "backup", name);
    try {
      await copyFile(sourceDir, targetSavPath);
    } catch (err) {
      error("Could not export backup file : " + err);
      return false;
    }

    return true;
  }

  return (
    <div id="BackupsPanel" className="tab-panel">
      <h2>Backups</h2>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name..."
        className="search-bar"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />
      {shownSaves.length != 0 && (
        <sup style={{ padding: "0.7em" }}>
          {shownSaves.length} result{shownSaves.length == 1 ? "" : "s"}
        </sup>
      )}
      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #ccc",
            }}
          >
            <th
              style={{
                padding: "0.5em",
              }}
              // onClick={() => handleSort("friendlyName")}
            >
              Name{" "}
              {/* {sortField === "friendlyName" &&
                (sortDirection === "asc" ? "↑" : "↓")} */}
            </th>
            <th
              style={{
                padding: "0.5em",
                textAlign: "center",
              }}
              // onClick={() => handleSort("friendlyName")}
            >
              Time{" "}
              {/* {sortField === "friendlyName" &&
                (sortDirection === "asc" ? "↑" : "↓")} */}
            </th>
            <th
              style={{
                padding: "0.5em",
                textAlign: "center",
              }}
              // onClick={() => handleSort("friendlyName")}
            >
              {"Export"}{" "}
              {/* {sortField === "friendlyName" &&
                (sortDirection === "asc" ? "↑" : "↓")} */}
            </th>{" "}
          </tr>
        </thead>
        <tbody>
          {shownSaves.map((el) => (
            <tr key={el.name}>
              <td>{el.friendlyName}</td>
              <td
                style={{
                  textAlign: "center",
                }}
              >
                {el.date.toLocaleString()}
              </td>
              <td
                style={{
                  textAlign: "center",
                }}
              >
                <button
                  // id="ExportSave"
                  // className="tab-button"
                  onClick={(e) => {
                    onExportSave(el.name).then((rep) => {
                      if (rep) {
                        (e.target as HTMLButtonElement).innerText = "OK !";
                      } else {
                        (e.target as HTMLButtonElement).innerText = "Oopsies";
                      }
                    });
                  }}
                  title={
                    "Export this backup to wherever you want.\nYou will be prompted for the target destination."
                  }
                >
                  Export File
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackupsPanel;

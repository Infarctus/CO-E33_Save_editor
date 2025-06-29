import { type FC, useMemo, useState } from 'react';
import type { GeneralPanelProps } from '../../types/panelTypes';
import { renderToggle } from '../../utils/HtmlElement';
import { error, trace } from '@tauri-apps/plugin-log';
import { useInfo } from '../InfoContext';

const UnkillEnemies: FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  if (!jsonMapping || !jsonMapping?.root?.properties?.BattledEnemies_0) {
    return (
      <div id='UnkillEnemies' className='tab-panel overflow-auto'>
        <h2>Unkill Enemies</h2>
        <p style={{ color: 'red' }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    );
  }

  const { setInfoMessage } = useInfo();
  function logAndError(message: string) {
    setInfoMessage(message);
    error(message);
  }

  const allEnemies = useMemo(() => {
    return jsonMapping.root.properties.BattledEnemies_0.Map.map((enemy) => ({
      name: enemy.key.Name,
      value: enemy.value.Bool,
    })).reverse();
  }, [jsonMapping]);

  const [enemies, setEnemies] = useState(allEnemies);

  // Update uniqueEnemies and objectIdEnemies based on enemies state
  const uniqueEnemies = useMemo(() => {
    return enemies.filter(
      (enemy) =>
        !enemy.name.includes('ObjectID_Enemy_Level_') ||
        enemy.name.includes('EnemyWorld_Mime') ||
        enemy.name.includes('EnemyWorld_Petank') ||
        enemy.name.toLowerCase().includes('alpha'),
    );
  }, [enemies]);

  const objectIdEnemies = useMemo(() => {
    return enemies.filter(
      (enemy) =>
        enemy.name.includes('ObjectID_Enemy_Level_') &&
        !enemy.name.includes('EnemyWorld_Mime') &&
        !enemy.name.includes('EnemyWorld_Petank') &&
        !enemy.name.toLowerCase().includes('alpha'),
    );
  }, [enemies]);

  const [filterOption, setFilterOption] = useState('Unique enemies only');
  const [searchString, setSearchString] = useState<string>('');

  // Filter enemies based on search string and selected filter option
  const filteredEnemies = useMemo(() => {
    trace("Just filtered enemies again");
    let filtered = enemies;

    // First apply the filter option
    if (filterOption === 'Unique enemies only') {
      filtered = uniqueEnemies;
    } else if (filterOption === 'Other enemies only') {
      filtered = objectIdEnemies;
    }

    // Then apply the search string filter
    filtered = filtered.filter((enemy) =>
      enemy.name.toLowerCase().includes(searchString.toLowerCase())
    );

    return filtered;
  }, [enemies, searchString, filterOption, uniqueEnemies, objectIdEnemies]);

  function handleToggleEnemy(enemyName: string, newBool: boolean) {
    const targetEnemyIndex = enemies.findIndex((enemy) => enemy.name === enemyName);
    if (targetEnemyIndex === -1) {
      logAndError(`Enemy ${enemyName} not found in the list.`);
      return;
    }
    trace("target " + newBool + " on " + enemyName);
    trace("before edit " + enemies[targetEnemyIndex].value);

    jsonMapping!.root.properties.BattledEnemies_0.Map.forEach((enemy) => {
      if (enemy.key.Name === enemyName) {
        enemy.value.Bool = newBool;
      }
    });
    jsonMapping!.root.properties.EncounteredEnemies_0.Map.forEach((enemy) => {
      if (enemy.key.Name === enemyName) {
        enemy.value.Bool = newBool;
      }
    });
    if (jsonMapping!.root.properties.TransientBattledEnemies_0) {
      jsonMapping!.root.properties.TransientBattledEnemies_0.Map.forEach((enemy) => {
        if (enemy.key.Name === enemyName) {
          enemy.value.Bool = newBool;
        }
      });
    }
    triggerSaveNeeded();

    setEnemies((prev) =>
      prev.map((enemy) => {
        if (enemy.name === enemyName) {
          trace("Found the enemy name ok");
          return { ...enemy, value: newBool };
        }
        return enemy;
      }),
    );
        trace("after edit " + enemies[targetEnemyIndex].value);
  }

  return (
    <div id='UnkillEnemies' className='tab-panel overflow-auto'>
      <div className='header'>
        <h2>Unkill Enemies</h2>
        <div>
          <span style={{ marginLeft: '1rem' }}>Filter:</span>
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
          >
            <option value="Unique enemies only">Unique enemies only</option>
            <option value="Other enemies only">Other enemies only</option>
            <option value="All">All</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <input
        type='text'
        placeholder='Search by name...'
        value={searchString}
        className='search-bar'
        onChange={(e) => setSearchString(e.target.value)}
      />

      {/* Results Counter */}
      <sup style={{ padding: '0.7em' }}>
        {filteredEnemies.length > 0 ? `${filteredEnemies.length} results` : 'No results'}
      </sup>

      {/* Table for Enemies */}
      <table
        style={{
          width: '100%',
          maxWidth: '500px',
          borderCollapse: 'collapse',
          marginTop: '1rem',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                padding: '0.5em',
              }}
            >
              Enemy Name
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                padding: '0.5em',
              }}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredEnemies.map((enemy) => (
            <tr key={enemy.name}>
              <td>{enemy.name}</td>
              <td>
                {renderToggle(enemy.value, (newBool) => {
                  handleToggleEnemy(enemy.name, newBool);
                })}
              </td>
            </tr>
          ))}
          {filteredEnemies.length === 0 && (
            <tr>
              <td
                colSpan={2}
                style={{
                  padding: '0.5em',
                  textAlign: 'center',
                }}
              >
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UnkillEnemies;

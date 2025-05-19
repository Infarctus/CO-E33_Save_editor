import { useMemo, useState } from 'react'
import type { JournalInfo } from '../types/jsonCustomMapping'
import { getPossibleMonocoSkills } from '../utils/gameMappingProvider'
import { useInfo } from './InfoContext'
import { error } from '@tauri-apps/plugin-log'
import type { GeneralPanelProps } from '../types/panelTypes'

type SkillInfo = { name: string; friendlyName: string; unlocked: boolean }

const MonocoSkillsPanel: React.FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
    if (!jsonMapping || !jsonMapping?.root?.properties?.CharactersCollection_0) {
        return (
            <div id='MonocoSkillsPanel' className='tab-panel overflow-auto'>
                <h2>Monoco Skills</h2>
                <p style={{ color: 'red' }}>
                    The file you opened (if any) doesn't look like a CO:E33 save file
                </p>
            </div>
        )
    }
    const monocoObj = jsonMapping?.root?.properties?.CharactersCollection_0?.Map.find(
        (el: any) => el.key.Name === 'Monoco',
    )
    if (!monocoObj) {
        return (
            <div id='MonocoSkillsPanel' className='tab-panel overflow-auto'>
                <h2>Monoco Skills</h2>
                <p style={{ color: 'red' }}>You don't currently posess monoco</p>
            </div>
        )
    }
    const unlockedSkillsArr: string[] =
        monocoObj.value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0.Array
            .Base.Name || []

    const allMonocoSkills = useMemo(() => getPossibleMonocoSkills(), [])
    const unlockedDict = useMemo(
        () => Object.fromEntries(unlockedSkillsArr.map((name) => [name, true])),
        [unlockedSkillsArr],
    )

    const initialSkills: SkillInfo[] = useMemo(
        () =>
            allMonocoSkills.map(([name, friendlyName]) => ({
                name,
                friendlyName,
                unlocked: !!unlockedDict[name],
            })),
        [allMonocoSkills, unlockedDict],
    )
    const [skills, setSkills] = useState<SkillInfo[]>(initialSkills)
    const [searchQuery, setSearchQuery] = useState<string>('')

    const handleSkillToggle = (skillName: string, newUnlocked: boolean) => {
        // Find the Monoco skills array in the save structure
        const skillsArr =
            monocoObj.value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0
                .Array.Base.Name

        if (newUnlocked) {
            // Add if not present
            if (!skillsArr.includes(skillName)) {
                skillsArr.push(skillName)
            }
        } else {
            // Remove if present
            const idx = skillsArr.indexOf(skillName)
            if (idx !== -1) {
                skillsArr.splice(idx, 1)
            }
        }

        setSkills((prev) =>
            prev.map((skill) =>
                skill.name === skillName ? { ...skill, unlocked: newUnlocked } : skill,
            ),
        )
        triggerSaveNeeded()
    }
    const displayedSkills = useMemo(() => {
        return skills.filter((skill) =>
            skill.friendlyName.toLowerCase().includes(searchQuery.toLowerCase()),
        )
    }, [skills, searchQuery])

    return (
        <div id='MonocoSkillsPanel' className='tab-panel overflow-auto'>
            <h2>Monoco Skills</h2>
            {/* Search Bar */}
            <input
                type='text'
                placeholder='Search by name...'
                className='search-bar'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {displayedSkills.length !== 0 && (
                <sup style={{ padding: '0.7em' }}>{displayedSkills.length} results</sup>
            )}
            {/* Table */}
            <table
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    borderCollapse: 'collapse',
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
                            Name
                        </th>
                        <th
                            style={{
                                borderBottom: '1px solid #ccc',
                                padding: '0.5em',
                            }}
                        >
                            Unlocked
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {displayedSkills.map((skill) => (
                        <tr key={skill.name}>
                            <td>{skill.friendlyName}</td>
                            <td style={{ textAlign: 'center' }}>
                                <label className='switch'>
                                    <input
                                        type='checkbox'
                                        checked={skill.unlocked}
                                        onChange={(e) =>
                                            handleSkillToggle(skill.name, e.target.checked)
                                        }
                                    />
                                    <div className='slider round'></div>
                                </label>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default MonocoSkillsPanel

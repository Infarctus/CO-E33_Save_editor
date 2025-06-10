import HomePanel from './Panels/HomePanel'
import CharactersPanel from './Panels/CharactersPanel'
import BackupsPanel from './Panels/BackupsPanel'
import RawJsonPanel from './Panels/RawJsonPanel'
import MusicDisksPanel from './Panels/MusicDisksPanel'
import JournalsPanel from './Panels/JournalsPanel'
import PictosPanel from './Panels/PictosPanel'
import WeaponsPanel from './Panels/WeaponsPanel'
import ResourcesPanel from './Panels/ResourcesPanel'
import MonocoSkillsPanel from './Panels/MonocoSkillsPanel'
import QuestItemsPanel from './Panels/QuestItemsPanel'
import EsquieSkillsPanel from './Panels/EsquieSkillsPanel'
import FriendlyNevrons from './Panels/FriendlyNevrons'
import SpawnLocationPanel from './Panels/SpawnLocationPanel'

interface NavItem {
  id: string
  label: string
  icon: string
  requiresFile: boolean
  component: React.ComponentType<any>
}


// prettier-ignore
export const navItems: NavItem[] = [
  { id: 'SaveFile', label: 'Home', icon: 'btnHome.png', requiresFile: false, component: HomePanel },
  { id: 'Characters', label: 'Characters', icon: 'btnCharacters.png', requiresFile: true, component: CharactersPanel },
  { id: 'Weapons', label: 'Weapons', icon: 'btnWeapon.png', requiresFile: true, component: WeaponsPanel },
  { id: 'MonocoSkills', label: 'Monoco Skills', icon: 'btnMonocoSkills.png', requiresFile: true, component: MonocoSkillsPanel },
  { id: 'EsquieSkills', label: 'Esquie Skills', icon: 'btnEsquie.png', requiresFile: true, component: EsquieSkillsPanel },
  { id: 'Pictos', label: 'Pictos', icon: 'btnPicto.png', requiresFile: true, component: PictosPanel },
  { id: 'Resources', label: 'Resources & Misc', icon: 'btnResources.png', requiresFile: true, component: ResourcesPanel },
  { id: 'SpawnLocation', label: 'Spawn Location', icon: 'btnSpawnLocation.png', requiresFile: true, component: SpawnLocationPanel },
  { id: 'FriendlyNevrons', label: 'Friendly Nevrons', icon: 'btnFriendlyNevrons.png', requiresFile: true, component: FriendlyNevrons },
  { id: 'MusicDisks', label: 'Music Disks', icon: 'btnMusicRecordIcon.png', requiresFile: true, component: MusicDisksPanel },
  { id: 'Journals', label: 'Journals', icon: 'btnJournal.png', requiresFile: true, component: JournalsPanel },
  { id: 'QuestItems', label: 'Quest Items', icon: 'btnQuestItems.png', requiresFile: true, component: QuestItemsPanel },
  { id: 'RawJson', label: 'Raw json', icon: 'btnRawEditor.png', requiresFile: true, component: RawJsonPanel },
  { id: 'Backups', label: 'Backups', icon: 'btnBackup.png', requiresFile: false, component: BackupsPanel },
]
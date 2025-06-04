import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import { attachConsole, trace } from '@tauri-apps/plugin-log'
import { initGameMappings } from './utils/gameMappingProvider'
import { InfoProvider } from './components/InfoContext'

attachConsole().then(() => {
  trace('attached console')
})

initGameMappings()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <InfoProvider>
      {' '}
      {/* Wrap App with InfoProvider */}
      <App />
    </InfoProvider>
  </React.StrictMode>,
)

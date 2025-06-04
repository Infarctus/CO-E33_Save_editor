'use client'

import { type FC, useEffect, useRef } from 'react'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import { trace } from '@tauri-apps/plugin-log'

interface RawJsonPanelProps {
  jsonMapping: any
  triggerSaveNeeded: () => void
  setJsonChangedSinceInit: (newstate : boolean) => void
  setJsonMapping: (jsonData: any) => void
}

const RawJsonPanel: FC<RawJsonPanelProps> = ({ jsonMapping,triggerSaveNeeded, setJsonChangedSinceInit, setJsonMapping }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<JSONEditor | null>(null)

  const onjsonChange = () => {
    setJsonChangedSinceInit(true)
    triggerSaveNeeded()
  }
  const onCommitChanges = (jsonData: any) => {
    setJsonMapping(jsonData)
    setJsonChangedSinceInit(false)
    triggerSaveNeeded()
    trace("Committed raw json changes")
  }

  useEffect(() => {
    if (containerRef.current && jsonMapping) {
      // Destroy previous editor instance if it exists
      if (editorRef.current) {
        editorRef.current.destroy()
      }

      // Create new editor instance
      editorRef.current = new JSONEditor(containerRef.current, {
        mode: 'tree',
        onChange: onjsonChange,
      })

      // Set the JSON data
      editorRef.current.set(jsonMapping)
    }

    return () => {
      // Clean up on unmount
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [jsonMapping])

  const handleCommitChanges = () => {
    if (editorRef.current) {
      const jsonData = editorRef.current.get()
      onCommitChanges(jsonData)
    }
  }

  return (
    <div id='RawJsonPanel' className='tab-panel'>
      <div className='header'>
        <h2>Raw json</h2>
        <button id='CommitRawJsonChanges' onClick={handleCommitChanges}>
          Commit changes
        </button>
      </div>
      <p>Careful. You might break things.</p>
      <div className='RawJsonEditor' ref={containerRef} style={{ height: '70vh' }}></div>
    </div>
  )
}

export default RawJsonPanel

'use client'

import { type FC, useEffect, useRef } from 'react'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'

interface RawJsonPanelProps {
  jsonMapping: any
  onJsonChange: () => void
  onCommitChanges: (jsonData: any) => void
}

const RawJsonPanel: FC<RawJsonPanelProps> = ({ jsonMapping, onJsonChange, onCommitChanges }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<JSONEditor | null>(null)

  useEffect(() => {
    if (containerRef.current && jsonMapping) {
      // Destroy previous editor instance if it exists
      if (editorRef.current) {
        editorRef.current.destroy()
      }

      // Create new editor instance
      editorRef.current = new JSONEditor(containerRef.current, {
        mode: 'tree',
        onChange: onJsonChange,
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

import { clamp } from './utils'
import { trace } from '@tauri-apps/plugin-log'
import React, { Component } from 'react'

export function renderNumberInput(
  value: number,
  label: string,
  minInput: number,
  maxInput: number,
  onChange: (newValue: number) => void,
  disabled?: boolean,
  StylemarginBottom = '0',
) {
  return (
    <div style={{ marginBottom: StylemarginBottom }}>
      {label !== '' && (
        <label htmlFor={label.toLowerCase() + '-label'} style={{ marginRight: '0.5rem' }}>
          {label}
        </label>
      )}
      <input
        id={label.toLowerCase() + '-input'}
        type='number'
        min={minInput}
        max={maxInput}
        value={value}
        disabled={disabled}
        onInput={(e) => {
          const target = e.target as HTMLInputElement
          onChange(clamp(target.valueAsNumber, minInput, maxInput))
        }}
        style={{ width: 'auto' }}
      />
    </div>
  )
}

export class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error: error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught in ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Render the error message in the fallback UI
      trace('error was ' + JSON.stringify(this.state.error?.name))
      return (
        <div className='tab-panel overflow-auto'>
          <h1>Oof. This tab crashed.</h1>
          <p>
            The error is :
            <br />
            <div className='cadre'>
              <code>
                {this.state.error!.name} :{' ' + this.state.error!.message}
              </code>
            </div>
          </p>
          You can search for and/or report this at{' '}
          <a
            href='https://www.nexusmods.com/clairobscurexpedition33/mods/201?tab=posts'
            target='_blank'
            rel='noopener noreferrer'
            style={{ color: '#11bb33' }}
          >
            our Nexus page
          </a>
          .
          <p>
            Stack trace :
            <br />
            <div className='cadre'>
              <code>{' ' + this.state.error!.stack}</code>
            </div>
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

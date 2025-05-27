import { clamp } from "./utils"


export function renderNumberInput(
  value: number,
  label: string,
  minInput: number,
  maxInput: number,
  onChange: (newValue: number) => void,
  disabled?: boolean,
  StylemarginBottom = "0",
) {
  return (
    <div style={{ marginBottom: StylemarginBottom }}>
      {label !== "" && (
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
        onChange(clamp(target.valueAsNumber, minInput, maxInput) || 0)
      }}
      style={{ width: 'auto' }}
      />
    </div>
  )
}
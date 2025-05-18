export interface OpenProcessResult {
  success: boolean
  message: string
  tempJsonPath?: string
  originalSavPath?: string
}

export interface SaveProcessResult {
  success: boolean
  message: string
  savEdToPath?: string
}

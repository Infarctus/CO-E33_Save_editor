import React, { createContext, useContext, useState, ReactNode } from 'react'

// Create a context
const InfoContext = createContext<
  | {
      infoMessage: string
      setInfoMessage: (message: string) => void
    }
  | undefined
>(undefined)

// Create a provider component
export const InfoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [infoMessage, setInfoMessage] = useState<string>(
    'Welcome. Use the Open File button to get started.',
  )

  return (
    <InfoContext.Provider value={{ infoMessage, setInfoMessage }}>{children}</InfoContext.Provider>
  )
}

// Custom hook to use the InfoContext
export const useInfo = () => {
  const context = useContext(InfoContext)
  if (!context) {
    throw new Error('useInfo must be used within an InfoProvider')
  }
  return context
}

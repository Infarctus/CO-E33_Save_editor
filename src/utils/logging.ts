"use client"

import type React from "react"

import { useEffect } from "react"

/**
 * Custom hook to override console methods and capture logs
 */
export function useConsoleOverride(
  setLogs: React.Dispatch<React.SetStateAction<{ message: string; level?: string }[]>>,
  setInfoMessage: React.Dispatch<React.SetStateAction<string>>,
) {
  useEffect(() => {
    const originalConsole = { ...console }

    console.log = (...args: any[]) => {
      originalConsole.log(...args)
      const message = args.join(" ")
      setLogs((prev) => [{ message, level: "log" }, ...prev])
      setInfoMessage(message)
    }

    console.error = (...args: any[]) => {
      originalConsole.error(...args)
      const message = args.join(" ")
      setLogs((prev) => [{ message, level: "error" }, ...prev])
      setInfoMessage(message)
    }

    console.warn = (...args: any[]) => {
      originalConsole.warn(...args)
      const message = args.join(" ")
      setLogs((prev) => [{ message, level: "warn" }, ...prev])
      setInfoMessage(message)
    }

    // For debugging
    console.log("Console override initialized")

    return () => {
      console.log = originalConsole.log
      console.error = originalConsole.error
      console.warn = originalConsole.warn
    }
  }, [setLogs, setInfoMessage])
}

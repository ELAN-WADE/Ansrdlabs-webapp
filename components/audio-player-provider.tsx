"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AudioPlayerContextType {
  currentTrack: {
    title: string
    url: string
    image?: string
  } | null
  setCurrentTrack: (
    track: {
      title: string
      url: string
      image?: string
    } | null,
  ) => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<{
    title: string
    url: string
    image?: string
  } | null>(null)

  return <AudioPlayerContext.Provider value={{ currentTrack, setCurrentTrack }}>{children}</AudioPlayerContext.Provider>
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider")
  }
  return context
}

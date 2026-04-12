"use client"

import { createContext, useContext, useState } from "react"
import { generateSchedule } from "../lib/scheduler"

type Team = {
  id: string
  name: string
}

type Match = {
  casa: string
  fora: string
}

type Round = Match[]

type AppContextType = {
  teams: Team[]
  rounds: Round[]
  addTeam: (name: string) => void
  removeTeam: (id: string) => void
  generate: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([])
  const [rounds, setRounds] = useState<Round[]>([])

  function addTeam(name: string) {
    const newTeam = {
      id: Date.now().toString(),
      name,
    }

    const updated = [...teams, newTeam]
    setTeams(updated)
    localStorage.setItem("teams", JSON.stringify(updated))
  }

  function removeTeam(id: string) {
    const updated = teams.filter((t) => t.id !== id)
    setTeams(updated)
    localStorage.setItem("teams", JSON.stringify(updated))
  }

  function generate() {
    const nomes = teams.map((t) => t.name)
    const tabela = generateSchedule(nomes)
    setRounds(tabela)
  }

  return (
    <AppContext.Provider
      value={{
        teams,
        rounds,
        addTeam,
        removeTeam,
        generate,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }

  return context
}

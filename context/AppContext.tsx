"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { generateRoundRobin, Round, Team } from "../lib/scheduler";

type AppContextValue = {
  championshipName: string;
  teams: Team[];
  rounds: Round[];
  isLoaded: boolean;
  addTeam: (name: string) => boolean;
  removeTeam: (teamId: string) => void;
  generateChampionship: () => void;
  getTeamById: (teamId: string) => Team | undefined;
};

const STORAGE_KEY = "championship-manager-state";
const DEFAULT_CHAMPIONSHIP_NAME = "Campeonato da Galera";

const AppContext = createContext<AppContextValue | undefined>(undefined);

function createTeam(name: string): Team {
  return {
    id: `${Date.now()}-${crypto.randomUUID()}`,
    name
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [championshipName] = useState(DEFAULT_CHAMPIONSHIP_NAME);
  const [teams, setTeams] = useState<Team[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const rawState = window.localStorage.getItem(STORAGE_KEY);

    if (rawState) {
      try {
        const parsedState = JSON.parse(rawState) as {
          teams?: Team[];
          rounds?: Round[];
        };

        setTeams(Array.isArray(parsedState.teams) ? parsedState.teams : []);
        setRounds(Array.isArray(parsedState.rounds) ? parsedState.rounds : []);
      } catch {
        setTeams([]);
        setRounds([]);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        teams,
        rounds
      })
    );
  }, [isLoaded, teams, rounds]);

  const addTeam = useCallback(
    (name: string) => {
      const normalizedName = name.trim();

      if (!normalizedName) {
        return false;
      }

      const alreadyExists = teams.some(
        (team) => team.name.toLowerCase() === normalizedName.toLowerCase()
      );

      if (alreadyExists) {
        return false;
      }

      setTeams((currentTeams) => [...currentTeams, createTeam(normalizedName)]);
      setRounds([]);
      return true;
    },
    [teams]
  );

  const removeTeam = useCallback((teamId: string) => {
    setTeams((currentTeams) => currentTeams.filter((team) => team.id !== teamId));
    setRounds([]);
  }, []);

  const generateChampionship = useCallback(() => {
    setRounds(generateRoundRobin(teams));
  }, [teams]);

  const getTeamById = useCallback(
    (teamId: string) => teams.find((team) => team.id === teamId),
    [teams]
  );

  const value = useMemo(
    () => ({
      championshipName,
      teams,
      rounds,
      isLoaded,
      addTeam,
      removeTeam,
      generateChampionship,
      getTeamById
    }),
    [
      championshipName,
      teams,
      rounds,
      isLoaded,
      addTeam,
      removeTeam,
      generateChampionship,
      getTeamById
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}

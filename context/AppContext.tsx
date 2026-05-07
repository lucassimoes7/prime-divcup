"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_CONFIG,
  Team,
  TournamentConfig,
  Round,
  adjustTeamsToCount,
  createDefaultTeams,
  generateSchedule,
  normalizeConfig,
} from "../lib/scheduler";

type AppContextType = {
  isLoaded: boolean;
  teams: Team[];
  config: TournamentConfig;
  rounds: Round[];
  warnings: string[];
  generatedAt?: string;
  totalMatches: number;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addTeam: (name?: string) => boolean;
  removeTeam: (id: string) => void;
  updateTeamName: (id: string, name: string) => void;
  getTeamById: (id: string) => Team | undefined;
  saveConfig: (config: TournamentConfig) => void;
  generate: () => void;
  generateWithConfig: (config: TournamentConfig) => void;
  clearRounds: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  config: "prime-divcup-config",
  teams: "prime-divcup-teams",
  rounds: "prime-divcup-rounds",
  warnings: "prime-divcup-warnings",
  generatedAt: "prime-divcup-generated-at",
  auth: "prime-divcup-auth",
};

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Prime@LucaseGuilherme";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [config, setConfig] = useState<TournamentConfig>(DEFAULT_CONFIG);
  const [teams, setTeams] = useState<Team[]>(createDefaultTeams(DEFAULT_CONFIG.teamCount));
  const [rounds, setRounds] = useState<Round[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string | undefined>();

  useEffect(() => {
    const savedConfig = readStorage<TournamentConfig>(STORAGE_KEYS.config);
    const normalizedConfig = normalizeConfig(savedConfig ?? DEFAULT_CONFIG);
    const savedTeams =
      readStorage<Team[]>(STORAGE_KEYS.teams) ?? readStorage<Team[]>("teams");
    const savedRounds = readStorage<Round[]>(STORAGE_KEYS.rounds);
    const savedWarnings = readStorage<string[]>(STORAGE_KEYS.warnings);
    const savedGeneratedAt = localStorage.getItem(STORAGE_KEYS.generatedAt) ?? undefined;
    const savedAuth = localStorage.getItem(STORAGE_KEYS.auth) === "admin";

    setConfig(normalizedConfig);
    setTeams(adjustTeamsToCount(savedTeams ?? [], normalizedConfig.teamCount));
    setRounds(Array.isArray(savedRounds) ? savedRounds : []);
    setWarnings(Array.isArray(savedWarnings) ? savedWarnings : []);
    setGeneratedAt(savedGeneratedAt);
    setIsAuthenticated(savedAuth);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
    }

    if (isAuthenticated && pathname === "/login") {
      router.replace("/");
    }
  }, [isAuthenticated, isLoaded, pathname, router]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
  }, [config, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.teams, JSON.stringify(teams));
  }, [isLoaded, teams]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.rounds, JSON.stringify(rounds));
  }, [isLoaded, rounds]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.warnings, JSON.stringify(warnings));
  }, [isLoaded, warnings]);

  useEffect(() => {
    if (!isLoaded) return;

    if (generatedAt) {
      localStorage.setItem(STORAGE_KEYS.generatedAt, generatedAt);
      return;
    }

    localStorage.removeItem(STORAGE_KEYS.generatedAt);
  }, [generatedAt, isLoaded]);

  const clearRounds = useCallback(() => {
    setRounds([]);
    setWarnings([]);
    setGeneratedAt(undefined);
  }, []);

  const login = useCallback((username: string, password: string) => {
    const isValid =
      username.trim().toLowerCase() === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD;

    if (!isValid) return false;

    localStorage.setItem(STORAGE_KEYS.auth, "admin");
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.auth);
    setIsAuthenticated(false);
    router.replace("/login");
  }, [router]);

  const addTeam = useCallback((name?: string) => {
    setTeams((currentTeams) => {
      const nextIndex = currentTeams.length + 1;
      const teamName = name?.trim() || `Time ${nextIndex}`;
      const nextTeams = [
        ...currentTeams,
        {
          id: `team-${Date.now()}-${nextIndex}`,
          name: teamName,
        },
      ];

      setConfig((currentConfig) =>
        normalizeConfig({
          ...currentConfig,
          teamCount: nextTeams.length,
        }),
      );
      setRounds([]);
      setWarnings([]);
      setGeneratedAt(undefined);
      return nextTeams;
    });

    return true;
  }, []);

  const removeTeam = useCallback((id: string) => {
    setTeams((currentTeams) => {
      const nextTeams = currentTeams.filter((team) => team.id !== id);
      const safeTeams = adjustTeamsToCount(nextTeams, Math.max(2, nextTeams.length));

      setConfig((currentConfig) =>
        normalizeConfig({
          ...currentConfig,
          teamCount: safeTeams.length,
        }),
      );
      setRounds([]);
      setWarnings([]);
      setGeneratedAt(undefined);
      return safeTeams;
    });
  }, []);

  const updateTeamName = useCallback((id: string, name: string) => {
    setTeams((currentTeams) =>
      currentTeams.map((team) =>
        team.id === id
          ? {
              ...team,
              name,
            }
          : team,
      ),
    );
  }, []);

  const getTeamById = useCallback(
    (id: string) => teams.find((team) => team.id === id),
    [teams],
  );

  const saveConfig = useCallback((nextConfig: TournamentConfig) => {
    const normalizedConfig = normalizeConfig(nextConfig);

    setConfig(normalizedConfig);
    setTeams((currentTeams) => adjustTeamsToCount(currentTeams, normalizedConfig.teamCount));
    setRounds([]);
    setWarnings([]);
    setGeneratedAt(undefined);
  }, []);

  const generate = useCallback(() => {
    const result = generateSchedule(teams, config);

    setRounds(result.rounds);
    setWarnings(result.warnings);
    setGeneratedAt(new Date().toISOString());
  }, [config, teams]);

  const generateWithConfig = useCallback(
    (nextConfig: TournamentConfig) => {
      const normalizedConfig = normalizeConfig(nextConfig);
      const nextTeams = adjustTeamsToCount(teams, normalizedConfig.teamCount);
      const result = generateSchedule(nextTeams, normalizedConfig);

      setConfig(normalizedConfig);
      setTeams(nextTeams);
      setRounds(result.rounds);
      setWarnings(result.warnings);
      setGeneratedAt(new Date().toISOString());
    },
    [teams],
  );

  const totalMatches = useMemo(
    () => rounds.reduce((total, round) => total + round.matches.length, 0),
    [rounds],
  );

  const value = useMemo(
    () => ({
      isLoaded,
      teams,
      config,
      rounds,
      warnings,
      generatedAt,
      totalMatches,
      isAuthenticated,
      login,
      logout,
      addTeam,
      removeTeam,
      updateTeamName,
      getTeamById,
      saveConfig,
      generate,
      generateWithConfig,
      clearRounds,
    }),
    [
      addTeam,
      clearRounds,
      config,
      generate,
      generateWithConfig,
      generatedAt,
      getTeamById,
      isAuthenticated,
      isLoaded,
      login,
      logout,
      removeTeam,
      rounds,
      saveConfig,
      teams,
      totalMatches,
      updateTeamName,
      warnings,
    ],
  );

  const shouldBlockProtectedPage =
    !isLoaded || (!isAuthenticated && pathname !== "/login");

  return (
    <AppContext.Provider value={value}>
      {shouldBlockProtectedPage ? (
        <main className="app-shell">
          <section className="card panel">
            <p className="page-eyebrow">Prime DivCup</p>
            <h1 className="page-title">Carregando acesso</h1>
          </section>
        </main>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}

function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export type Team = {
  id: string;
  name: string;
};

export type TournamentConfig = {
  teamCount: number;
  gamesPerTeam: number;
  matchesPerRound: number;
  maxConsecutiveByes: number;
  allowRematches: boolean;
};

export type Match = {
  id: string;
  roundNumber: number;
  slot: number;
  homeTeamId: string;
  awayTeamId: string;
};

export type Round = {
  id: string;
  number: number;
  matches: Match[];
  byeTeamIds: string[];
};

export type TeamScheduleItem = {
  roundNumber: number;
  status: "play" | "bye";
  opponentTeamId?: string;
  slot?: number;
};

export type ScheduleResult = {
  rounds: Round[];
  warnings: string[];
};

export const DEFAULT_CONFIG: TournamentConfig = {
  teamCount: 8,
  gamesPerTeam: 4,
  matchesPerRound: 2,
  maxConsecutiveByes: 2,
  allowRematches: false,
};

type AttemptResult = ScheduleResult & {
  score: number;
  missingGames: number;
  byeViolations: number;
};

function clampInt(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

export function normalizeConfig(config: Partial<TournamentConfig>): TournamentConfig {
  const merged = { ...DEFAULT_CONFIG, ...config };

  return {
    teamCount: clampInt(merged.teamCount, 2, 64),
    gamesPerTeam: clampInt(merged.gamesPerTeam, 1, 63),
    matchesPerRound: clampInt(merged.matchesPerRound, 1, 32),
    maxConsecutiveByes: clampInt(merged.maxConsecutiveByes, 1, 32),
    allowRematches: Boolean(merged.allowRematches),
  };
}

export function createDefaultTeams(count: number): Team[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `team-${index + 1}`,
    name: `Time ${index + 1}`,
  }));
}

export function adjustTeamsToCount(teams: Team[], count: number): Team[] {
  const safeCount = clampInt(count, 2, 64);
  const usedIds = new Set<string>();
  const adjusted = teams.slice(0, safeCount).map((team, index) => {
    const fallbackId = `team-${index + 1}`;
    let id = team.id && !usedIds.has(team.id) ? team.id : fallbackId;

    if (usedIds.has(id)) {
      id = uniqueTeamId(index + 1, usedIds);
    } else {
      usedIds.add(id);
    }

    return {
      id,
      name: team.name?.trim() || `Time ${index + 1}`,
    };
  });

  while (adjusted.length < safeCount) {
    const nextIndex = adjusted.length + 1;
    adjusted.push({
      id: uniqueTeamId(nextIndex, usedIds),
      name: `Time ${nextIndex}`,
    });
  }

  return adjusted;
}

export function generateSchedule(
  teamsInput: Team[],
  rawConfig: TournamentConfig,
): ScheduleResult {
  const teams = teamsInput.filter((team) => team.name.trim().length > 0);
  const config = normalizeConfig(rawConfig);
  const warnings = validateConfig(teams, config);

  if (teams.length < 2) {
    return {
      rounds: [],
      warnings: ["Cadastre pelo menos 2 times para gerar confrontos."],
    };
  }

  const attempts = Math.min(900, Math.max(220, teams.length * config.gamesPerTeam * 12));
  let best: AttemptResult | null = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const result = runAttempt(teams, config, warnings);

    if (!best || result.score < best.score) {
      best = result;
    }

    if (best.missingGames === 0 && best.byeViolations === 0) break;
  }

  return best ?? { rounds: [], warnings };
}

export function getTeamSchedule(rounds: Round[], teamId: string): TeamScheduleItem[] {
  return rounds.map((round) => {
    const match = round.matches.find(
      (item) => item.homeTeamId === teamId || item.awayTeamId === teamId,
    );

    if (!match) {
      return {
        roundNumber: round.number,
        status: "bye",
      };
    }

    return {
      roundNumber: round.number,
      status: "play",
      opponentTeamId:
        match.homeTeamId === teamId ? match.awayTeamId : match.homeTeamId,
      slot: match.slot,
    };
  });
}

export function getTeamStats(rounds: Round[], teamId: string) {
  const schedule = getTeamSchedule(rounds, teamId);
  const games = schedule.filter((item) => item.status === "play").length;
  const byes = schedule.filter((item) => item.status === "bye").length;
  let maxByeSequence = 0;
  let currentByeSequence = 0;

  schedule.forEach((item) => {
    if (item.status === "bye") {
      currentByeSequence += 1;
      maxByeSequence = Math.max(maxByeSequence, currentByeSequence);
      return;
    }

    currentByeSequence = 0;
  });

  return {
    games,
    byes,
    maxByeSequence,
  };
}

export function formatTeamList(teamIds: string[], teams: Team[]) {
  return teamIds
    .map((teamId) => teams.find((team) => team.id === teamId)?.name)
    .filter(Boolean)
    .join(", ");
}

function runAttempt(
  teams: Team[],
  config: TournamentConfig,
  baseWarnings: string[],
): AttemptResult {
  const matchesPerRound = Math.min(config.matchesPerRound, Math.floor(teams.length / 2));
  const gamesPlayed = createCounter(teams);
  const byeStreak = createCounter(teams);
  const pairCounts: Record<string, number> = {};
  const rounds: Round[] = [];
  let byeViolations = 0;
  const maxRounds =
    Math.ceil((teams.length * config.gamesPerTeam) / 2 / matchesPerRound) +
    teams.length * config.gamesPerTeam +
    12;

  while (rounds.length < maxRounds && hasPendingGames(teams, gamesPlayed, config.gamesPerTeam)) {
    const roundNumber = rounds.length + 1;
    const used = new Set<string>();
    const matches: Match[] = [];

    for (let slot = 1; slot <= matchesPerRound; slot += 1) {
      const candidate = choosePair(teams, config, gamesPlayed, byeStreak, pairCounts, used);

      if (!candidate) break;

      const [homeTeamId, awayTeamId] = candidate;
      used.add(homeTeamId);
      used.add(awayTeamId);

      matches.push({
        id: `round-${roundNumber}-match-${slot}`,
        roundNumber,
        slot,
        homeTeamId,
        awayTeamId,
      });
    }

    if (matches.length === 0) break;

    const byeTeamIds = teams
      .filter((team) => !used.has(team.id))
      .map((team) => team.id);

    matches.forEach((match) => {
      gamesPlayed[match.homeTeamId] += 1;
      gamesPlayed[match.awayTeamId] += 1;
      byeStreak[match.homeTeamId] = 0;
      byeStreak[match.awayTeamId] = 0;

      const pairKey = getPairKey(match.homeTeamId, match.awayTeamId);
      pairCounts[pairKey] = (pairCounts[pairKey] ?? 0) + 1;
    });

    byeTeamIds.forEach((teamId) => {
      byeStreak[teamId] += 1;
      if (
        byeStreak[teamId] > config.maxConsecutiveByes &&
        gamesPlayed[teamId] < config.gamesPerTeam
      ) {
        byeViolations += 1;
      }
    });

    rounds.push({
      id: `round-${roundNumber}`,
      number: roundNumber,
      matches,
      byeTeamIds,
    });
  }

  const missingGames = teams.reduce(
    (total, team) => total + Math.max(0, config.gamesPerTeam - gamesPlayed[team.id]),
    0,
  );
  const repeatedPairs = Object.values(pairCounts).reduce(
    (total, count) => total + Math.max(0, count - 1),
    0,
  );
  const warnings = [...baseWarnings];

  if (missingGames > 0) {
    warnings.push(
      `${missingGames} jogo(s) por time ficaram pendentes por causa das regras escolhidas.`,
    );
  }

  if (byeViolations > 0) {
    warnings.push(
      "Algumas folgas consecutivas passaram do limite. Aumente os jogos por rodada ou permita mais folgas.",
    );
  }

  return {
    rounds,
    warnings: uniqueStrings(warnings),
    missingGames,
    byeViolations,
    score: missingGames * 10000 + byeViolations * 900 + repeatedPairs * 40 + rounds.length,
  };
}

function choosePair(
  teams: Team[],
  config: TournamentConfig,
  gamesPlayed: Record<string, number>,
  byeStreak: Record<string, number>,
  pairCounts: Record<string, number>,
  used: Set<string>,
) {
  const candidates: Array<{ pair: [string, string]; score: number }> = [];

  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      const teamA = teams[i];
      const teamB = teams[j];

      if (used.has(teamA.id) || used.has(teamB.id)) continue;
      if (gamesPlayed[teamA.id] >= config.gamesPerTeam) continue;
      if (gamesPlayed[teamB.id] >= config.gamesPerTeam) continue;

      const pairKey = getPairKey(teamA.id, teamB.id);
      const previousMeetings = pairCounts[pairKey] ?? 0;

      if (!config.allowRematches && previousMeetings > 0) continue;

      const needA = config.gamesPerTeam - gamesPlayed[teamA.id];
      const needB = config.gamesPerTeam - gamesPlayed[teamB.id];
      const mustPlayA = byeStreak[teamA.id] >= config.maxConsecutiveByes ? 1 : 0;
      const mustPlayB = byeStreak[teamB.id] >= config.maxConsecutiveByes ? 1 : 0;
      const pressure = byeStreak[teamA.id] + byeStreak[teamB.id];
      const rematchPenalty = previousMeetings * (config.allowRematches ? 28 : 500);
      const score =
        (mustPlayA + mustPlayB) * 180 +
        (needA + needB) * 24 +
        pressure * 14 -
        Math.abs(needA - needB) * 4 -
        rematchPenalty +
        Math.random() * 12;

      candidates.push({
        pair: Math.random() > 0.5 ? [teamA.id, teamB.id] : [teamB.id, teamA.id],
        score,
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.pair;
}

function validateConfig(teams: Team[], config: TournamentConfig) {
  const warnings: string[] = [];
  const maxUniqueOpponents = Math.max(0, teams.length - 1);

  if (!config.allowRematches && config.gamesPerTeam > maxUniqueOpponents) {
    warnings.push(
      "Sem repeticao de confronto, cada time so consegue jogar contra os adversarios disponiveis uma vez.",
    );
  }

  if ((teams.length * config.gamesPerTeam) % 2 !== 0) {
    warnings.push(
      "A quantidade total de participacoes em jogos e impar. Um time pode terminar com um jogo a menos.",
    );
  }

  if (config.matchesPerRound > Math.floor(teams.length / 2)) {
    warnings.push(
      "Jogos por rodada foi limitado pela quantidade de times disponiveis.",
    );
  }

  return warnings;
}

function createCounter(teams: Team[]) {
  return teams.reduce<Record<string, number>>((counter, team) => {
    counter[team.id] = 0;
    return counter;
  }, {});
}

function hasPendingGames(
  teams: Team[],
  gamesPlayed: Record<string, number>,
  gamesPerTeam: number,
) {
  return teams.some((team) => gamesPlayed[team.id] < gamesPerTeam);
}

function getPairKey(a: string, b: string) {
  return [a, b].sort().join("__");
}

function uniqueTeamId(index: number, usedIds: Set<string>) {
  let id = `team-${index}`;
  let attempt = index;

  while (usedIds.has(id)) {
    attempt += 1;
    id = `team-${attempt}`;
  }

  usedIds.add(id);
  return id;
}

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items));
}

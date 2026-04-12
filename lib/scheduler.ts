export type Team = {
  id: string;
  name: string;
};

export type Match = {
  home: Team;
  away: Team;
};

export type Round = {
  id: string;
  number: number;
  matches: Match[];
  byes: Team[];
};

const byeTeam: Team = {
  id: "__bye__",
  name: "Folga"
};

export function generateRoundRobin(teams: Team[]): Round[] {
  if (teams.length < 2) {
    return [];
  }

  const participants = [...teams];

  if (participants.length % 2 !== 0) {
    participants.push(byeTeam);
  }

  const totalRounds = participants.length - 1;
  const matchesPerRound = participants.length / 2;
  let rotation = [...participants];
  const rounds: Round[] = [];

  for (let roundIndex = 0; roundIndex < totalRounds; roundIndex += 1) {
    const matches: Match[] = [];
    const byes: Team[] = [];

    for (let matchIndex = 0; matchIndex < matchesPerRound; matchIndex += 1) {
      const first = rotation[matchIndex];
      const second = rotation[rotation.length - 1 - matchIndex];

      if (first.id === byeTeam.id && second.id !== byeTeam.id) {
        byes.push(second);
        continue;
      }

      if (second.id === byeTeam.id && first.id !== byeTeam.id) {
        byes.push(first);
        continue;
      }

      if (first.id !== byeTeam.id && second.id !== byeTeam.id) {
        const shouldSwapHome = roundIndex % 2 === 1;
        matches.push({
          home: shouldSwapHome ? second : first,
          away: shouldSwapHome ? first : second
        });
      }
    }

    rounds.push({
      id: `round-${roundIndex + 1}`,
      number: roundIndex + 1,
      matches,
      byes
    });

    rotation = [
      rotation[0],
      rotation[rotation.length - 1],
      ...rotation.slice(1, rotation.length - 1)
    ];
  }

  return rounds;
}

export function getTeamSchedule(teamId: string, rounds: Round[]) {
  return rounds
    .map((round) => {
      const match = round.matches.find(
        (item) => item.home.id === teamId || item.away.id === teamId
      );
      const hasBye = round.byes.some((team) => team.id === teamId);

      if (match) {
        const opponent = match.home.id === teamId ? match.away : match.home;

        return {
          roundNumber: round.number,
          opponent,
          isBye: false
        };
      }

      if (hasBye) {
        return {
          roundNumber: round.number,
          opponent: null,
          isBye: true
        };
      }

      return null;
    })
    .filter((item): item is {
      roundNumber: number;
      opponent: Team | null;
      isBye: boolean;
    } => item !== null);
}

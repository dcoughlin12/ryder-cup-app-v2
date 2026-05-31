import type {
  TournamentData,
  TeamScore,
  PlayerStat,
  PlayerCardData,
  PlayerMatchEntry,
  MatchResult,
  AltShotBestBallMatch,
  ScrambleMatch,
  IndividualMatch,
} from '../types';

function resultPts(result: MatchResult, multiplier = 1): TeamScore {
  if (!result) return { east: 0, west: 0 };
  if (result === 'east') return { east: multiplier, west: 0 };
  if (result === 'west') return { east: 0, west: multiplier };
  return { east: multiplier / 2, west: multiplier / 2 };
}

function addScores(a: TeamScore, b: TeamScore): TeamScore {
  return { east: a.east + b.east, west: a.west + b.west };
}

export function calcAltShotBestBallMatch(match: AltShotBestBallMatch): TeamScore {
  return addScores(
    resultPts(match.altShot.result, 1),
    resultPts(match.bestBall.result, 1)
  );
}

export function calcScrambleMatch(match: ScrambleMatch): TeamScore {
  return addScores(
    addScores(resultPts(match.front9.result, 0.5), resultPts(match.back9.result, 0.5)),
    resultPts(match.overall.result, 1)
  );
}

export function calcIndividualMatch(match: IndividualMatch): TeamScore {
  return resultPts(match.result, 2);
}

export function calcRoundScore(round: TournamentData['rounds'][number]): TeamScore {
  let total: TeamScore = { east: 0, west: 0 };
  if (round.format === 'alt_shot_best_ball') {
    for (const m of round.matches)
      total = addScores(total, calcAltShotBestBallMatch(m as AltShotBestBallMatch));
  } else if (round.format === 'scramble') {
    for (const m of round.matches)
      total = addScores(total, calcScrambleMatch(m as ScrambleMatch));
  } else if (round.format === 'individual') {
    for (const m of round.matches)
      total = addScores(total, calcIndividualMatch(m as IndividualMatch));
  }
  return total;
}

export function calcTotalScore(data: TournamentData): TeamScore {
  return data.rounds.reduce(
    (total, round) => addScores(total, calcRoundScore(round)),
    { east: 0, west: 0 }
  );
}

export function calcPlayerStats(data: TournamentData): PlayerStat[] {
  const statsMap = new Map<string, PlayerStat>();

  // Seed all players from the canonical teams object (display names as keys)
  for (const name of Object.values(data.teams.east.players))
    statsMap.set(name, { name, team: 'east', points: 0, played: 0 });
  for (const name of Object.values(data.teams.west.players))
    statsMap.set(name, { name, team: 'west', points: 0, played: 0 });

  for (const round of data.rounds) {
    if (round.format === 'alt_shot_best_ball') {
      for (const m of round.matches as AltShotBestBallMatch[]) {
        const pts = calcAltShotBestBallMatch(m);
        const played = m.altShot.result !== null || m.bestBall.result !== null ? 1 : 0;
        for (const name of m.east) {
          const s = statsMap.get(name);
          if (s) { s.points += pts.east; s.played += played; }
        }
        for (const name of m.west) {
          const s = statsMap.get(name);
          if (s) { s.points += pts.west; s.played += played; }
        }
      }
    } else if (round.format === 'scramble') {
      for (const m of round.matches as ScrambleMatch[]) {
        const pts = calcScrambleMatch(m);
        const played = m.front9.result !== null || m.back9.result !== null || m.overall.result !== null ? 1 : 0;
        for (const name of m.east) {
          const s = statsMap.get(name);
          if (s) { s.points += pts.east; s.played += played; }
        }
        for (const name of m.west) {
          const s = statsMap.get(name);
          if (s) { s.points += pts.west; s.played += played; }
        }
      }
    } else if (round.format === 'individual') {
      for (const m of round.matches as IndividualMatch[]) {
        if (m.east === null || m.west === null) continue;
        const pts = calcIndividualMatch(m);
        const played = m.result !== null ? 1 : 0;
        const se = statsMap.get(m.east);
        if (se) { se.points += pts.east; se.played += played; }
        const sw = statsMap.get(m.west);
        if (sw) { sw.points += pts.west; sw.played += played; }
      }
    }
  }

  return Array.from(statsMap.values()).sort((a, b) => b.points - a.points);
}

export function formatPts(n: number): string {
  if (n % 1 === 0) return n.toString();
  if (n % 0.5 === 0) return n.toFixed(1);
  return n.toFixed(2);
}

export const TOTAL_POINTS_AVAILABLE = 40;
export const POINTS_TO_WIN = 20.5;

export function buildPlayerCards(data: TournamentData): PlayerCardData[] {
  const stats = calcPlayerStats(data);
  const statsMap = new Map(stats.map((s) => [s.name, s]));

  const allPlayers: Array<{ name: string; team: 'east' | 'west' }> = [
    ...Object.values(data.teams.east.players).map((name) => ({ name, team: 'east' as const })),
    ...Object.values(data.teams.west.players).map((name) => ({ name, team: 'west' as const })),
  ];

  return allPlayers.map(({ name, team }) => {
    const matches: PlayerMatchEntry[] = [];

    data.rounds.forEach((round, ri) => {
      const roundName = round.name.split(' —')[0].trim();

      if (round.format === 'alt_shot_best_ball') {
        for (const m of round.matches as AltShotBestBallMatch[]) {
          const inEast = m.east.includes(name);
          const inWest = m.west.includes(name);
          if (!inEast && !inWest) continue;
          const own = inEast ? m.east : m.west;
          const opp = inEast ? m.west : m.east;
          matches.push({
            roundNumber: ri + 1,
            roundName,
            format: round.format,
            partners: own.filter((n) => n !== name),
            opponents: opp,
            subResults: [
              { label: 'Alt Shot', result: m.altShot.result, winPts: 1 },
              { label: 'Best Ball', result: m.bestBall.result, winPts: 1 },
            ],
          });
        }
      } else if (round.format === 'scramble') {
        for (const m of round.matches as ScrambleMatch[]) {
          const inEast = m.east.includes(name);
          const inWest = m.west.includes(name);
          if (!inEast && !inWest) continue;
          const own = inEast ? m.east : m.west;
          const opp = inEast ? m.west : m.east;
          matches.push({
            roundNumber: ri + 1,
            roundName,
            format: round.format,
            partners: own.filter((n) => n !== name),
            opponents: opp,
            subResults: [
              { label: 'Front 9', result: m.front9.result, winPts: 0.5 },
              { label: 'Back 9', result: m.back9.result, winPts: 0.5 },
              { label: 'Overall', result: m.overall.result, winPts: 1 },
            ],
          });
        }
      } else if (round.format === 'individual') {
        for (const m of round.matches as IndividualMatch[]) {
          if (m.east === null || m.west === null) continue;
          const isEast = m.east === name;
          const isWest = m.west === name;
          if (!isEast && !isWest) continue;
          const opponent = isEast ? m.west : m.east;
          matches.push({
            roundNumber: ri + 1,
            roundName,
            format: round.format,
            partners: [],
            opponents: [opponent],
            subResults: [{ label: 'Match', result: m.result, winPts: 2 }],
          });
        }
      }
    });

    return {
      name,
      team,
      points: statsMap.get(name)?.points ?? 0,
      matches,
    };
  });
}

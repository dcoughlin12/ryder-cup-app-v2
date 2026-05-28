export type MatchResult = "east" | "west" | "halved" | null;

export interface AltShotBestBallMatch {
  id: string;
  teeTime: string;
  east: string[];
  west: string[];
  altShot: { result: MatchResult };
  bestBall: { result: MatchResult };
}

export interface ScrambleMatch {
  id: string;
  teeTime: string;
  east: string[];
  west: string[];
  front9: { result: MatchResult };
  back9: { result: MatchResult };
  overall: { result: MatchResult };
}

export interface IndividualMatch {
  id: string;
  teeTime: string;
  east: string | null;
  west: string | null;
  result: MatchResult;
}

export type RoundMatch = AltShotBestBallMatch | ScrambleMatch | IndividualMatch;

export interface Round {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  startTime: string;
  course: string;
  format: "alt_shot_best_ball" | "scramble" | "individual";
  pointsNote: string;
  address?: string;
  mapsUrl?: string;
  mapsEmbed?: string;
  matches: RoundMatch[];
}

export interface BusStop {
  time: string;
  from: string;
  to: string;
}

export interface BusSchedule {
  bookingId: string;
  date: string;
  size: string;
  arrivalNote: string;
  stops: BusStop[];
}

export interface TeamData {
  name: string;
  players: Record<string, string>;
  hotel?: { name: string; mapsEmbed: string };
  bus?: BusSchedule;
}

export interface Teams {
  east: TeamData;
  west: TeamData;
}

export interface TournamentData {
  tournament: {
    name: string;
    dates: string;
    status?: "upcoming" | "in_progress" | "complete";
    note?: string;
  };
  teams: Teams;
  rounds: Round[];
}

export interface TeamScore {
  east: number;
  west: number;
}

export interface MatchSubResult {
  label: string;
  result: MatchResult;
  winPts: number;
}

export interface PlayerMatchEntry {
  roundNumber: number;
  roundName: string;
  format: Round["format"];
  partners: string[];
  opponents: string[];
  subResults: MatchSubResult[];
}

export interface PlayerCardData {
  name: string;
  team: "east" | "west";
  points: number;
  matches: PlayerMatchEntry[];
}

export interface PlayerStat {
  name: string;
  team: "east" | "west";
  points: number;
  played: number;
}

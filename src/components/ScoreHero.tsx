import {
  formatPts,
  POINTS_TO_WIN,
  TOTAL_POINTS_AVAILABLE,
} from "../utils/scoring";
import type { TeamScore } from "../types";

interface Props {
  score: TeamScore;
  status: string;
}

export default function ScoreHero({ score, status }: Props) {
  const total = score.east + score.west;
  const eastPct = total > 0 ? (score.east / TOTAL_POINTS_AVAILABLE) * 100 : 50;
  const westPct = total > 0 ? (score.west / TOTAL_POINTS_AVAILABLE) * 100 : 50;

  const eastLeads = score.east > score.west;
  const westLeads = score.west > score.east;
  const eastWon = score.east >= POINTS_TO_WIN;
  const westWon = score.west >= POINTS_TO_WIN;

  const statusLabel =
    status === "upcoming"
      ? "Tournament Upcoming"
      : status === "in_progress"
        ? "In Progress"
        : "Final Score";

  return (
    <section className="bg-navy-900 border-b border-gold/20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Score display */}
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {/* Team East */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2 ${
                eastWon
                  ? "bg-east border-east shadow-lg shadow-east/40"
                  : "bg-east/20 border-east"
              }`}
            >
              <span className="font-serif text-xs md:text-sm font-bold text-white tracking-wide text-center leading-tight px-1">
                TEAM
                <br />
                EAST
              </span>
            </div>
            <span
              className={`font-serif text-5xl md:text-7xl font-bold tabular-nums ${
                eastWon
                  ? "text-east-light"
                  : eastLeads
                    ? "text-white"
                    : "text-slate-400"
              }`}
            >
              {formatPts(score.east)}
            </span>
            {eastWon && (
              <span className="text-xs text-east-light font-semibold tracking-wider uppercase">
                Winners!
              </span>
            )}
          </div>

          {/* VS divider */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <span className="text-gold font-serif text-lg font-bold">vs</span>
            <div className="w-px h-16 bg-gold/30" />
            <span className="text-slate-500 text-xs">
              {formatPts(POINTS_TO_WIN)} to win
            </span>
          </div>

          {/* Team West */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2 ${
                westWon
                  ? "bg-west border-west shadow-lg shadow-west/40"
                  : "bg-west/20 border-west"
              }`}
            >
              <span className="font-serif text-xs md:text-sm font-bold text-white tracking-wide text-center leading-tight px-1">
                TEAM
                <br />
                WEST
              </span>
            </div>
            <span
              className={`font-serif text-5xl md:text-7xl font-bold tabular-nums ${
                westWon
                  ? "text-west-light"
                  : westLeads
                    ? "text-white"
                    : "text-slate-400"
              }`}
            >
              {formatPts(score.west)}
            </span>
            {westWon && (
              <span className="text-xs text-west-light font-semibold tracking-wider uppercase">
                Winners!
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 space-y-1">
          <div className="relative h-3 rounded-full overflow-hidden bg-slate-800">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-east-dark to-east transition-all duration-700 ease-out"
              style={{ width: `${eastPct}%` }}
            />
            <div
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-west-dark to-west transition-all duration-700 ease-out"
              style={{ width: `${westPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>East {formatPts(score.east)} pts</span>
            <span className="text-slate-600">
              of {TOTAL_POINTS_AVAILABLE} available
            </span>
            <span>{formatPts(score.west)} pts West</span>
          </div>
        </div>
      </div>
    </section>
  );
}

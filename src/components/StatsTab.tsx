import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TournamentData, PlayerStat, PlayerCardData } from "../types";
import { calcPlayerStats, buildPlayerCards, formatPts } from "../utils/scoring";
import { PlayerResultPill } from "./ResultBadge";

function PointsBar({ stat, max }: { stat: PlayerStat; max: number }) {
  const pct = max > 0 ? (stat.points / max) * 100 : 0;
  const isEast = stat.team === "east";

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-20 shrink-0 text-right">
        <span
          className={`text-sm font-medium ${
            isEast ? "text-east-light" : "text-west-light"
          }`}
        >
          {stat.name}
        </span>
      </div>
      <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2 ${
            isEast
              ? "bg-gradient-to-r from-east-dark to-east"
              : "bg-gradient-to-r from-west-dark to-west"
          }`}
          style={{ width: `${Math.max(pct, stat.points > 0 ? 8 : 0)}%` }}
        >
          {stat.points > 0 && (
            <span className="text-white text-xs font-bold">
              {formatPts(stat.points)}
            </span>
          )}
        </div>
      </div>
      {stat.points === 0 && (
        <span className="text-slate-600 text-xs w-6">0</span>
      )}
    </div>
  );
}

function PlayerCard({ card }: { card: PlayerCardData }) {
  const [open, setOpen] = useState(false);
  const isEast = card.team === "east";

  return (
    <div className="border border-slate-700/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 hover:bg-slate-800/80 transition-colors"
      >
        <span
          className={`font-medium text-sm ${isEast ? "text-east-light" : "text-west-light"}`}
        >
          {card.name}
        </span>
        <div className="flex items-center gap-3">
          <span
            className={`font-bold text-sm tabular-nums ${
              isEast ? "text-east-light" : "text-west-light"
            }`}
          >
            {formatPts(card.points)} pts
          </span>
          <ChevronDown
            size={16}
            className={`text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="bg-slate-950 divide-y divide-slate-800/60">
          {card.matches.length === 0 ? (
            <p className="px-4 py-3 text-slate-600 text-xs italic">
              No matches assigned yet
            </p>
          ) : (
            card.matches.map((match, i) => (
              <div key={i} className="px-4 py-3">
                <div className="mb-2">
                  <p className="text-gold text-xs font-semibold">
                    Round {match.roundNumber} · {match.roundName}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {match.partners.length > 0 && (
                      <span>with {match.partners.join(" & ")} · </span>
                    )}
                    vs {match.opponents.join(" / ")}
                  </p>
                </div>
                <div className="space-y-1.5">
                  {match.subResults.map((sub) => (
                    <div
                      key={sub.label}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-slate-500 text-xs shrink-0">
                        {sub.label}
                      </span>
                      <PlayerResultPill
                        result={sub.result}
                        winPts={sub.winPts}
                        team={card.team}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function PlayerRecordsSection({
  playerCards,
}: {
  playerCards: PlayerCardData[];
}) {
  const [team, setTeam] = useState<"east" | "west">("east");
  const visible = playerCards.filter((c) => c.team === team);

  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/40 flex items-center justify-between gap-3">
        <h3 className="text-gold font-serif font-bold text-base">
          Player Records
        </h3>
        <div className="flex rounded-lg overflow-hidden border border-slate-700 shrink-0">
          <button
            onClick={() => setTeam("east")}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
              team === "east"
                ? "bg-east text-white"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Team East
          </button>
          <button
            onClick={() => setTeam("west")}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors border-l border-slate-700 ${
              team === "west"
                ? "bg-west text-white"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Team West
          </button>
        </div>
      </div>
      <div className="p-3 space-y-2">
        {visible.map((card) => (
          <PlayerCard key={card.name} card={card} />
        ))}
      </div>
    </div>
  );
}

interface Props {
  data: TournamentData;
}

export default function StatsTab({ data }: Props) {
  const stats = calcPlayerStats(data);
  const playerCards = buildPlayerCards(data);
  const played = stats.filter((s) => s.played > 0);
  const maxPoints =
    played.length > 0 ? Math.max(...played.map((s) => s.points)) : 1;
  const eastPlayers = stats.filter((s) => s.team === "east");
  const westPlayers = stats.filter((s) => s.team === "west");

  const eastTotal = eastPlayers.reduce((sum, s) => sum + s.points, 0);
  const westTotal = westPlayers.reduce((sum, s) => sum + s.points, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Team summary cards */}
      {/* <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-east/30 rounded-2xl p-4 text-center">
          <p className="text-east-light text-xs font-semibold uppercase tracking-widest mb-1">
            Team East
          </p>
          <p className="font-serif text-4xl font-bold text-white">{formatPts(eastTotal)}</p>
          <p className="text-slate-500 text-xs mt-1">total points</p>
        </div>
        <div className="bg-slate-900 border border-west/30 rounded-2xl p-4 text-center">
          <p className="text-west-light text-xs font-semibold uppercase tracking-widest mb-1">
            Team West
          </p>
          <p className="font-serif text-4xl font-bold text-white">{formatPts(westTotal)}</p>
          <p className="text-slate-500 text-xs mt-1">total points</p>
        </div>
      </div> */}

      {/* Points leaders chart */}
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-4">
        <h3 className="text-gold font-serif text-base font-bold mb-4 flex items-center gap-2">
          <span>Points Leaders</span>
        </h3>
        {played.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">
            No results yet. Check back during the tournament.
          </p>
        ) : (
          <div className="space-y-0.5">
            {stats
              .filter((s) => s.points > 0)
              .map((stat) => (
                <PointsBar key={stat.name} stat={stat} max={maxPoints} />
              ))}
          </div>
        )}
        <p className="text-slate-600 text-xs italic text-center mt-3 pt-3 border-t border-slate-800">
          Not on the list? You suck.
        </p>
      </div>

      {/* Player records */}
      <PlayerRecordsSection playerCards={playerCards} />

      {/* Team East roster */}
      {/* <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 bg-east/10 border-b border-east/20">
          <h3 className="text-east-light font-serif font-bold text-sm uppercase tracking-wider">
            Team East — Roster &amp; Points
          </h3>
        </div>
        <div className="divide-y divide-slate-800">
          {eastPlayers.map((s, i) => (
            <div key={s.name} className="flex items-center px-4 py-2.5">
              <span className="text-slate-600 text-xs w-5 shrink-0">
                {i + 1}.
              </span>
              <span className="flex-1 text-white text-sm font-medium">
                {s.name}
              </span>
              <span className="text-east-light font-bold text-sm tabular-nums">
                {formatPts(s.points)}
              </span>
              <span className="text-slate-600 text-xs ml-2 w-12 text-right">
                {s.played} {s.played === 1 ? "match" : "matches"}
              </span>
            </div>
          ))}
        </div>
      </div> */}

      {/* Team West roster */}
      {/* <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 bg-west/10 border-b border-west/20">
          <h3 className="text-west-light font-serif font-bold text-sm uppercase tracking-wider">
            Team West — Roster &amp; Points
          </h3>
        </div>
        <div className="divide-y divide-slate-800">
          {westPlayers.map((s, i) => (
            <div key={s.name} className="flex items-center px-4 py-2.5">
              <span className="text-slate-600 text-xs w-5 shrink-0">
                {i + 1}.
              </span>
              <span className="flex-1 text-white text-sm font-medium">
                {s.name}
              </span>
              <span className="text-west-light font-bold text-sm tabular-nums">
                {formatPts(s.points)}
              </span>
              <span className="text-slate-600 text-xs ml-2 w-12 text-right">
                {s.played} {s.played === 1 ? "match" : "matches"}
              </span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

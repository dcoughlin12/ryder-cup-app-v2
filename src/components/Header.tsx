import { useState } from "react";
import { useScrollLock } from "../utils/useScrollLock";
import {
  Trophy,
  CalendarDays,
  X,
  MapPin,
  Clock,
  ChevronRight,
  Navigation,
  Bus,
  BookOpen,
  Target,
  Info,
} from "lucide-react";
import type { TournamentData } from "../types";

function ItineraryModal({
  data,
  onClose,
}: {
  data: TournamentData;
  onClose: () => void;
}) {
  // Group rounds by date
  const byDate = data.rounds.reduce<Record<string, typeof data.rounds>>(
    (acc, round) => {
      (acc[round.date] ??= []).push(round);
      return acc;
    },
    {},
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Sheet / Modal */}
      <div
        className="relative z-10 w-full sm:max-w-lg bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-slate-700/60 overflow-hidden max-h-[95dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40 shrink-0">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-gold" />
            <h2 className="text-white font-serif font-bold text-lg">
              Weekend Itinerary
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-6">
          {Object.entries(byDate).map(([date, rounds]) => (
            <div key={date}>
              <h3 className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">
                {date}
              </h3>
              <div className="space-y-4">
                {rounds.map((round) => (
                  <div
                    key={round.id}
                    className="bg-slate-800/60 rounded-xl border border-slate-700/40 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-700/30">
                      <p className="text-white font-semibold text-sm">
                        {round.course}
                      </p>
                      <p className="text-gold text-xs mt-0.5">
                        {round.subtitle}
                      </p>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <Clock
                          size={13}
                          className="text-slate-500 mt-0.5 shrink-0"
                        />
                        <span className="text-slate-300 text-xs">
                          {round.startTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <MapPin
                            size={13}
                            className="text-slate-500 mt-0.5 shrink-0"
                          />
                          <span className="text-slate-300 text-xs">
                            {round.course}
                          </span>
                        </div>
                        {(round.mapsUrl || round.address) && (
                          <a
                            href={
                              round.mapsUrl ??
                              `https://maps.google.com/?q=${encodeURIComponent(round.address!)}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 active:bg-blue-600/40 border border-blue-500/40 text-blue-400 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0"
                          >
                            <Navigation size={11} />
                            Directions
                          </a>
                        )}
                      </div>
                      <div className="pt-1 border-t border-slate-700/30">
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {round.pointsNote}
                        </p>
                      </div>
                      {round.mapsEmbed && (
                        <div className="pt-2">
                          <iframe
                            src={round.mapsEmbed}
                            className="w-full rounded-lg border border-slate-700/40"
                            style={{ height: 200 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Hotels */}
          {(data.teams.east.hotel || data.teams.west.hotel) && (
            <div>
              <h3 className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">
                Accommodation
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(["east", "west"] as const).map((side) => {
                  const hotel = data.teams[side].hotel;
                  if (!hotel) return null;
                  const isEast = side === "east";
                  return (
                    <div
                      key={side}
                      className="bg-slate-800/60 rounded-xl border border-slate-700/40 overflow-hidden"
                    >
                      <div className={`px-3 py-2 border-b border-slate-700/30`}>
                        <p
                          className={`text-xs font-semibold ${isEast ? "text-east-light" : "text-west-light"}`}
                        >
                          {isEast ? "Team East" : "Team West"}
                        </p>
                        <p className="text-white text-xs font-medium mt-0.5">
                          {hotel.name}
                        </p>
                      </div>
                      <iframe
                        src={hotel.mapsEmbed}
                        className="w-full border-0"
                        style={{ height: 130 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Team East Bus Schedule */}
          {data.teams.east.bus && (
            <div>
              <h3 className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">
                Team East Bus Transportation
              </h3>
              <div className="bg-slate-800/60 rounded-xl border border-slate-700/40 overflow-hidden">
                <div className="px-4 py-3 space-y-0">
                  {data.teams.east.bus.stops.map((stop, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center shrink-0 w-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-east mt-0.5 shrink-0" />
                        {i < data.teams.east.bus!.stops.length - 1 && (
                          <div className="w-px flex-1 bg-slate-700 my-1" />
                        )}
                      </div>
                      <div
                        className={`pb-4 ${i === data.teams.east.bus!.stops.length - 1 ? "pb-0" : ""}`}
                      >
                        <p className="text-east-light text-xs font-semibold tabular-nums">
                          {stop.time}
                        </p>
                        <p className="text-white text-xs font-medium leading-snug mt-0.5">
                          {stop.from}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          → {stop.to}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-700/30 bg-east/5">
                  <p className="text-slate-400 text-xs leading-relaxed">
                    <span className="text-east-light font-semibold">
                      Note:{" "}
                    </span>
                    {data.teams.east.bus.arrivalNote}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RulesModal({ onClose }: { onClose: () => void }) {
  const rounds = [
    {
      num: 1,
      name: "Gatineau Golf & Country Club",
      day: "Saturday Morning",
      subtitle: "Modified Alternate Shot + Best Ball",
      matches: 5,
      totalPts: 10,
      lines: [
        { label: "Alt Shot match", pts: "1 pt" },
        { label: "Best Ball match", pts: "1 pt" },
        { label: "Halved", pts: "0.5 pt each" },
      ],
      note: "Front 9: Modified Alternate Shot — both players tee off, take the best drive, then alternate shots until holed. Back 9 (or immediately after alt shot concludes): Best Ball — each player plays their own ball, best score counts. Both are match play.",
    },
    {
      num: 2,
      name: "Club de Golf Le Sorcier",
      day: "Saturday Afternoon",
      subtitle: "2-Man Scramble Match Play",
      matches: 5,
      totalPts: 10,
      lines: [
        { label: "Front 9 winner", pts: "0.5 pt" },
        { label: "Back 9 winner", pts: "0.5 pt" },
        { label: "Overall winner", pts: "1 pt" },
        { label: "Halved", pts: "0.5 pt each" },
      ],
      note: "Both players hit, best ball is chosen each shot. Each match worth up to 2 pts across front, back, and overall.",
    },
    {
      num: 3,
      name: "Loch March Golf & Country Club",
      day: "Sunday",
      subtitle: "Individual Match Play (18 Holes)",
      matches: 10,
      totalPts: 20,
      lines: [
        { label: "Win", pts: "2 pts" },
        { label: "Halved", pts: "1 pt each" },
        { label: "Loss", pts: "0 pts" },
      ],
      note: "Head-to-head match play. Hole-by-hole scoring; match ends when one player is up by more holes than remain.",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full sm:max-w-lg bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-slate-700/60 overflow-hidden max-h-[95dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-gold" />
            <h2 className="text-white font-serif font-bold text-lg">
              Rules & Scoring
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-5">
          {/* How to win */}
          <div className="bg-gold/8 border border-gold/25 rounded-xl px-4 py-3.5">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1.5">
              How to Win
            </p>
            <p className="text-slate-200 text-sm leading-relaxed">
              <span className="text-white font-semibold">40 points</span>{" "}
              available across 3 rounds. First team to{" "}
              <span className="text-white font-semibold">20.5 points</span> wins
              the Cup outright.
            </p>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Team East holds the Cup — they need{" "}
              <span className="text-east-light font-semibold">20 pts</span> to
              retain. Team West needs{" "}
              <span className="text-west-light font-semibold">20.5 pts</span> to
              take it.
            </p>
          </div>

          {/* Closest to the Pin */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700/40 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700/30 flex items-center gap-2">
              <Target size={15} className="text-gold shrink-0" />
              <p className="text-white font-semibold text-sm">
                Closest to the Pin
              </p>
            </div>
            <div className="px-4 py-3 space-y-3">
              <p className="text-slate-300 text-xs leading-relaxed">
                Optional{" "}
                <span className="text-white font-semibold">$5 cash</span> buy-in
                per round. Pay before your tee time to be eligible. Winner takes
                the pot for that round.
              </p>
              <div className="space-y-2">
                {[
                  { round: "Round 1", course: "Gatineau", hole: "Hole 15" },
                  { round: "Round 2", course: "Le Sorcier", hole: "Hole 9" },
                  { round: "Round 3", course: "Loch March", hole: "Hole 16" },
                ].map((row) => (
                  <div
                    key={row.round}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <span className="text-slate-300 text-xs font-medium">
                        {row.round}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {" "}
                        · {row.course}
                      </span>
                    </div>
                    <span className="text-gold text-xs font-semibold">
                      {row.hole}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 mt-1">
                <span className="text-amber-400 text-xs font-semibold">
                  Bring cash!
                </span>
                <span className="text-slate-400 text-xs">
                  Payment must be made before the round starts.
                </span>
              </div>
            </div>
          </div>

          {/* Rounds */}
          {rounds.map((round) => (
            <div
              key={round.num}
              className="bg-slate-800/60 rounded-xl border border-slate-700/40 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-700/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      Round {round.num} · {round.name}
                    </p>
                    <p className="text-gold text-xs mt-0.5">{round.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-slate-400 text-xs">{round.day}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {round.matches} matches · {round.totalPts} pts
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div className="space-y-1.5">
                  {round.lines.map((line) => (
                    <div
                      key={line.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-slate-400 text-xs">
                        {line.label}
                      </span>
                      <span className="text-white text-xs font-semibold tabular-nums">
                        {line.pts}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 text-xs leading-relaxed pt-1.5 border-t border-slate-700/30">
                  {round.note}
                </p>
              </div>
            </div>
          ))}

          {/* Point breakdown */}
          <div className="bg-slate-800/40 rounded-xl border border-slate-700/40 px-4 py-3">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Points Breakdown
            </p>
            <div className="space-y-1.5">
              {[
                { label: "Round 1 — Gatineau", pts: "10 pts" },
                { label: "Round 2 — Le Sorcier", pts: "10 pts" },
                { label: "Round 3 — Loch March", pts: "20 pts" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-slate-400 text-xs">{row.label}</span>
                  <span className="text-gold text-xs font-bold tabular-nums">
                    {row.pts}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-700/50 mt-1.5">
                <span className="text-white text-xs font-semibold">
                  Total Available
                </span>
                <span className="text-gold text-sm font-bold tabular-nums">
                  40 pts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header({ data }: { data: TournamentData }) {
  const [showItinerary, setShowItinerary] = useState(false);
  const [showRules, setShowRules] = useState(false);
  useScrollLock(showItinerary || showRules);

  return (
    <>
      <header className="relative bg-navy-900 border-b border-gold/30 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #C8971A 0px, #C8971A 1px, transparent 1px, transparent 12px)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <Trophy className="text-gold" size={28} strokeWidth={1.5} />
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-white uppercase">
              Ryder Cup
            </h1>
            <Trophy className="text-gold" size={28} strokeWidth={1.5} />
          </div>
          <p className="text-gold-300 text-sm tracking-widest uppercase font-light">
            2026 · Ottawa Gatineau
          </p>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setShowItinerary(true)}
              className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 active:bg-gold/30 border border-gold/40 hover:border-gold/70 rounded-lg px-4 py-2 text-gold text-sm font-medium transition-colors"
            >
              <CalendarDays size={15} />
              Itinerary
              <ChevronRight size={14} className="opacity-60" />
            </button>
            <button
              onClick={() => setShowRules(true)}
              className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 active:bg-gold/30 border border-gold/40 hover:border-gold/70 rounded-lg px-4 py-2 text-gold text-sm font-medium transition-colors"
            >
              <BookOpen size={15} />
              Rules
              <ChevronRight size={14} className="opacity-60" />
            </button>
          </div>
          {data.tournament.note && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/10 text-white/50 text-xs">
              <Info size={11} className="shrink-0" />
              <span>{data.tournament.note}</span>
            </div>
          )}
        </div>
      </header>

      {showItinerary && (
        <ItineraryModal data={data} onClose={() => setShowItinerary(false)} />
      )}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </>
  );
}

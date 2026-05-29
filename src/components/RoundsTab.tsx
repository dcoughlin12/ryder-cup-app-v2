import { useState } from 'react';
import { ChevronDown, MapPin, Clock } from 'lucide-react';
import type { TournamentData, AltShotBestBallMatch, ScrambleMatch, IndividualMatch } from '../types';
import { calcRoundScore, formatPts } from '../utils/scoring';
import MatchCard from './MatchCard';

function RoundSection({
  round,
  defaultOpen = false,
}: {
  round: TournamentData['rounds'][number];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const score = calcRoundScore(round);
  const hasActivity = score.east > 0 || score.west > 0;

  return (
    <div className="border border-slate-700/60 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-slate-900 hover:bg-slate-800/80 transition-colors px-4 py-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-serif font-bold text-lg leading-tight">{round.name}</h2>
            <p className="text-gold text-xs font-medium mt-0.5">{round.subtitle}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              <span className="flex items-center gap-1 text-slate-400 text-xs">
                <MapPin size={11} /> {round.course}
              </span>
              <span className="flex items-center gap-1 text-slate-400 text-xs">
                <Clock size={11} /> {round.date} · {round.startTime}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {hasActivity && (
              <div className="text-right">
                <span className="text-east font-bold">{formatPts(score.east)}</span>
                <span className="text-slate-600 mx-1">–</span>
                <span className="text-west font-bold">{formatPts(score.west)}</span>
              </div>
            )}
            <ChevronDown
              size={18}
              className={`text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
        <p className="mt-3 text-slate-500 text-xs leading-relaxed">{round.pointsNote}</p>
      </button>

      {open && (
        <div className="bg-slate-950 px-3 py-3 space-y-3 border-t border-slate-700/40">
          {round.matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match as AltShotBestBallMatch | ScrambleMatch | IndividualMatch}
              format={round.format}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RoundsTab({ data }: { data: TournamentData }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {data.rounds.map((round, i) => (
        <RoundSection key={round.id} round={round} defaultOpen={i === (data.tournament.currentRound ?? 1) - 1} />
      ))}
    </div>
  );
}

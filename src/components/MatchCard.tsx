import type {
  AltShotBestBallMatch,
  ScrambleMatch,
  IndividualMatch,
} from "../types";
import {
  calcAltShotBestBallMatch,
  calcScrambleMatch,
  calcIndividualMatch,
  formatPts,
} from "../utils/scoring";
import { MatchResultPill as ResultPill } from "./ResultBadge";

function AltShotCard({ match }: { match: AltShotBestBallMatch }) {
  const pts = calcAltShotBestBallMatch(match);
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700/60 overflow-hidden">
      <div className="flex items-stretch">
        <div className="flex-1 px-3 py-3 bg-east/5 border-r border-slate-700/40">
          <p className="text-xs text-east-light font-semibold uppercase tracking-wider mb-0.5">
            East
          </p>
          <p className="text-white font-medium text-sm">
            {match.east.join(" / ")}
          </p>
        </div>
        <div className="px-3 py-3 flex items-center justify-center shrink-0">
          <span className="text-gold font-serif text-base font-bold">
            {formatPts(pts.east)} – {formatPts(pts.west)}
          </span>
        </div>
        <div className="flex-1 px-3 py-3 bg-west/5 border-l border-slate-700/40 text-right">
          <p className="text-xs text-west-light font-semibold uppercase tracking-wider mb-0.5">
            West
          </p>
          <p className="text-white font-medium text-sm">
            {match.west.join(" / ")}
          </p>
        </div>
      </div>
      <div className="border-t border-slate-700/40 grid grid-cols-2 divide-x divide-slate-700/40">
        <div className="px-3 py-2 flex flex-col gap-1">
          <span className="text-slate-400 text-xs">Alt Shot</span>
          <ResultPill result={match.altShot.result} winPts={1} />
        </div>
        <div className="px-3 py-2 flex flex-col gap-1">
          <span className="text-slate-400 text-xs">Best Ball</span>
          <ResultPill result={match.bestBall.result} winPts={1} />
        </div>
      </div>
      {/* <div className="px-3 py-1.5 bg-slate-800/50 border-t border-slate-700/30 text-right">
        <span className="text-slate-600 text-xs">{match.teeTime}</span>
      </div> */}
    </div>
  );
}

function ScrambleCard({ match }: { match: ScrambleMatch }) {
  const pts = calcScrambleMatch(match);
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700/60 overflow-hidden">
      <div className="flex items-stretch">
        <div className="flex-1 px-3 py-3 bg-east/5 border-r border-slate-700/40">
          <p className="text-xs text-east-light font-semibold uppercase tracking-wider mb-0.5">
            East
          </p>
          <p className="text-white font-medium text-sm">
            {match.east.join(" / ")}
          </p>
        </div>
        <div className="px-3 py-3 flex items-center justify-center shrink-0">
          <span className="text-gold font-serif text-base font-bold">
            {formatPts(pts.east)} – {formatPts(pts.west)}
          </span>
        </div>
        <div className="flex-1 px-3 py-3 bg-west/5 border-l border-slate-700/40 text-right">
          <p className="text-xs text-west-light font-semibold uppercase tracking-wider mb-0.5">
            West
          </p>
          <p className="text-white font-medium text-sm">
            {match.west.join(" / ")}
          </p>
        </div>
      </div>
      <div className="border-t border-slate-700/40 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-700/40">
        <div className="px-2 py-2 flex items-center justify-between gap-1">
          <span className="text-slate-400 text-xs shrink-0">Front 9</span>
          <ResultPill result={match.front9.result} winPts={0.5} />
        </div>
        <div className="px-2 py-2 flex items-center justify-between gap-1">
          <span className="text-slate-400 text-xs shrink-0">Back 9</span>
          <ResultPill result={match.back9.result} winPts={0.5} />
        </div>
        <div className="px-2 py-2 flex items-center justify-between gap-1">
          <span className="text-slate-400 text-xs shrink-0">Overall</span>
          <ResultPill result={match.overall.result} winPts={1} />
        </div>
      </div>
      {/* <div className="px-3 py-1.5 bg-slate-800/50 border-t border-slate-700/30 text-right">
        <span className="text-slate-600 text-xs">{match.teeTime}</span>
      </div> */}
    </div>
  );
}

function IndividualCard({ match }: { match: IndividualMatch }) {
  const pts = calcIndividualMatch(match);

  if (match.east === null || match.west === null) {
    return (
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 px-4 py-3 flex items-center justify-between">
        <span className="text-slate-600 text-sm italic">TBD</span>
        <span className="text-slate-700 text-xs">{match.teeTime}</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700/60 overflow-hidden">
      <div className="flex items-stretch">
        <div className="flex-1 px-3 py-3 bg-east/5 border-r border-slate-700/40">
          <p className="text-xs text-east-light font-semibold uppercase tracking-wider mb-0.5">
            East
          </p>
          <p className="text-white font-medium text-sm">{match.east}</p>
        </div>
        <div className="px-3 py-3 flex flex-col items-center justify-center shrink-0 gap-1">
          <span className="text-gold font-serif text-base font-bold">
            {formatPts(pts.east)} – {formatPts(pts.west)}
          </span>
          <ResultPill result={match.result} winPts={2} />
        </div>
        <div className="flex-1 px-3 py-3 bg-west/5 border-l border-slate-700/40 text-right">
          <p className="text-xs text-west-light font-semibold uppercase tracking-wider mb-0.5">
            West
          </p>
          <p className="text-white font-medium text-sm">{match.west}</p>
        </div>
      </div>
      {/* <div className="px-3 py-1.5 bg-slate-800/50 border-t border-slate-700/30 text-right">
        <span className="text-slate-600 text-xs">{match.teeTime}</span>
      </div> */}
    </div>
  );
}

interface Props {
  match: AltShotBestBallMatch | ScrambleMatch | IndividualMatch;
  format: "alt_shot_best_ball" | "scramble" | "individual";
}

export default function MatchCard({ match, format }: Props) {
  if (format === "alt_shot_best_ball")
    return <AltShotCard match={match as AltShotBestBallMatch} />;
  if (format === "scramble")
    return <ScrambleCard match={match as ScrambleMatch} />;
  return <IndividualCard match={match as IndividualMatch} />;
}

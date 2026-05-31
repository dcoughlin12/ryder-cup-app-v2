import type { MatchResult } from "../types";

function fmtPts(n: number) {
  if (n === 0.25) return "0.25";
  if (n === 0.5) return "0.5";
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}

/** Neutral pill used in match cards — shows which team won */
export function MatchResultPill({
  result,
  winPts,
}: {
  result: MatchResult;
  winPts: number;
}) {
  if (!result)
    return <span className="text-slate-600 text-xs italic">pending</span>;
  if (result === "east")
    return (
      <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-east/20 text-east-light border border-east/30 whitespace-nowrap">
        East wins · {fmtPts(winPts)} pt
      </span>
    );
  if (result === "west")
    return (
      <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-west/20 text-west-light border border-west/30 whitespace-nowrap">
        West wins · {fmtPts(winPts)} pt
      </span>
    );
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-gold/10 text-gold border border-gold/30 whitespace-nowrap">
      Halved · {fmtPts(winPts / 2)} pt each
    </span>
  );
}

/** Player-relative pill used in player cards — shows Won / Lost / Halved */
export function PlayerResultPill({
  result,
  winPts,
  team,
}: {
  result: MatchResult;
  winPts: number;
  team: "east" | "west";
}) {
  if (!result)
    return <span className="text-slate-600 text-xs italic">pending</span>;

  const won = result === team;
  const halved = result === "halved";
  const earned = won ? winPts : halved ? winPts / 2 : 0;

  if (won)
    return (
      <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/30 whitespace-nowrap">
        Won · +{fmtPts(earned)} pt
      </span>
    );
  if (halved)
    return (
      <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-gold/10 text-gold border border-gold/30 whitespace-nowrap">
        Halved · +{fmtPts(earned)} pt
      </span>
    );
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-500 border border-slate-700 whitespace-nowrap">
      Lost · 0 pts
    </span>
  );
}

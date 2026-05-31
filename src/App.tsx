import { useState } from 'react';
import data from './data/tournament';
import { calcTotalScore } from './utils/scoring';
import Header from './components/Header';
import ScoreHero from './components/ScoreHero';
import TabNav from './components/TabNav';
import RoundsTab from './components/RoundsTab';
import StatsTab from './components/StatsTab';
import Chat from './components/Chat';

export default function App() {
  const [tab, setTab] = useState<'rounds' | 'stats'>('rounds');
  const score = calcTotalScore(data);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <Header data={data} />
      <ScoreHero score={score} status={data.tournament.status} />
      <TabNav active={tab} onChange={setTab} />
      {tab === 'rounds' ? (
        <RoundsTab data={data} />
      ) : (
        <StatsTab data={data} />
      )}
      <footer className="max-w-3xl mx-auto px-4 py-8 text-center text-slate-700 text-xs">
        {data.tournament.name} · {data.tournament.dates}
      </footer>
      <Chat />
    </div>
  );
}

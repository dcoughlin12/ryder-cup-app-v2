interface Props {
  active: 'rounds' | 'stats';
  onChange: (tab: 'rounds' | 'stats') => void;
}

export default function TabNav({ active, onChange }: Props) {
  return (
    <div className="sticky top-0 z-20 bg-navy-900/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-3xl mx-auto px-4 flex">
        {(['rounds', 'stats'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`flex-1 py-3 text-sm font-semibold tracking-widest uppercase transition-colors relative ${
              active === tab
                ? 'text-gold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
            {active === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

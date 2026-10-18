import React from 'react';
import { ChevronDown, Star, Award, Zap } from 'lucide-react';
import { PlayerCard } from '../utils/fcRules';
import { formatBp } from '../utils/fcRules';
import { getCardValueByLevel } from '../data/mockDatabase';

interface PlayerCardViewProps {
  card: PlayerCard;
  allCards: PlayerCard[];
  onSelectCard: (card: PlayerCard) => void;
}

export const PlayerCardView: React.FC<PlayerCardViewProps> = ({
  card,
  allCards,
  onSelectCard,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const currentOvr = card.ovr + (card.level - 1);
  const currentPrice = getCardValueByLevel(card.marketPriceBp, card.level);

  // Card level badge color
  const getLevelBadgeStyle = (lvl: number) => {
    if (lvl === 1) return 'bg-zinc-700 text-zinc-100 border-zinc-500';
    if (lvl <= 4) return 'bg-gradient-to-b from-amber-700 to-amber-900 text-amber-100 border-amber-600 shadow-amber-900/50';
    if (lvl <= 7) return 'bg-gradient-to-b from-slate-200 to-slate-400 text-slate-950 font-black border-slate-100 shadow-slate-500/50';
    return 'bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 text-amber-950 font-black border-yellow-200 shadow-yellow-500/80 animate-pulse';
  };

  return (
    <div className="flex flex-col items-center">
      {/* Authentic FC Online Card Frame */}
      <div className="relative w-64 h-[350px] rounded-2xl bg-gradient-to-b from-[#1b2533] via-[#0f1722] to-[#080d14] border-2 border-emerald-500/40 p-4 shadow-2xl shadow-emerald-950/60 overflow-hidden flex flex-col justify-between group">
        {/* Card Hologram Foil Line */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Card Info: Position, OVR & Badges */}
        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black font-mono tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {currentOvr}
            </span>
            <span className="text-xs font-bold text-emerald-400 tracking-wider">
              {card.position}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
              27
            </span>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="bg-emerald-950/80 border border-emerald-500/50 px-2 py-0.5 rounded text-[11px] font-bold text-emerald-300 tracking-wide shadow">
              {card.season}
            </div>
            {/* Nation flag / team indicator mock */}
            <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-zinc-700/50">
              <span className="text-[10px] text-zinc-300 font-semibold">RM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
          </div>
        </div>

        {/* Card Player Avatar */}
        <div className="relative flex-1 flex items-center justify-center -my-2 z-0">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-emerald-500/30 shadow-lg relative bg-gradient-to-b from-zinc-800 to-zinc-950">
            <img
              src={card.avatarUrl || 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&auto=format&fit=crop&q=80'}
              alt={card.name}
              className="w-full h-full object-cover object-top filter contrast-110"
              loading="lazy"
            />
            {/* Hologram overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          {/* Level badge positioned over bottom of avatar */}
          <div className={`absolute bottom-0 px-2.5 py-0.5 rounded border text-xs font-black shadow-lg ${getLevelBadgeStyle(card.level)}`}>
            +{card.level}
          </div>
        </div>

        {/* Bottom Card Info: Player Name & Details */}
        <div className="z-10 bg-black/60 rounded-xl p-2 border border-zinc-800 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-sm text-zinc-100 truncate max-w-[130px]">
                {card.name}
              </span>
            </div>
            <div className="flex text-amber-400 text-xs">
              <Star className="w-3 h-3 fill-amber-400" />
              <Star className="w-3 h-3 fill-amber-400" />
              <Star className="w-3 h-3 fill-amber-400" />
              <Star className="w-3 h-3 fill-amber-400" />
            </div>
          </div>

          {/* Key Attributes rows */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Cấp thẻ:</span>
              <span className="font-bold text-emerald-400">+{card.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Chỉ số:</span>
              <span className="font-bold text-zinc-200">{currentOvr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Huấn luyện:</span>
              <span className="font-semibold text-zinc-200">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Kỹ thuật:</span>
              <span className="text-amber-400 font-bold">★★★★</span>
            </div>
          </div>

          {/* Card Market Price */}
          <div className="mt-1.5 pt-1 border-t border-zinc-800 flex justify-between items-center text-xs">
            <span className="text-zinc-500">Giá TTCN:</span>
            <span className="font-mono font-bold text-amber-300">
              {formatBp(currentPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Thay đổi cầu thủ (Dropdown button) */}
      <div className="relative mt-3 w-64">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between bg-[#151f2b] hover:bg-[#1a2736] border border-emerald-600/40 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition"
        >
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" /> Thay đổi cầu thủ cần ép
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#101722] border border-emerald-500/40 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto divide-y divide-zinc-800">
            {allCards.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCard(c);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-emerald-950/40 transition ${c.id === card.id ? 'bg-emerald-950/70 border-l-2 border-emerald-400' : ''}`}
              >
                <div>
                  <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    <span>{c.name}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1 rounded">+{c.level}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {c.season} • {c.position} • OVR {c.ovr + (c.level - 1)}
                  </div>
                </div>
                <div className="text-right font-mono text-amber-300 font-semibold text-[11px]">
                  {formatBp(getCardValueByLevel(c.marketPriceBp, c.level))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

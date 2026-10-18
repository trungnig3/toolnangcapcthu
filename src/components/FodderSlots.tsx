import React from 'react';
import { X, Sparkles, Trash2 } from 'lucide-react';
import { InventoryCard } from '../data/mockDatabase';
import { formatBp, calculateFodderBar } from '../utils/fcRules';
import { sound } from '../utils/soundEffects';

interface FodderSlotsProps {
  selectedFodders: InventoryCard[];
  targetOvr: number;
  onRemoveFodder: (index: number) => void;
  onClearAll: () => void;
  onAutoOptimize: () => void;
}

export const FodderSlots: React.FC<FodderSlotsProps> = ({
  selectedFodders,
  targetOvr,
  onRemoveFodder,
  onClearAll,
  onAutoOptimize,
}) => {
  const totalCost = selectedFodders.reduce((sum, f) => sum + f.priceBp, 0);

  return (
    <div className="w-full bg-[#101722]/90 border border-emerald-900/40 rounded-xl p-3.5 space-y-3 shadow-lg">
      {/* Top Header of Fodder Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-200">Cầu thủ sử dụng</span>
          <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
            {selectedFodders.length} / 5
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onAutoOptimize();
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1 rounded text-xs font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lọc phôi rẻ nhất</span>
          </button>

          {selectedFodders.length > 0 && (
            <button
              onClick={() => {
                sound.playClick();
                onClearAll();
              }}
              className="text-zinc-400 hover:text-rose-400 p-1 rounded hover:bg-zinc-800 transition"
              title="Xóa toàn bộ phôi đã chọn"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 5 Slots Grid */}
      <div className="grid grid-cols-5 gap-2">
        {[0, 1, 2, 3, 4].map((slotIdx) => {
          const fodder = selectedFodders[slotIdx];
          if (fodder) {
            const bars = calculateFodderBar(targetOvr, fodder.ovr);
            return (
              <div
                key={slotIdx}
                className="relative bg-[#16202c] border border-emerald-500/50 rounded-lg p-1.5 flex flex-col items-center justify-between h-24 group shadow"
              >
                {/* Remove button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onRemoveFodder(slotIdx);
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-0.5 shadow opacity-80 group-hover:opacity-100 transition z-10"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Avatar & Season */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-600 bg-zinc-800 mt-0.5">
                  <img
                    src={fodder.avatarUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80'}
                    alt={fodder.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="text-center w-full">
                  <div className="text-[10px] font-bold text-zinc-100 truncate">
                    {fodder.name}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[9px] text-zinc-400 font-mono">
                    <span className="text-emerald-400 font-bold">{fodder.ovr}</span>
                    <span>+{fodder.level}</span>
                  </div>
                </div>

                {/* Bar contribution badge */}
                <div className="w-full text-center bg-emerald-950/80 rounded py-0.5 text-[9px] font-mono font-bold text-emerald-300 border border-emerald-800/40">
                  +{bars.toFixed(2)}v
                </div>
              </div>
            );
          }

          return (
            <div
              key={slotIdx}
              className="bg-[#0b1016]/80 border border-dashed border-zinc-700/60 rounded-lg p-2 flex flex-col items-center justify-center h-24 text-center text-zinc-600"
            >
              <span className="text-xs font-mono font-bold">CT {slotIdx + 1}</span>
              <span className="text-[9px] text-zinc-600 mt-1">Trống</span>
            </div>
          );
        })}
      </div>

      {/* Cost summary */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/70">
        <span className="text-zinc-400">Tổng chi phí phôi:</span>
        <span className="font-mono font-bold text-amber-300">
          {totalCost > 0 ? formatBp(totalCost) : '0 BP'}
        </span>
      </div>
    </div>
  );
};

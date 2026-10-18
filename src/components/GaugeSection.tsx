import React from 'react';
import { ShieldCheck, HelpCircle, Flame } from 'lucide-react';
import { calculateSuccessRate } from '../utils/fcRules';

interface GaugeSectionProps {
  currentLevel: number;
  totalBars: number;
  boostPct: number;
  onSetBoostPct: (pct: number) => void;
  useProtection: boolean;
  onToggleProtection: (val: boolean) => void;
}

export const GaugeSection: React.FC<GaugeSectionProps> = ({
  currentLevel,
  totalBars,
  boostPct,
  onSetBoostPct,
  useProtection,
  onToggleProtection,
}) => {
  const targetLevel = currentLevel + 1;
  const successPct = calculateSuccessRate(targetLevel, totalBars, boostPct);

  // Bars 1 to 5 calculation
  const getBarFillRatio = (barIndex: number) => {
    // barIndex 1 to 5
    if (totalBars >= barIndex) return 1.0;
    if (totalBars < barIndex - 1) return 0.0;
    return totalBars - (barIndex - 1);
  };

  return (
    <div className="w-full bg-[#101722]/90 border border-emerald-900/40 rounded-xl p-3.5 space-y-3 shadow-lg">
      {/* Option Rows */}
      <div className="space-y-2 text-xs">
        {/* Tăng tỉ lệ nâng cấp (Booster) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Tăng tỉ lệ nâng cấp</span>
          </div>
          <select
            value={boostPct}
            onChange={(e) => onSetBoostPct(Number(e.target.value))}
            className="bg-[#182330] border border-zinc-700/60 rounded px-2 py-1 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value={0}>Không áp dụng (0%)</option>
            <option value={5}>Vật phẩm +5% tỉ lệ</option>
            <option value={10}>Vật phẩm +10% tỉ lệ</option>
            <option value={15}>Vật phẩm VIP +15% tỉ lệ</option>
          </select>
        </div>

        {/* Bảo vệ nâng cấp (Shield) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck className={`w-4 h-4 ${useProtection ? 'text-emerald-400' : 'text-zinc-600'}`} />
            <span>Bảo vệ nâng cấp</span>
            <span title="Giảm nguy cơ rớt hạng nặng khi nâng cấp thất bại" className="text-zinc-600 hover:text-zinc-400 cursor-help">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useProtection}
              onChange={(e) => onToggleProtection(e.target.checked)}
              className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
            />
            <span className={`text-xs ${useProtection ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}`}>
              {useProtection ? 'Đang kích hoạt' : 'Không áp dụng'}
            </span>
          </label>
        </div>
      </div>

      {/* Tăng % nâng cấp (The 5-bar gauge in FC Online) */}
      <div className="pt-2 border-t border-zinc-800">
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <div className="flex items-center gap-1 text-zinc-300 font-semibold">
            <span>Tăng % nâng cấp</span>
            <span className="text-emerald-400 font-mono font-bold">
              ({totalBars.toFixed(1)} / 5 vạch)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-400">Tỷ lệ thành công:</span>
            <span className={`font-mono font-black text-sm ${successPct >= 80 ? 'text-emerald-400' : successPct >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
              {successPct}%
            </span>
          </div>
        </div>

        {/* 5-Segment Visual Gauge */}
        <div className="grid grid-cols-5 gap-1.5 bg-[#0a0e14] p-1.5 rounded-lg border border-zinc-800">
          {[1, 2, 3, 4, 5].map((barNum) => {
            const fillRatio = getBarFillRatio(barNum);
            return (
              <div
                key={barNum}
                className="relative h-6 rounded bg-zinc-800/80 overflow-hidden border border-zinc-700/40 flex items-center justify-center group"
              >
                {/* Active fill segment */}
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                  style={{ width: `${fillRatio * 100}%` }}
                />
                {/* Segment label */}
                <span className="relative z-10 text-[11px] font-bold font-mono text-zinc-300 drop-shadow">
                  {barNum}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-1 text-[11px] text-zinc-500">
          <span>{totalBars >= 5 ? 'Đầy 5 vạch (Tỷ lệ tối đa)' : `Cần thêm ${(5 - totalBars).toFixed(1)} vạch`}</span>
          <span>Nâng cấp lên +{targetLevel}</span>
        </div>
      </div>
    </div>
  );
};

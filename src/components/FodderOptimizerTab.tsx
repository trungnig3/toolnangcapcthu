import React, { useState } from 'react';
import { Calculator, Sparkles, TrendingDown, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { FodderPriceItem, findCheapestFodderCombination, formatBp } from '../utils/fcRules';
import { sound } from '../utils/soundEffects';

interface FodderOptimizerTabProps {
  targetOvr: number;
  prices: FodderPriceItem[];
  onUpdatePrice: (ovr: number, newPrice: number) => void;
  onResetPrices: () => void;
  onApplyOptimalRecipe: (fodderList: { ovr: number; count: number; unitCost: number }[]) => void;
}

export const FodderOptimizerTab: React.FC<FodderOptimizerTabProps> = ({
  targetOvr,
  prices,
  onUpdatePrice,
  onResetPrices,
  onApplyOptimalRecipe,
}) => {
  const [editingOvr, setEditingOvr] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Calculate the cheapest combination to reach 5 bars for this target card
  const optimalCombo = findCheapestFodderCombination(targetOvr, prices, 5.0);

  const handleEditClick = (item: FodderPriceItem) => {
    setEditingOvr(item.ovr);
    setTempPrice(String(item.costBp));
  };

  const handleSavePrice = (ovr: number) => {
    const val = parseInt(tempPrice, 10);
    if (!isNaN(val) && val > 0) {
      onUpdatePrice(ovr, val);
    }
    setEditingOvr(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d141d]/90 border border-emerald-900/30 rounded-xl overflow-hidden shadow-xl p-4 space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-[#13222f] to-[#0a111a] border border-emerald-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Thuật Toán Lọc Giá Phôi Tối Ưu</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/40 font-mono">
                AI Solver
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Tự động giải bài toán tổ hợp phôi rẻ nhất để đầy đúng 5 vạch cho thẻ OVR {targetOvr}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onResetPrices();
          }}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 self-start sm:self-auto bg-zinc-800/80 px-2 py-1 rounded border border-zinc-700 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset giá chuẩn</span>
        </button>
      </div>

      {/* Optimal Result Box */}
      {optimalCombo && (
        <div className="bg-[#121c27] border-2 border-emerald-500/60 rounded-xl p-4 shadow-lg shadow-emerald-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-200">
                Tổ hợp 5 phôi tiết kiệm nhất (Đầy {optimalCombo.totalBars.toFixed(1)} vạch)
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Tiết kiệm {formatBp(optimalCombo.savedBp)}</span>
            </div>
          </div>

          {/* Cards to buy badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {optimalCombo.fodders.map((f, idx) => (
              <div
                key={idx}
                className="bg-[#172535] border border-emerald-500/40 rounded-lg p-2.5 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="bg-emerald-900/80 text-emerald-300 font-mono text-[11px] px-1.5 py-0.5 rounded">
                      {f.count} thẻ
                    </span>
                    <span>OVR {f.ovr}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    +{f.barsPerCard.toFixed(2)} vạch / thẻ
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-amber-300 text-xs">
                  {formatBp(f.unitCost * f.count)}
                </div>
              </div>
            ))}
          </div>

          {/* Cost Comparison */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-zinc-500 text-[11px]">Tổng chi phí tối ưu: </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {formatBp(optimalCombo.totalCostBp)}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 text-[11px]">Mua 5 thẻ OVR {targetOvr}: </span>
                <span className="font-mono text-zinc-400 line-through">
                  {formatBp(optimalCombo.naiveCostBp)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onApplyOptimalRecipe(optimalCombo.fodders);
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow flex items-center gap-1.5 transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Áp dụng vào khay ép thẻ ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Market Prices Table / Live Editor */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#090e15] border border-zinc-800 rounded-xl">
        <div className="p-2.5 bg-[#0e1722] border-b border-zinc-800 flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300">Bảng Giá Phôi TTCN FC Online (Chỉnh sửa trực tiếp)</span>
          <span className="text-[11px] text-zinc-500">Click vào giá để cập nhật theo thị trường</span>
        </div>

        <div className="flex-1 overflow-y-auto max-h-56 p-2 space-y-1.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {prices.map((item) => (
              <div
                key={item.ovr}
                className="flex items-center justify-between p-2 rounded-lg bg-[#121a24] border border-zinc-800/80 hover:border-emerald-500/40 text-xs transition"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white bg-zinc-800 px-2 py-0.5 rounded text-xs">
                    OVR {item.ovr}
                  </span>
                  <span className="text-zinc-400 text-[11px] truncate max-w-[120px]">
                    {item.suggestedName || 'Phôi TTCN'}
                  </span>
                </div>

                <div>
                  {editingOvr === item.ovr ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(e.target.value)}
                        className="w-24 bg-[#182330] border border-emerald-500 rounded px-1.5 py-0.5 text-xs text-amber-300 font-mono"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSavePrice(item.ovr);
                          if (e.key === 'Escape') setEditingOvr(null);
                        }}
                      />
                      <button
                        onClick={() => handleSavePrice(item.ovr)}
                        className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px]"
                      >
                        Lưu
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(item)}
                      title="Bấm để sửa giá"
                      className="font-mono font-bold text-amber-300 hover:text-amber-200 hover:underline px-1.5 py-0.5 rounded bg-zinc-800/50"
                    >
                      {formatBp(item.costBp)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

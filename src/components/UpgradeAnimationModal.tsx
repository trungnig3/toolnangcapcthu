import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { PlayerCard } from '../utils/fcRules';
import { formatBp } from '../utils/fcRules';
import { getCardValueByLevel } from '../data/mockDatabase';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface UpgradeAnimationModalProps {
  isOpen: boolean;
  card: PlayerCard;
  previousLevel: number;
  success: boolean;
  newLevel: number;
  successRate: number;
  restored: boolean;
  costBp: number;
  onClose: () => void;
  onRetry: () => void;
}

export const UpgradeAnimationModal: React.FC<UpgradeAnimationModalProps> = ({
  isOpen,
  card,
  previousLevel,
  success,
  newLevel,
  successRate,
  restored,
  costBp,
  onClose,
  onRetry,
}) => {
  const [phase, setPhase] = useState<'charging' | 'revealed'>('charging');

  useEffect(() => {
    if (isOpen) {
      setPhase('charging');
      sound.playCharge(1.5);
      const timer = setTimeout(() => {
        setPhase('revealed');
        if (success) {
          sound.playSuccess();
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
          });
        } else {
          sound.playFail();
        }
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [isOpen, success]);

  if (!isOpen) return null;

  const previousValue = getCardValueByLevel(card.marketPriceBp, previousLevel);
  const newValue = getCardValueByLevel(card.marketPriceBp, newLevel);
  const newOvr = card.ovr + (newLevel - 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#141e2a] via-[#0d151e] to-[#070b10] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col items-center text-center">
        {/* Glow ambient background */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          phase === 'revealed'
            ? success
              ? 'bg-gradient-to-b from-emerald-500/20 via-transparent to-amber-500/10'
              : 'bg-gradient-to-b from-rose-500/20 via-transparent to-transparent'
            : 'bg-emerald-500/10'
        }`} />

        {/* Phase 1: CHARGING ANIMATION */}
        {phase === 'charging' && (
          <div className="flex flex-col items-center py-8 space-y-6 animate-pulse">
            <div className="relative w-40 h-52 rounded-2xl bg-gradient-to-b from-emerald-950 to-zinc-900 border-2 border-emerald-400 p-3 shadow-[0_0_40px_rgba(16,185,129,0.5)] flex flex-col items-center justify-center">
              <div className="text-3xl font-black font-mono text-emerald-300">
                +{previousLevel} → +{previousLevel + 1}
              </div>
              <div className="text-xs text-zinc-300 mt-2 font-semibold">
                Đang nâng cấp...
              </div>
              {/* Spinning energy ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-emerald-400 rounded-2xl animate-spin" />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-emerald-400 tracking-wide uppercase">
                Tỷ lệ thành công: {successRate}%
              </div>
              <div className="w-56 h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 animate-[loading_1.5s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        )}

        {/* Phase 2: REVEALED RESULT */}
        {phase === 'revealed' && (
          <div className="flex flex-col items-center py-4 space-y-5 animate-scaleUp w-full">
            {/* Status Header */}
            {success ? (
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/50 px-4 py-1.5 rounded-full text-emerald-300 font-black text-sm tracking-widest uppercase shadow">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>NÂNG CẤP THÀNH CÔNG!</span>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                </div>
                <p className="text-xs text-zinc-400">
                  Chúc mừng bạn đã nâng cấp thành công thẻ cầu thủ!
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/50 px-4 py-1.5 rounded-full text-rose-300 font-black text-sm tracking-widest uppercase shadow">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>NÂNG CẤP THẤT BẠI</span>
                </div>
                <p className="text-xs text-zinc-400">
                  {restored
                    ? 'Bảo vệ nâng cấp đã kích hoạt, giữ lại cấp thẻ!'
                    : 'Rất tiếc, thẻ của bạn đã bị giảm cấp độ.'}
                </p>
              </div>
            )}

            {/* Upgraded Card Display */}
            <div className={`relative w-48 h-64 rounded-2xl p-4 flex flex-col justify-between items-center border-2 transition-all shadow-2xl ${
              success
                ? 'bg-gradient-to-b from-[#21352a] via-[#111f18] to-[#0a110d] border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-b from-[#311c1c] via-[#1b1010] to-[#0c0808] border-rose-500/60 shadow-[0_0_35px_rgba(244,63,94,0.3)]'
            }`}>
              {/* OVR & Season */}
              <div className="w-full flex justify-between items-start">
                <span className="text-2xl font-black font-mono text-white">
                  {newOvr}
                </span>
                <span className="text-xs font-bold text-zinc-300 bg-black/40 px-2 py-0.5 rounded border border-zinc-700">
                  {card.season}
                </span>
              </div>

              {/* Avatar & Resulting Level Badge */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-500 shadow-md">
                  <img
                    src={card.avatarUrl || 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&auto=format&fit=crop&q=80'}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded text-xs font-black shadow-lg ${
                  newLevel >= 8
                    ? 'bg-gradient-to-b from-amber-300 to-yellow-600 text-amber-950 border border-yellow-200'
                    : newLevel >= 5
                    ? 'bg-gradient-to-b from-slate-200 to-slate-400 text-slate-950 font-black border border-slate-100'
                    : newLevel >= 2
                    ? 'bg-gradient-to-b from-amber-700 to-amber-900 text-amber-100 border border-amber-600'
                    : 'bg-zinc-700 text-zinc-200 border border-zinc-500'
                }`}>
                  +{newLevel}
                </div>
              </div>

              {/* Player Name */}
              <div className="text-center w-full">
                <div className="font-bold text-sm text-white truncate">{card.name}</div>
                <div className="text-[11px] text-zinc-400">{card.position}</div>
              </div>
            </div>

            {/* Financial Change details */}
            <div className="w-full bg-black/40 rounded-xl p-3 border border-zinc-800 text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Cấp thẻ thay đổi:</span>
                <span className="font-bold font-mono text-white">
                  +{previousLevel} → +{newLevel}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Giá trị thẻ mới:</span>
                <span className="font-mono font-bold text-amber-300">
                  {formatBp(newValue)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Chi phí phôi tiêu hao:</span>
                <span className="font-mono text-rose-300">
                  -{formatBp(costBp)}
                </span>
              </div>
              {restored && (
                <div className="flex items-center gap-1.5 text-emerald-400 pt-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Bảo hiểm nâng cấp đã cứu thẻ không bị tụt về +1!</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Xác nhận
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onRetry();
                }}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tiếp tục ép thẻ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

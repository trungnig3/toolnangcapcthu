import React from 'react';
import { Volume2, VolumeX, Shield, RefreshCw, Terminal, PlusCircle, Sparkles } from 'lucide-react';
import { formatBp } from '../utils/fcRules';
import { sound } from '../utils/soundEffects';

interface HeaderProps {
  bpBalance: number;
  onAddBp: (amount: number) => void;
  onResetData: () => void;
  onOpenMacroModal: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  bpBalance,
  onAddBp,
  onResetData,
  onOpenMacroModal,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="bg-[#0b1016]/95 border-b border-emerald-900/40 sticky top-0 z-40 backdrop-blur-md px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & In-game Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 px-3 py-1.5 rounded-lg shadow-lg shadow-emerald-500/20 font-black tracking-wider text-white text-base sm:text-lg">
            <span className="bg-black/30 px-1.5 py-0.5 rounded text-xs tracking-normal">FC</span>
            <span>AUTO UPGRADE</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 border-l border-emerald-800/40 pl-3">
            <span className="text-emerald-400 font-semibold text-xs tracking-wide">ConBacFC</span>
            <span className="bg-emerald-950/80 text-emerald-300 text-[11px] px-1.5 py-0.5 rounded border border-emerald-800/50">92</span>
            <span className="text-zinc-400 text-xs flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Verygood
            </span>
            <span className="text-zinc-500 text-xs">LV 8</span>
          </div>
        </div>

        {/* Currency & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* BP Display */}
          <div className="flex items-center gap-2 bg-[#121820] border border-emerald-500/30 rounded-lg px-2.5 sm:px-3 py-1 shadow-inner">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-[10px] font-black text-amber-950 shadow">
              BP
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 leading-none">Số dư BP</span>
              <span className="text-xs sm:text-sm font-bold text-amber-300 font-mono tracking-tight">
                {formatBp(bpBalance)}
              </span>
            </div>
            <button
              onClick={() => onAddBp(100_000_000)}
              title="Nạp 100M BP giả lập để test"
              className="text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/40 rounded px-1.5 py-0.5 flex items-center gap-1 transition"
            >
              <PlusCircle className="w-3 h-3" />
              <span className="hidden sm:inline">+100M</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-2 rounded-lg bg-[#141d27] border border-zinc-700/50 text-zinc-300 hover:text-white hover:border-emerald-500/50 transition"
            title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          {/* PC Macro Script Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenMacroModal();
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-teal-900/80 to-emerald-900/80 hover:from-teal-800 hover:to-emerald-800 text-teal-200 border border-teal-500/40 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow transition"
          >
            <Terminal className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Script Auto PC</span>
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse hidden sm:inline" />
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              sound.playClick();
              if (window.confirm('Khôi phục lại kho đồ và số dư BP mặc định?')) {
                onResetData();
              }
            }}
            title="Khôi phục trạng thái ban đầu"
            className="p-2 rounded-lg bg-[#141d27] border border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

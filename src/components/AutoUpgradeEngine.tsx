import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, CheckCircle, XCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import {
  PlayerCard,
  FodderPriceItem,
  findCheapestFodderCombination,
  simulateUpgradeAttempt,
  formatBp,
  UpgradeStepResult
} from '../utils/fcRules';
import { getCardValueByLevel } from '../data/mockDatabase';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface AutoUpgradeEngineProps {
  card: PlayerCard;
  marketPrices: FodderPriceItem[];
  bpBalance: number;
  useProtection: boolean;
  boostPct: number;
  onUpdateCardLevel: (newLevel: number) => void;
  onDeductBp: (amount: number) => boolean;
}

export const AutoUpgradeEngine: React.FC<AutoUpgradeEngineProps> = ({
  card,
  marketPrices,
  bpBalance,
  useProtection,
  boostPct,
  onUpdateCardLevel,
  onDeductBp,
}) => {
  const [targetLevel, setTargetLevel] = useState<number>(5);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(600); // 600ms, 200ms
  const [history, setHistory] = useState<UpgradeStepResult[]>([]);
  const [stats, setStats] = useState({
    attempts: 0,
    successes: 0,
    fails: 0,
    totalSpentBp: 0,
  });

  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  const currentCardLevelRef = useRef(card.level);
  currentCardLevelRef.current = card.level;

  const initialCardPrice = getCardValueByLevel(card.marketPriceBp, 1);
  const currentCardPrice = getCardValueByLevel(card.marketPriceBp, card.level);
  const netProfit = currentCardPrice - (initialCardPrice + stats.totalSpentBp);

  // Trigger one upgrade step
  const executeSingleUpgrade = () => {
    const curLevel = currentCardLevelRef.current;
    if (curLevel >= targetLevel) {
      setIsRunning(false);
      sound.playSuccess();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      return false;
    }

    // Find optimal fodder for this card's current OVR
    const currentOvr = card.ovr + (curLevel - 1);
    const optimal = findCheapestFodderCombination(currentOvr, marketPrices, 5.0);
    const cost = optimal?.totalCostBp || 2500000;

    // Check balance
    const canAfford = onDeductBp(cost);
    if (!canAfford) {
      setIsRunning(false);
      alert('Không đủ số dư BP để tiếp tục Auto Ép Thẻ! Vui lòng nạp thêm BP.');
      return false;
    }

    const res = simulateUpgradeAttempt(curLevel, 5.0, useProtection, boostPct);

    // Update state
    onUpdateCardLevel(res.newLevel);

    const stepResult: UpgradeStepResult = {
      previousLevel: curLevel,
      newLevel: res.newLevel,
      success: res.success,
      costBp: cost,
      barsUsed: 5.0,
      successRate: res.successRate,
      restored: res.restored,
      timestamp: Date.now(),
    };

    setHistory((prev) => [stepResult, ...prev.slice(0, 49)]);
    setStats((prev) => ({
      attempts: prev.attempts + 1,
      successes: prev.successes + (res.success ? 1 : 0),
      fails: prev.fails + (res.success ? 0 : 1),
      totalSpentBp: prev.totalSpentBp + cost,
    }));

    if (res.success) {
      if (res.newLevel >= targetLevel) {
        sound.playSuccess();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    }

    return true;
  };

  // Run the loop when isRunning is active
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        if (!isRunningRef.current) return;
        const cont = executeSingleUpgrade();
        if (!cont) {
          setIsRunning(false);
        }
      }, speedMs);
    }
    return () => clearInterval(timer);
  }, [isRunning, speedMs, targetLevel]);

  // Monte Carlo fast batch simulation (e.g. 50 attempts)
  const runBatchSimulation = (count = 50) => {
    sound.playClick();
    let curLevel = card.level;
    let spent = 0;
    let succ = 0;
    let fl = 0;
    const newSteps: UpgradeStepResult[] = [];

    for (let i = 0; i < count; i++) {
      if (curLevel >= targetLevel) break;

      const currentOvr = card.ovr + (curLevel - 1);
      const optimal = findCheapestFodderCombination(currentOvr, marketPrices, 5.0);
      const cost = optimal?.totalCostBp || 2500000;

      if (bpBalance < spent + cost) break;
      spent += cost;

      const res = simulateUpgradeAttempt(curLevel, 5.0, useProtection, boostPct);
      newSteps.push({
        previousLevel: curLevel,
        newLevel: res.newLevel,
        success: res.success,
        costBp: cost,
        barsUsed: 5.0,
        successRate: res.successRate,
        restored: res.restored,
        timestamp: Date.now() + i,
      });

      if (res.success) {
        succ++;
      } else {
        fl++;
      }
      curLevel = res.newLevel;
    }

    onDeductBp(spent);
    onUpdateCardLevel(curLevel);

    setHistory((prev) => [...newSteps.reverse(), ...prev].slice(0, 50));
    setStats((prev) => ({
      attempts: prev.attempts + succ + fl,
      successes: prev.successes + succ,
      fails: prev.fails + fl,
      totalSpentBp: prev.totalSpentBp + spent,
    }));

    if (curLevel >= targetLevel) {
      sound.playSuccess();
      confetti({ particleCount: 150, spread: 90 });
    }
  };

  const resetStats = () => {
    setStats({ attempts: 0, successes: 0, fails: 0, totalSpentBp: 0 });
    setHistory([]);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d141d]/90 border border-emerald-900/30 rounded-xl overflow-hidden shadow-xl p-4 space-y-4">
      {/* Target Level & Control Bar */}
      <div className="bg-[#0b1016] border border-emerald-500/30 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] text-zinc-400">Mục tiêu cấp thẻ cần đạt:</span>
            <div className="flex items-center gap-1.5 mt-1">
              {[2, 3, 4, 5, 6, 7, 8].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    sound.playClick();
                    setTargetLevel(lvl);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition ${
                    targetLevel === lvl
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-md'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  +{lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Speed Controls & Auto Start Button */}
        <div className="flex items-center gap-2">
          <select
            value={speedMs}
            onChange={(e) => setSpeedMs(Number(e.target.value))}
            className="bg-[#15202c] border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200"
          >
            <option value={800}>Tốc độ: Chuẩn (0.8s)</option>
            <option value={300}>Tốc độ: Nhanh (0.3s)</option>
            <option value={100}>Tốc độ: Siêu tốc (0.1s)</option>
          </select>

          <button
            onClick={() => {
              sound.playClick();
              setIsRunning(!isRunning);
            }}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt đầu Auto Ép Thẻ</span>
              </>
            )}
          </button>

          <button
            onClick={() => runBatchSimulation(20)}
            className="bg-[#172433] hover:bg-[#203144] border border-emerald-600/40 text-emerald-300 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            title="Thực hiện ngay 20 lượt nâng cấp liên tiếp"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Mô phỏng 20x</span>
          </button>
        </div>
      </div>

      {/* Real-time KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-[#121c27] p-2.5 rounded-lg border border-zinc-800">
          <span className="text-[10px] text-zinc-400">Số lần thử:</span>
          <div className="text-sm font-bold text-white font-mono mt-0.5">
            {stats.attempts} <span className="text-[10px] text-zinc-500 font-normal">({stats.successes}✓ / {stats.fails}✗)</span>
          </div>
        </div>

        <div className="bg-[#121c27] p-2.5 rounded-lg border border-zinc-800">
          <span className="text-[10px] text-zinc-400">Tỷ lệ thành công:</span>
          <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
            {stats.attempts > 0 ? ((stats.successes / stats.attempts) * 100).toFixed(1) : '0.0'}%
          </div>
        </div>

        <div className="bg-[#121c27] p-2.5 rounded-lg border border-zinc-800">
          <span className="text-[10px] text-zinc-400">Tổng BP đã chi:</span>
          <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">
            {formatBp(stats.totalSpentBp)}
          </div>
        </div>

        <div className="bg-[#121c27] p-2.5 rounded-lg border border-zinc-800">
          <span className="text-[10px] text-zinc-400">Lãi / Lỗ ròng (P&L):</span>
          <div className={`text-sm font-bold font-mono mt-0.5 flex items-center gap-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netProfit >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{netProfit >= 0 ? '+' : ''}{formatBp(netProfit)}</span>
          </div>
        </div>
      </div>

      {/* Execution Log stream */}
      <div className="flex-1 flex flex-col bg-[#090e15] border border-zinc-800 rounded-xl overflow-hidden min-h-[220px]">
        <div className="p-2.5 bg-[#0e1722] border-b border-zinc-800 flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nhật Ký Thao Tác Ép Thẻ (Live Log)</span>
          </span>
          {history.length > 0 && (
            <button
              onClick={resetStats}
              className="text-[10px] text-zinc-400 hover:text-zinc-200 underline"
            >
              Xóa lịch sử
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-56">
          {history.map((h, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono border ${
                h.success
                  ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-900/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {h.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="font-bold">
                  +{h.previousLevel} → +{h.newLevel}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-sans ${h.success ? 'bg-emerald-900 text-emerald-300' : 'bg-rose-900 text-rose-300'}`}>
                  {h.success ? 'THÀNH CÔNG' : h.restored ? 'XỊT (CÓ BẢO HIỂM)' : 'THẤT BẠI'}
                </span>
                <span className="text-[10px] text-zinc-500 font-sans">
                  ({h.successRate}% rate)
                </span>
              </div>

              <div className="text-zinc-400 text-[11px]">
                -{formatBp(h.costBp)}
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div className="h-40 flex flex-col items-center justify-center text-zinc-500 text-xs text-center p-4">
              <p>Chưa có thao tác nào.</p>
              <p className="text-[11px] text-zinc-600 mt-1">
                Bấm &quot;Bắt đầu Auto Ép Thẻ&quot; để công cụ tự động mua phôi và thực hiện ép thẻ liên tục tới khi đạt mục tiêu!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

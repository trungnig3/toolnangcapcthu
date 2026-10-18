import { useState } from 'react';
import { Shield, Sparkles, ArrowRight, RotateCcw, Wrench } from 'lucide-react';
import { Header } from './components/Header';
import { PlayerCardView } from './components/PlayerCardView';
import { GaugeSection } from './components/GaugeSection';
import { FodderSlots } from './components/FodderSlots';
import { InventoryTable } from './components/InventoryTable';
import { FodderOptimizerTab } from './components/FodderOptimizerTab';
import { AutoUpgradeEngine } from './components/AutoUpgradeEngine';
import { UpgradeAnimationModal } from './components/UpgradeAnimationModal';
import { MacroGeneratorModal } from './components/MacroGeneratorModal';

import {
  INITIAL_TARGET_PLAYERS,
  INITIAL_INVENTORY,
  DEFAULT_FODDER_PRICES,
  InventoryCard
} from './data/mockDatabase';
import {
  PlayerCard,
  FodderPriceItem,
  calculateTotalBars,
  calculateSuccessRate,
  findCheapestFodderCombination,
  simulateUpgradeAttempt,
  formatBp
} from './utils/fcRules';
import { sound } from './utils/soundEffects';

export default function App() {
  // Application State
  const [targetCards, setTargetCards] = useState<PlayerCard[]>(INITIAL_TARGET_PLAYERS);
  const [selectedCardId, setSelectedCardId] = useState<string>('rudiger-eac');
  const [inventory, setInventory] = useState<InventoryCard[]>(INITIAL_INVENTORY);
  const [selectedFodderIds, setSelectedFodderIds] = useState<string[]>([]);
  const [marketPrices, setMarketPrices] = useState<FodderPriceItem[]>(DEFAULT_FODDER_PRICES);

  // Upgrade settings
  const [boostPct, setBoostPct] = useState<number>(0);
  const [useProtection, setUseProtection] = useState<boolean>(false);
  const [bpBalance, setBpBalance] = useState<number>(2289000000); // 2.289M BP as shown in user screenshot (using 2.289B for ample simulation!)
  const [restorePoints, setRestorePoints] = useState<number>(3); // N.Cấp lại
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active right tab: 'inventory' | 'optimizer' | 'auto_engine'
  const [activeTab, setActiveTab] = useState<'inventory' | 'optimizer' | 'auto_engine'>('inventory');

  // Modal states
  const [macroModalOpen, setMacroModalOpen] = useState<boolean>(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [lastUpgradeResult, setLastUpgradeResult] = useState<{
    previousLevel: number;
    success: boolean;
    newLevel: number;
    successRate: number;
    restored: boolean;
    costBp: number;
  }>({
    previousLevel: 1,
    success: true,
    newLevel: 2,
    successRate: 100,
    restored: false,
    costBp: 0,
  });

  const currentTargetCard = targetCards.find((c) => c.id === selectedCardId) || targetCards[0];
  const targetCurrentOvr = currentTargetCard.ovr + (currentTargetCard.level - 1);

  // Selected fodder objects
  const selectedFodders = selectedFodderIds
    .map((id) => inventory.find((item) => item.id === id))
    .filter((item): item is InventoryCard => item !== undefined);

  // Calculate current filled bars
  const totalBars = calculateTotalBars(
    targetCurrentOvr,
    selectedFodders.map((f) => f.ovr)
  );

  const totalSelectedCost = selectedFodders.reduce((sum, f) => sum + f.priceBp, 0);

  // Handlers
  const handleToggleFodder = (card: InventoryCard) => {
    if (selectedFodderIds.includes(card.id)) {
      setSelectedFodderIds(selectedFodderIds.filter((id) => id !== card.id));
    } else {
      if (selectedFodderIds.length >= 5) {
        alert('Chỉ có thể chọn tối đa 5 cầu thủ phôi!');
        return;
      }
      setSelectedFodderIds([...selectedFodderIds, card.id]);
    }
  };

  const handleRemoveFodderSlot = (index: number) => {
    const newIds = [...selectedFodderIds];
    newIds.splice(index, 1);
    setSelectedFodderIds(newIds);
  };

  const handleClearAllFodders = () => {
    setSelectedFodderIds([]);
  };

  // Auto Fodder Optimizer: automatically find and pick cheapest combination to fill 5 bars
  const handleAutoOptimizeFodders = () => {
    const optimal = findCheapestFodderCombination(targetCurrentOvr, marketPrices, 5.0);
    if (!optimal) {
      alert('Không tìm thấy phôi phù hợp trên thị trường!');
      return;
    }

    // Generate new mock inventory items if needed or pick best from available
    const newInventory = [...inventory];
    const newSelectedIds: string[] = [];

    optimal.fodders.forEach((f) => {
      for (let i = 0; i < f.count; i++) {
        // Try to find available in inventory
        const existing = newInventory.find(
          (inv) => inv.ovr === f.ovr && !newSelectedIds.includes(inv.id)
        );
        if (existing) {
          newSelectedIds.push(existing.id);
        } else {
          // Add from market
          const newId = `market-opt-${f.ovr}-${Date.now()}-${i}`;
          const newCard: InventoryCard = {
            id: newId,
            name: `Phôi OVR ${f.ovr} (TTCN)`,
            ovr: f.ovr,
            level: 1,
            position: 'CB',
            season: 'WG',
            seasonBadge: 'WG',
            priceBp: f.unitCost,
            staminaBars: 5,
          };
          newInventory.push(newCard);
          newSelectedIds.push(newId);
        }
      }
    });

    setInventory(newInventory);
    setSelectedFodderIds(newSelectedIds.slice(0, 5));
    sound.playSuccess();
  };

  // Apply recipe from optimizer tab
  const handleApplyOptimalRecipe = (
    fodderList: { ovr: number; count: number; unitCost: number }[]
  ) => {
    const newInventory = [...inventory];
    const newSelectedIds: string[] = [];

    fodderList.forEach((f) => {
      for (let i = 0; i < f.count; i++) {
        const newId = `recipe-${f.ovr}-${Date.now()}-${i}`;
        const newCard: InventoryCard = {
          id: newId,
          name: `Phôi OVR ${f.ovr}`,
          ovr: f.ovr,
          level: 1,
          position: 'CB',
          season: 'WG',
          seasonBadge: 'WG',
          priceBp: f.unitCost,
          staminaBars: 5,
        };
        newInventory.push(newCard);
        newSelectedIds.push(newId);
      }
    });

    setInventory(newInventory);
    setSelectedFodderIds(newSelectedIds.slice(0, 5));
    setActiveTab('inventory');
  };

  // Manual Upgrade Attempt
  const handleStartManualUpgrade = () => {
    if (selectedFodders.length === 0) {
      alert('Vui lòng chọn ít nhất 1 phôi nâng cấp hoặc bấm "Lọc phôi rẻ nhất"!');
      return;
    }

    if (bpBalance < totalSelectedCost) {
      alert('Số dư BP không đủ! Vui lòng nạp thêm BP.');
      return;
    }

    // Deduct cost and remove used fodders
    setBpBalance((prev) => prev - totalSelectedCost);
    setInventory((prev) => prev.filter((item) => !selectedFodderIds.includes(item.id)));
    setSelectedFodderIds([]);

    const result = simulateUpgradeAttempt(
      currentTargetCard.level,
      totalBars,
      useProtection,
      boostPct
    );

    // Update target card level
    setTargetCards((prev) =>
      prev.map((c) =>
        c.id === currentTargetCard.id ? { ...c, level: result.newLevel } : c
      )
    );

    setLastUpgradeResult({
      previousLevel: currentTargetCard.level,
      success: result.success,
      newLevel: result.newLevel,
      successRate: result.successRate,
      restored: result.restored,
      costBp: totalSelectedCost,
    });

    setUpgradeModalOpen(true);
  };

  const handleUpdatePrice = (ovr: number, newPrice: number) => {
    setMarketPrices((prev) =>
      prev.map((p) => (p.ovr === ovr ? { ...p, costBp: newPrice } : p))
    );
  };

  const handleResetPrices = () => {
    setMarketPrices(DEFAULT_FODDER_PRICES);
  };

  const handleQuickAddFodderCards = () => {
    const additional: InventoryCard[] = [
      {
        id: `extra-1-${Date.now()}`,
        name: 'Casemiro',
        ovr: 120,
        level: 3,
        position: 'CDM',
        season: 'WG',
        seasonBadge: 'WG',
        priceBp: 2380000,
        staminaBars: 5,
      },
      {
        id: `extra-2-${Date.now()}`,
        name: 'Thiago Silva',
        ovr: 121,
        level: 3,
        position: 'CB',
        season: 'WG',
        seasonBadge: 'WG',
        priceBp: 3290000,
        staminaBars: 5,
      },
      {
        id: `extra-3-${Date.now()}`,
        name: 'M. Rashford',
        ovr: 119,
        level: 2,
        position: 'ST',
        season: 'WG',
        seasonBadge: 'WG',
        priceBp: 2100000,
        staminaBars: 5,
      },
    ];
    setInventory((prev) => [...additional, ...prev]);
  };

  const handleResetData = () => {
    setTargetCards(INITIAL_TARGET_PLAYERS);
    setInventory(INITIAL_INVENTORY);
    setSelectedFodderIds([]);
    setBpBalance(2289000000);
    setRestorePoints(3);
    setMarketPrices(DEFAULT_FODDER_PRICES);
  };

  const successRate = calculateSuccessRate(
    currentTargetCard.level + 1,
    totalBars,
    boostPct
  );

  return (
    <div className="min-h-screen bg-[#070b10] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black relative overflow-x-hidden">
      {/* Stadium Pitch Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.25) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(13, 148, 136, 0.2) 0%, transparent 50%),
            linear-gradient(rgba(10, 16, 24, 0.85) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10, 16, 24, 0.85) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
        }}
      />

      {/* App Header */}
      <Header
        bpBalance={bpBalance}
        onAddBp={(amount) => setBpBalance((prev) => prev + amount)}
        onResetData={handleResetData}
        onOpenMacroModal={() => setMacroModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          setSoundEnabled(!soundEnabled);
          sound.enabled = !soundEnabled;
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 z-10 flex flex-col gap-4">
        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Target Player Card & Upgrade Gauge Controls (4 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-4">
            {/* Card Display & Switcher */}
            <PlayerCardView
              card={currentTargetCard}
              allCards={targetCards}
              onSelectCard={(c) => {
                sound.playClick();
                setSelectedCardId(c.id);
                setSelectedFodderIds([]);
              }}
            />

            {/* 5-bar Gauge & Probability */}
            <GaugeSection
              currentLevel={currentTargetCard.level}
              totalBars={totalBars}
              boostPct={boostPct}
              onSetBoostPct={setBoostPct}
              useProtection={useProtection}
              onToggleProtection={setUseProtection}
            />

            {/* Fodder Slots (0/5) */}
            <FodderSlots
              selectedFodders={selectedFodders}
              targetOvr={targetCurrentOvr}
              onRemoveFodder={handleRemoveFodderSlot}
              onClearAll={handleClearAllFodders}
              onAutoOptimize={handleAutoOptimizeFodders}
            />
          </div>

          {/* RIGHT COLUMN: Tabs (Inventory, Optimizer, Auto Engine) (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-[600px] space-y-3">
            {/* Tab Navigation matching FC Online */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('inventory');
                  }}
                  className={`px-3 py-2 text-xs sm:text-sm font-bold transition rounded-t-lg flex items-center gap-2 cursor-pointer ${
                    activeTab === 'inventory'
                      ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>Cầu thủ đang sở hữu</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">
                    {inventory.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('optimizer');
                  }}
                  className={`px-3 py-2 text-xs sm:text-sm font-bold transition rounded-t-lg flex items-center gap-2 cursor-pointer ${
                    activeTab === 'optimizer'
                      ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Bộ Lọc Giá Phôi TTCN</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('auto_engine');
                  }}
                  className={`px-3 py-2 text-xs sm:text-sm font-bold transition rounded-t-lg flex items-center gap-2 cursor-pointer ${
                    activeTab === 'auto_engine'
                      ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span>Auto Ép Hàng Loạt</span>
                </button>
              </div>

              {/* Status Indicator */}
              <div className="text-right text-[11px] text-zinc-500 hidden sm:block">
                <span>Chỉ số OVR mục tiêu: </span>
                <strong className="text-white font-mono">{targetCurrentOvr}</strong>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1">
              {activeTab === 'inventory' && (
                <InventoryTable
                  inventory={inventory}
                  selectedFodderIds={selectedFodderIds}
                  targetOvr={targetCurrentOvr}
                  onToggleFodder={handleToggleFodder}
                  onQuickAddCards={handleQuickAddFodderCards}
                />
              )}

              {activeTab === 'optimizer' && (
                <FodderOptimizerTab
                  targetOvr={targetCurrentOvr}
                  prices={marketPrices}
                  onUpdatePrice={handleUpdatePrice}
                  onResetPrices={handleResetPrices}
                  onApplyOptimalRecipe={handleApplyOptimalRecipe}
                />
              )}

              {activeTab === 'auto_engine' && (
                <AutoUpgradeEngine
                  card={currentTargetCard}
                  marketPrices={marketPrices}
                  bpBalance={bpBalance}
                  useProtection={useProtection}
                  boostPct={boostPct}
                  onUpdateCardLevel={(newLevel) => {
                    setTargetCards((prev) =>
                      prev.map((c) =>
                        c.id === currentTargetCard.id ? { ...c, level: newLevel } : c
                      )
                    );
                  }}
                  onDeductBp={(amount) => {
                    if (bpBalance >= amount) {
                      setBpBalance((prev) => prev - amount);
                      return true;
                    }
                    return false;
                  }}
                />
              )}
            </div>

            {/* Bottom In-game Action Bar (Modeled after FC Online screenshot) */}
            <div className="bg-[#0b1016]/95 border border-emerald-900/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                {/* Bảo vệ nâng cấp indicator */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setUseProtection(!useProtection);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                    useProtection
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-zinc-900 border-zinc-700/60 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Bảo vệ nâng cấp</span>
                </button>

                {/* Điểm N.Cấp lại */}
                <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-zinc-400">N.Cấp lại:</span>
                  <span className="font-mono font-bold text-emerald-400">{restorePoints}</span>
                </div>
              </div>

              {/* Upgrade Trigger Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    handleAutoOptimizeFodders();
                  }}
                  className="bg-[#14202d] hover:bg-[#1a2b3d] border border-emerald-600/50 text-emerald-300 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Tìm và lắp ngay 5 phôi rẻ nhất"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tự động lọc 5 phôi rẻ</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    handleStartManualUpgrade();
                  }}
                  disabled={selectedFodders.length === 0}
                  className={`px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg transition cursor-pointer ${
                    selectedFodders.length > 0
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-black hover:brightness-110 shadow-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                  }`}
                >
                  <span>Tiếp theo</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upgrade Animation Modal */}
      <UpgradeAnimationModal
        isOpen={upgradeModalOpen}
        card={currentTargetCard}
        previousLevel={lastUpgradeResult.previousLevel}
        success={lastUpgradeResult.success}
        newLevel={lastUpgradeResult.newLevel}
        successRate={lastUpgradeResult.successRate}
        restored={lastUpgradeResult.restored}
        costBp={lastUpgradeResult.costBp}
        onClose={() => setUpgradeModalOpen(false)}
        onRetry={() => {
          setUpgradeModalOpen(false);
          handleAutoOptimizeFodders();
        }}
      />

      {/* PC Python Macro Modal */}
      <MacroGeneratorModal
        isOpen={macroModalOpen}
        onClose={() => setMacroModalOpen(false)}
      />

      {/* Bottom Game Navigation Bar (Faithfully inspired by FC Online footer) */}
      <footer className="bg-[#080c12] border-t border-zinc-900 py-2 px-4 text-[11px] text-zinc-500 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-4">
          <span className="hover:text-emerald-400 cursor-pointer">● Quản lý CT</span>
          <span className="hover:text-emerald-400 cursor-pointer">● Trung tâm nhiệm vụ</span>
          <span className="hover:text-emerald-400 cursor-pointer">● TTCN</span>
          <span className="hover:text-emerald-400 cursor-pointer">● Shop</span>
          <span className="text-emerald-400 font-semibold">● Nâng cấp cầu thủ (Đang mở)</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Tỷ lệ chuẩn FC Online Season 2024-2026</span>
          <span className="text-zinc-600">|</span>
          <span className="text-emerald-400 font-mono">1920 x 1080 Calibrated</span>
        </div>
      </footer>
    </div>
  );
}

/**
 * FC Online Card Upgrade Rules, Calculations and Solvers
 */

export interface FodderPriceItem {
  ovr: number;
  costBp: number; // in BP (e.g. 2400000 = 2.4M)
  suggestedName?: string;
  season?: string;
}

export interface PlayerCard {
  id: string;
  name: string;
  ovr: number; // Base OVR at +1
  level: number; // 1 to 10
  position: string;
  season: string;
  avatarUrl?: string;
  marketPriceBp: number;
}

export const BASE_SUCCESS_RATES: Record<number, number> = {
  2: 1.0,   // +1 -> +2: 100% at 5 bars
  3: 0.81,  // +2 -> +3: 81%
  4: 0.64,  // +3 -> +4: 64%
  5: 0.50,  // +4 -> +5: 50%
  6: 0.26,  // +5 -> +6: 26%
  7: 0.15,  // +6 -> +7: 15%
  8: 0.07,  // +7 -> +8: 7%
  9: 0.035, // +8 -> +9: 3.5%
  10: 0.015 // +9 -> +10: 1.5%
};

/**
 * Calculates how many bars (0.0 to 2.0) a single fodder card gives toward the 5-bar gauge
 * based on OVR difference.
 */
export function calculateFodderBar(targetOvr: number, fodderOvr: number): number {
  const diff = fodderOvr - targetOvr;
  if (diff >= 4) return 2.0;
  if (diff === 3) return 1.85;
  if (diff === 2) return 1.5;
  if (diff === 1) return 1.25;
  if (diff === 0) return 1.0;
  if (diff === -1) return 0.75;
  if (diff === -2) return 0.5;
  if (diff === -3) return 0.25;
  if (diff === -4) return 0.12;
  return 0.05;
}

/**
 * Total filled bars from a list of up to 5 fodder cards (capped at 5.0)
 */
export function calculateTotalBars(targetOvr: number, fodderOvrs: number[]): number {
  const selected = fodderOvrs.slice(0, 5);
  const total = selected.reduce((sum, ovr) => sum + calculateFodderBar(targetOvr, ovr), 0);
  return Math.min(5.0, Number(total.toFixed(2)));
}

/**
 * Calculate final success rate percentage (0 - 100%)
 */
export function calculateSuccessRate(
  targetLevel: number, // Target level, e.g., 2 for +1 -> +2
  filledBars: number,
  boostBonusPct = 0 // e.g. 10 for +10% booster
): number {
  const baseRate = BASE_SUCCESS_RATES[targetLevel] ?? 0.01;
  const barFactor = Math.min(1.0, filledBars / 5.0);
  const rawRate = baseRate * barFactor;
  const withBoost = rawRate * (1 + boostBonusPct / 100);
  return Math.min(100, Number((withBoost * 100).toFixed(1)));
}

export interface FodderCombination {
  fodders: { ovr: number; count: number; unitCost: number; barsPerCard: number }[];
  totalBars: number;
  totalCostBp: number;
  totalCards: number;
  targetOvr: number;
  naiveCostBp: number;
  savedBp: number;
}

/**
 * Solves the cheapest combination of up to 5 fodder cards to reach at least requiredBars (default 5.0).
 */
export function findCheapestFodderCombination(
  targetOvr: number,
  availablePrices: FodderPriceItem[],
  requiredBars = 5.0
): FodderCombination | null {
  // Filter prices to relevant range [-4 to +4] of targetOvr
  const candidates = availablePrices
    .filter(p => p.ovr >= targetOvr - 4 && p.ovr <= targetOvr + 4 && p.costBp > 0)
    .sort((a, b) => a.costBp - b.costBp);

  if (candidates.length === 0) return null;

  let bestCombination: number[] | null = null;
  let minCost = Infinity;

  // Search combinations with 1 to 5 cards (with repetition)
  const candidateOvrs = candidates.map(c => c.ovr);
  const priceMap = new Map<number, number>();
  candidates.forEach(c => priceMap.set(c.ovr, c.costBp));

  // Branch and bound search for k = 1..5
  function search(currentCombo: number[], startIdx: number, currentBars: number, currentCost: number) {
    if (currentBars >= requiredBars) {
      if (currentCost < minCost) {
        minCost = currentCost;
        bestCombination = [...currentCombo];
      }
      return;
    }

    if (currentCombo.length === 5) {
      // If 5 cards but very close (e.g. >= 4.95), count as filled
      if (currentBars >= requiredBars - 0.05 && currentCost < minCost) {
        minCost = currentCost;
        bestCombination = [...currentCombo];
      }
      return;
    }

    if (currentCost >= minCost) return;

    for (let i = startIdx; i < candidateOvrs.length; i++) {
      const ovr = candidateOvrs[i];
      const cost = priceMap.get(ovr) || 0;
      const bar = calculateFodderBar(targetOvr, ovr);

      // Prune if even adding max possible bars for remaining cards cannot reach target
      const remainingSlots = 5 - (currentCombo.length + 1);
      if (currentBars + bar + remainingSlots * 2.0 < requiredBars - 0.05) {
        continue;
      }

      search([...currentCombo, ovr], i, currentBars + bar, currentCost + cost);
    }
  }

  search([], 0, 0, 0);

  // If no combination reached exactly 5 bars, pick the one with maximum bars at lowest cost
  if (!bestCombination) {
    // Fallback: 5 cards of targetOvr
    const naiveOvr = targetOvr;
    const naiveUnit = priceMap.get(naiveOvr) ?? candidates[0].costBp;
    bestCombination = [naiveOvr, naiveOvr, naiveOvr, naiveOvr, naiveOvr];
    minCost = naiveUnit * 5;
  }

  // Count instances
  const counts = new Map<number, number>();
  bestCombination.forEach(ovr => counts.set(ovr, (counts.get(ovr) || 0) + 1));

  const fodders = Array.from(counts.entries()).map(([ovr, count]) => ({
    ovr,
    count,
    unitCost: priceMap.get(ovr) || 0,
    barsPerCard: calculateFodderBar(targetOvr, ovr)
  }));

  const totalBars = calculateTotalBars(targetOvr, bestCombination);
  const naiveUnitCost = priceMap.get(targetOvr) || candidates[0].costBp;
  const naiveCostBp = naiveUnitCost * 5;
  const savedBp = Math.max(0, naiveCostBp - minCost);

  return {
    fodders,
    totalBars,
    totalCostBp: minCost,
    totalCards: bestCombination.length,
    targetOvr,
    naiveCostBp,
    savedBp
  };
}

/**
 * Upgrades simulator step
 */
export interface UpgradeStepResult {
  previousLevel: number;
  newLevel: number;
  success: boolean;
  costBp: number;
  barsUsed: number;
  successRate: number;
  restored: boolean;
  timestamp: number;
}

export function simulateUpgradeAttempt(
  currentLevel: number,
  filledBars: number,
  useProtection = false,
  boostPct = 0
): { success: boolean; newLevel: number; successRate: number; restored: boolean } {
  const targetLevel = currentLevel + 1;
  const rate = calculateSuccessRate(targetLevel, filledBars, boostPct);
  const roll = Math.random() * 100;
  const success = roll <= rate;

  if (success) {
    return {
      success: true,
      newLevel: targetLevel,
      successRate: rate,
      restored: false
    };
  }

  // Failed upgrade
  let newLevel = 1;
  let restored = false;

  if (useProtection) {
    // Protection prevents losing more than 1 level, or maintains same level
    if (Math.random() < 0.6) {
      newLevel = currentLevel; // Retained
      restored = true;
    } else {
      newLevel = Math.max(1, currentLevel - 1);
      restored = true;
    }
  } else {
    // Normal fail penalty in FC Online:
    // +1 -> +2 fail: stays +1
    // +2 -> +3 fail: drops to +1 or +2 (50/50)
    // +3 -> +4 fail: drops to +1, +2, or +3
    // +4 -> +5 fail: drops to +1, +2, or +3
    // +5+ fail: drops to +1 or +2 or +3
    if (currentLevel === 1) {
      newLevel = 1;
    } else if (currentLevel === 2) {
      newLevel = Math.random() < 0.5 ? 2 : 1;
    } else if (currentLevel === 3) {
      const r = Math.random();
      newLevel = r < 0.3 ? 3 : (r < 0.7 ? 2 : 1);
    } else if (currentLevel === 4) {
      const r = Math.random();
      newLevel = r < 0.25 ? 3 : (r < 0.65 ? 2 : 1);
    } else {
      const r = Math.random();
      newLevel = r < 0.2 ? currentLevel - 1 : (r < 0.5 ? 2 : 1);
    }
  }

  return {
    success: false,
    newLevel,
    successRate: rate,
    restored
  };
}

/**
 * Format BP currency nicely (e.g., 2.38M, 1.45B, 50,000 BP)
 */
export function formatBp(bp: number): string {
  if (bp >= 1_000_000_000) {
    return (bp / 1_000_000_000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + 'B BP';
  }
  if (bp >= 1_000_000) {
    return (bp / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + 'M BP';
  }
  if (bp >= 1_000) {
    return (bp / 1_000).toFixed(0) + 'K BP';
  }
  return bp.toLocaleString('en-US') + ' BP';
}

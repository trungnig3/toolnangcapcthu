import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFodderBar,
  calculateTotalBars,
  calculateSuccessRate,
  findCheapestFodderCombination,
  simulateUpgradeAttempt,
  formatBp,
  type FodderPriceItem
} from './fcRules.ts';

test('calculateFodderBar returns correct bar weights by OVR difference', () => {
  assert.equal(calculateFodderBar(115, 115), 1.0); // same OVR = 1.0 bar
  assert.equal(calculateFodderBar(115, 116), 1.25); // +1 OVR = 1.25 bars
  assert.equal(calculateFodderBar(115, 117), 1.5); // +2 OVR = 1.5 bars
  assert.equal(calculateFodderBar(115, 114), 0.75); // -1 OVR = 0.75 bars
  assert.equal(calculateFodderBar(115, 113), 0.5); // -2 OVR = 0.5 bars
});

test('calculateTotalBars caps at 5.0 and handles up to 5 cards', () => {
  const bars = calculateTotalBars(115, [115, 115, 115, 115, 115]);
  assert.equal(bars, 5.0);

  const overflow = calculateTotalBars(115, [118, 118, 118, 118, 118]);
  assert.equal(overflow, 5.0); // should not exceed 5

  const partial = calculateTotalBars(115, [115, 114]);
  assert.equal(partial, 1.75);
});

test('calculateSuccessRate computes correct percentages with booster', () => {
  // +1 -> +2 with 5 bars: 100%
  assert.equal(calculateSuccessRate(2, 5.0), 100);
  // +1 -> +2 with 2.5 bars (half): 50%
  assert.equal(calculateSuccessRate(2, 2.5), 50);

  // +4 -> +5 with 5 bars: 50%
  assert.equal(calculateSuccessRate(5, 5.0), 50);
  // With 10% booster: 50% * 1.1 = 55%
  assert.equal(calculateSuccessRate(5, 5.0, 10), 55);
});

test('findCheapestFodderCombination identifies lowest cost combination', () => {
  const samplePrices: FodderPriceItem[] = [
    { ovr: 111, costBp: 500000 },
    { ovr: 112, costBp: 800000 },
    { ovr: 113, costBp: 1200000 },
    { ovr: 114, costBp: 1800000 },
    { ovr: 115, costBp: 2800000 },
    { ovr: 116, costBp: 4000000 },
    { ovr: 117, costBp: 6500000 },
  ];

  const result = findCheapestFodderCombination(115, samplePrices, 5.0);
  assert.ok(result);
  assert.ok(result.totalBars >= 4.95);
  assert.ok(result.totalCostBp > 0);
  assert.ok(result.totalCards <= 5);
});

test('simulateUpgradeAttempt returns valid result structure', () => {
  const result = simulateUpgradeAttempt(1, 5.0, false, 0);
  assert.equal(typeof result.success, 'boolean');
  // For +1 -> +2 at 5 bars, rate is 100% so it must succeed
  assert.equal(result.success, true);
  assert.equal(result.newLevel, 2);
});

test('formatBp formats numbers correctly', () => {
  assert.equal(formatBp(21300000), '21.3M BP');
  assert.equal(formatBp(2400000), '2.4M BP');
  assert.equal(formatBp(1500000000), '1.5B BP');
});

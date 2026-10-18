import { PlayerCard, FodderPriceItem } from '../utils/fcRules';

export interface InventoryCard {
  id: string;
  name: string;
  ovr: number;
  level: number;
  position: string;
  season: string;
  seasonBadge: string;
  priceBp: number;
  selected?: boolean;
  locked?: boolean;
  staminaBars?: number; // 4-5 green bars as seen in screenshot
  clubLogo?: string;
  nationFlag?: string;
  avatarUrl?: string;
}

// Initial Target Players you can upgrade
export const INITIAL_TARGET_PLAYERS: PlayerCard[] = [
  {
    id: 'rudiger-eac',
    name: 'A. Rüdiger',
    ovr: 115,
    level: 1,
    position: 'CB',
    season: 'EAC',
    avatarUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&auto=format&fit=crop&q=80',
    marketPriceBp: 21300000 // 21.3M as seen in user screenshot
  },
  {
    id: 'gullit-icon-tm',
    name: 'Ruud Gullit',
    ovr: 117,
    level: 1,
    position: 'CF',
    season: 'ICON TM',
    avatarUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&auto=format&fit=crop&q=80',
    marketPriceBp: 154000000
  },
  {
    id: 'ronaldo-r9-ln',
    name: 'Ronaldo Nazário',
    ovr: 116,
    level: 1,
    position: 'ST',
    season: 'LN',
    avatarUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=80',
    marketPriceBp: 98000000
  },
  {
    id: 'cr7-24ty',
    name: 'C. Ronaldo',
    ovr: 116,
    level: 1,
    position: 'ST',
    season: '24TY',
    avatarUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&auto=format&fit=crop&q=80',
    marketPriceBp: 125000000
  },
  {
    id: 'son-24ts',
    name: 'Son Heung-min',
    ovr: 115,
    level: 1,
    position: 'LW',
    season: '24TS',
    avatarUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&auto=format&fit=crop&q=80',
    marketPriceBp: 45000000
  },
  {
    id: 'bellingham-24ty',
    name: 'Jude Bellingham',
    ovr: 116,
    level: 1,
    position: 'CM',
    season: '24TY',
    avatarUrl: 'https://images.unsplash.com/photo-1489944445335-4378f4b9750f?w=400&auto=format&fit=crop&q=80',
    marketPriceBp: 89000000
  }
];

// Fodder Cards (Phôi trong kho đồ - derived right from the user screenshot)
export const INITIAL_INVENTORY: InventoryCard[] = [
  {
    id: 'inv-1',
    name: 'Lúcio',
    ovr: 121,
    level: 3,
    position: 'CB',
    season: 'WG',
    seasonBadge: 'WG',
    priceBp: 3290000,
    staminaBars: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'inv-2',
    name: 'M. Rogers',
    ovr: 120,
    level: 3,
    position: 'CAM',
    season: 'PTG',
    seasonBadge: 'PTG',
    priceBp: 2400000,
    staminaBars: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'inv-3',
    name: 'O. Bierhoff',
    ovr: 120,
    level: 1,
    position: 'ST',
    season: 'WG',
    seasonBadge: 'WG',
    priceBp: 2360000,
    staminaBars: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'inv-4',
    name: 'C. Marchisio',
    ovr: 120,
    level: 4,
    position: 'LM',
    season: 'WG',
    seasonBadge: 'WG',
    priceBp: 2900000,
    staminaBars: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'inv-5',
    name: 'Fernando Hierro',
    ovr: 120,
    level: 3,
    position: 'CDM',
    season: 'WG',
    seasonBadge: 'WG',
    priceBp: 2380000,
    staminaBars: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'inv-6',
    name: 'C. Dempsey',
    ovr: 120,
    level: 3,
    position: 'CF',
    season: 'WG',
    seasonBadge: 'WG',
    priceBp: 2380000,
    staminaBars: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1489944445335-4378f4b9750f?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'inv-7',
    name: 'V. Kompany',
    ovr: 120,
    level: 3,
    position: 'CB',
    season: 'WG',
    seasonBadge: 'WG',
    priceBp: 2380000,
    staminaBars: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'inv-8',
    name: 'H. Nakata',
    ovr: 120,
    level: 3,
    position: 'CAM',
    season: 'WG',
    seasonBadge: 'WG',
    priceBp: 2380000,
    staminaBars: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'inv-9',
    name: 'J. Zanetti',
    ovr: 120,
    level: 3,
    position: 'RWB',
    season: 'WG',
    seasonBadge: 'WG',
    priceBp: 2400000,
    staminaBars: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'inv-10',
    name: 'A. Rüdiger (Phôi)',
    ovr: 115,
    level: 1,
    position: 'CB',
    season: 'EAC',
    seasonBadge: 'EAC',
    priceBp: 21300000,
    staminaBars: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'inv-11',
    name: 'Gabriel Martinelli',
    ovr: 114,
    level: 2,
    position: 'LW',
    season: '23UCL',
    seasonBadge: '23UCL',
    priceBp: 1450000,
    staminaBars: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'inv-12',
    name: 'P. Zieliński',
    ovr: 113,
    level: 3,
    position: 'CM',
    season: 'CC',
    seasonBadge: 'CC',
    priceBp: 920000,
    staminaBars: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=150&auto=format&fit=crop&q=80'
  }
];

// Market Fodder Pricing (Giá phôi chuẩn trên TTCN FC Online)
export const DEFAULT_FODDER_PRICES: FodderPriceItem[] = [
  { ovr: 108, costBp: 150000, suggestedName: 'Phôi OVR 108 (BWC/SPL)' },
  { ovr: 109, costBp: 220000, suggestedName: 'Phôi OVR 109 (EBS/CAP)' },
  { ovr: 110, costBp: 320000, suggestedName: 'Phôi OVR 110 (22UCL/BTB)' },
  { ovr: 111, costBp: 480000, suggestedName: 'Phôi OVR 111 (LN/WC22)' },
  { ovr: 112, costBp: 650000, suggestedName: 'Phôi OVR 112 (BWC/HG)' },
  { ovr: 113, costBp: 920000, suggestedName: 'Phôi OVR 113 (CC/23UCL)' },
  { ovr: 114, costBp: 1450000, suggestedName: 'Phôi OVR 114 (DC/HG)' },
  { ovr: 115, costBp: 1950000, suggestedName: 'Phôi OVR 115 (EAC/CC)' },
  { ovr: 116, costBp: 2380000, suggestedName: 'Phôi OVR 116 (WG/23HW)' },
  { ovr: 117, costBp: 2800000, suggestedName: 'Phôi OVR 117 (WG/24EP)' },
  { ovr: 118, costBp: 3100000, suggestedName: 'Phôi OVR 118 (WG/PTG)' },
  { ovr: 119, costBp: 3400000, suggestedName: 'Phôi OVR 119 (WG/24TS)' },
  { ovr: 120, costBp: 2380000, suggestedName: 'Phôi OVR 120 (WG xả mạnh)' }, // WG +3 cards are cheap as seen in screenshot (2.38M)
  { ovr: 121, costBp: 3290000, suggestedName: 'Phôi OVR 121 (Lúcio WG)' },
  { ovr: 122, costBp: 5200000, suggestedName: 'Phôi OVR 122 (ICON/24TY)' },
  { ovr: 123, costBp: 8900000, suggestedName: 'Phôi OVR 123 (ICON/CU)' },
  { ovr: 124, costBp: 14500000, suggestedName: 'Phôi OVR 124 (24TY/ICON)' },
  { ovr: 125, costBp: 22000000, suggestedName: 'Phôi OVR 125 (ICON TM)' }
];

// Price multipliers for target card by level
export function getCardValueByLevel(basePrice: number, level: number): number {
  switch (level) {
    case 1: return basePrice;
    case 2: return Math.round(basePrice * 2.1);
    case 3: return Math.round(basePrice * 5.2);
    case 4: return Math.round(basePrice * 13.5);
    case 5: return Math.round(basePrice * 38.0);
    case 6: return Math.round(basePrice * 110.0);
    case 7: return Math.round(basePrice * 380.0);
    case 8: return Math.round(basePrice * 1500.0);
    case 9: return Math.round(basePrice * 6000.0);
    case 10: return Math.round(basePrice * 25000.0);
    default: return basePrice;
  }
}

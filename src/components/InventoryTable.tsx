import React, { useState } from 'react';
import { Search, Check, ShoppingCart, Lock } from 'lucide-react';
import { InventoryCard } from '../data/mockDatabase';
import { formatBp, calculateFodderBar } from '../utils/fcRules';
import { sound } from '../utils/soundEffects';

interface InventoryTableProps {
  inventory: InventoryCard[];
  selectedFodderIds: string[];
  targetOvr: number;
  onToggleFodder: (card: InventoryCard) => void;
  onQuickAddCards: () => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  selectedFodderIds,
  targetOvr,
  onToggleFodder,
  onQuickAddCards,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posFilter, setPosFilter] = useState('ALL');

  const filtered = inventory.filter((item) => {
    const matchName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPos = posFilter === 'ALL' || item.position === posFilter;
    return matchName && matchPos;
  });

  return (
    <div className="flex flex-col h-full bg-[#0d141d]/90 border border-emerald-900/30 rounded-xl overflow-hidden shadow-xl">
      {/* Top Filter and Search Bar */}
      <div className="p-3 border-b border-zinc-800 bg-[#090e15] flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên cầu thủ phôi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141c26] border border-zinc-700/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={posFilter}
            onChange={(e) => setPosFilter(e.target.value)}
            className="bg-[#141c26] border border-zinc-700/60 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Mọi vị trí</option>
            <option value="CB">Hậu vệ CB</option>
            <option value="CDM">Tiền vệ CDM</option>
            <option value="CAM">Tiền vệ CAM</option>
            <option value="LM">Cánh LM/LW</option>
            <option value="ST">Tiền đạo ST/CF</option>
          </select>

          <button
            onClick={() => {
              sound.playClick();
              onQuickAddCards();
            }}
            className="bg-[#192433] hover:bg-[#203044] text-emerald-400 border border-emerald-600/40 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Thêm các cầu thủ mẫu vào kho đồ"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Thêm phôi</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[460px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#0b1016] text-zinc-400 font-semibold border-b border-zinc-800 sticky top-0 z-10 text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Tăng</th>
              <th className="py-2.5 px-2">Vị trí</th>
              <th className="py-2.5 px-3">Tên cầu thủ</th>
              <th className="py-2.5 px-2 text-center">OVR</th>
              <th className="py-2.5 px-2 text-center">Thẻ</th>
              <th className="py-2.5 px-2 text-center">Khóa</th>
              <th className="py-2.5 px-3 text-right">Giá</th>
              <th className="py-2.5 px-3 text-center">Chọn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filtered.map((item) => {
              const isSelected = selectedFodderIds.includes(item.id);
              const bar = calculateFodderBar(targetOvr, item.ovr);
              return (
                <tr
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    onToggleFodder(item);
                  }}
                  className={`hover:bg-[#15202e] cursor-pointer transition ${isSelected ? 'bg-emerald-950/40 text-emerald-100' : 'text-zinc-300'}`}
                >
                  {/* Tăng (stamina bars) */}
                  <td className="py-2 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`w-1 h-3 rounded-xs ${i <= (item.staminaBars ?? 5) ? 'bg-emerald-400' : 'bg-zinc-700'}`}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Vị trí */}
                  <td className="py-2 px-2 whitespace-nowrap">
                    <span className="font-bold text-zinc-400">
                      {item.position}
                    </span>
                  </td>

                  {/* Tên cầu thủ & avatar */}
                  <td className="py-2 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                        <img
                          src={item.avatarUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-zinc-800 text-zinc-400 text-[10px] px-1 py-0.5 rounded font-mono border border-zinc-700">
                          {item.seasonBadge}
                        </span>
                        <span className="font-medium text-zinc-100">{item.name}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          (+{bar.toFixed(2)}v)
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* OVR */}
                  <td className="py-2 px-2 text-center whitespace-nowrap font-mono font-bold text-white">
                    {item.ovr}
                  </td>

                  {/* Thẻ (+1, +3, ...) */}
                  <td className="py-2 px-2 text-center whitespace-nowrap">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${item.level >= 5 ? 'bg-amber-400 text-amber-950' : item.level >= 3 ? 'bg-amber-800 text-amber-100' : 'bg-zinc-700 text-zinc-200'}`}>
                      {item.level}
                    </span>
                  </td>

                  {/* Khóa */}
                  <td className="py-2 px-2 text-center whitespace-nowrap">
                    {item.locked ? (
                      <Lock className="w-3.5 h-3.5 text-zinc-500 mx-auto" />
                    ) : (
                      <span className="text-zinc-600">-</span>
                    )}
                  </td>

                  {/* Giá BP */}
                  <td className="py-2 px-3 text-right whitespace-nowrap font-mono font-bold text-amber-300">
                    {formatBp(item.priceBp)}
                  </td>

                  {/* Chọn checkbox */}
                  <td className="py-2 px-3 text-center whitespace-nowrap">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center mx-auto transition ${isSelected ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-zinc-600 bg-zinc-800/80'}`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-500">
                  Không tìm thấy cầu thủ phôi phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-2.5 bg-[#090e15] border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
        <span>Tổng cộng: <strong className="text-zinc-200">{filtered.length}</strong> cầu thủ trong kho</span>
        <span className="text-emerald-400 font-semibold">
          Đã chọn: {selectedFodderIds.length}/5 phôi
        </span>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ShieldAlert, Cpu } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface MacroGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MacroGeneratorModal: React.FC<MacroGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [resolution] = useState('1920x1080');
  const [delayMs, setDelayMs] = useState(1200);

  if (!isOpen) return null;

  const pythonScript = `# ==============================================================================
# TOOL AUTO ÉP THẺ FC ONLINE - KỊCH BẢN PYTHON AUTO-CLICKER CHUYÊN NGHIỆP
# Tối ưu cho độ phân giải màn hình: ${resolution} (Full HD)
# Thư viện yêu cầu: pip install pyautogui keyboard opencv-python pywin32
# ==============================================================================

import time
import random
import keyboard
import pyautogui

# Tùy chỉnh an toàn chống ban/chống phát hiện thao tác máy móc
pyautogui.PAUSE = ${delayMs / 1000}
pyautogui.FAILSAFE = True  # Kéo chuột ra 4 góc màn hình để dừng khẩn cấp

# TỌA ĐỘ CHUẨN TRÊN MÀN HÌNH 1920x1080 THEO GIAO DIỆN FC ONLINE:
# (Khớp với giao diện nâng cấp cầu thủ trong ảnh chụp)
POS_SELECT_FODDER_CHECKBOX_1 = (1568, 368)  # Checkbox phôi số 1
POS_SELECT_FODDER_CHECKBOX_2 = (1568, 418)  # Checkbox phôi số 2
POS_SELECT_FODDER_CHECKBOX_3 = (1568, 468)  # Checkbox phôi số 3
POS_SELECT_FODDER_CHECKBOX_4 = (1568, 518)  # Checkbox phôi số 4
POS_SELECT_FODDER_CHECKBOX_5 = (1568, 568)  # Checkbox phôi số 5

POS_BTN_NEXT = (1520, 840)                 # Nút "Tiếp theo ->" (góc dưới bên phải)
POS_BTN_CONFIRM_UPGRADE = (960, 880)       # Nút "Bắt đầu nâng cấp" trong màn hình hiệu ứng
POS_BTN_SKIP_ANIMATION = (960, 950)        # Nút "Bỏ qua hiệu ứng / Tiếp tục"

print("="*60)
print("TOOL AUTO ÉP THẺ FC ONLINE ĐANG CHẠY")
print("-> Bấm phím [F6] để BẮT ĐẦU tự động ép thẻ")
print("-> Bấm phím [F7] để TẠM DỪNG / THOÁT")
print("="*60)

is_running = False

def click_humanized(x, y):
    """Click có độ trễ ngẫu nhiên mô phỏng người thật thao tác chuột"""
    jitter_x = x + random.randint(-4, 4)
    jitter_y = y + random.randint(-4, 4)
    pyautogui.moveTo(jitter_x, jitter_y, duration=random.uniform(0.18, 0.35))
    pyautogui.click()
    time.sleep(random.uniform(0.3, 0.6))

def upgrade_cycle():
    """1 Chu kỳ chọn 5 phôi và ấn ép thẻ"""
    print(">> Đang tự động tick chọn 5 phôi...")
    fodder_positions = [
        POS_SELECT_FODDER_CHECKBOX_1,
        POS_SELECT_FODDER_CHECKBOX_2,
        POS_SELECT_FODDER_CHECKBOX_3,
        POS_SELECT_FODDER_CHECKBOX_4,
        POS_SELECT_FODDER_CHECKBOX_5
    ]
    for pos in fodder_positions:
        if not is_running:
            return
        click_humanized(pos[0], pos[1])
        time.sleep(random.uniform(0.15, 0.28))

    # Bấm nút 'Tiếp theo'
    print(">> Bấm nút Tiếp theo...")
    click_humanized(POS_BTN_NEXT[0], POS_BTN_NEXT[1])
    time.sleep(random.uniform(1.2, 1.8))

    # Bấm xác nhận nâng cấp
    print(">> Bấm xác nhận nâng cấp thẻ...")
    click_humanized(POS_BTN_CONFIRM_UPGRADE[0], POS_BTN_CONFIRM_UPGRADE[1])
    time.sleep(random.uniform(2.5, 3.2))

    # Bấm tiếp tục / đóng bảng kết quả
    click_humanized(POS_BTN_SKIP_ANIMATION[0], POS_BTN_SKIP_ANIMATION[1])
    time.sleep(random.uniform(1.0, 1.5))
    print(">> Hoàn thành 1 lượt ép!")

while True:
    if keyboard.is_pressed('f6'):
        is_running = True
        print("[!] ĐÃ BẮT ĐẦU AUTO ÉP THẺ (Bấm F7 để dừng)...")
        time.sleep(0.5)

    if keyboard.is_pressed('f7'):
        is_running = False
        print("[!] ĐÃ TẠM DỪNG AUTO ÉP THẺ.")
        time.sleep(0.5)

    if is_running:
        upgrade_cycle()
        time.sleep(0.8)

    time.sleep(0.05)
`;

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(pythonScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f1723] border border-emerald-500/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#090e16] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <span>Script Auto Clicker & Tọa Độ Cho PC (FC Online)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded font-mono">
                  Python + PyAutoGUI
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Kịch bản tự động hóa thao tác chọn phôi và ép thẻ trực tiếp trên máy tính cá nhân
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Info Banner */}
          <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-3 flex items-start gap-2.5 text-amber-200">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-300">
                Lưu ý quan trọng khi chạy tool trực tiếp trên game FC Online PC:
              </p>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Các trình duyệt web bị giới hạn sandbox nên không thể tự động can thiệp click vào game cài đặt trên Windows. Script Python này sử dụng thư viện <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300">pyautogui</code> với cơ chế <strong>Humanized Jitter</strong> (độ trễ và chuyển động chuột ngẫu nhiên giống người thật) để tự động hóa an toàn.
              </p>
            </div>
          </div>

          {/* Settings Config */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#131d2a] p-3 rounded-xl border border-zinc-800">
            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">Độ phân giải màn hình Game:</label>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-bold text-white bg-zinc-800 px-2 py-1 rounded">1920 x 1080 (Chuẩn Full HD)</span>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 text-[11px] block mb-1">Độ trễ thao tác an toàn (Delay):</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={600}
                  max={2500}
                  step={100}
                  value={delayMs}
                  onChange={(e) => setDelayMs(Number(e.target.value))}
                  className="accent-emerald-500 flex-1"
                />
                <span className="font-mono text-emerald-400 font-bold">{delayMs}ms</span>
              </div>
            </div>
          </div>

          {/* Script Code Viewer */}
          <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black/80 font-mono text-[11px]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#0b1016] border-b border-zinc-800 text-zinc-400">
              <span>auto_ep_the_fconline.py</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-sans font-semibold text-xs transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép!' : 'Sao chép mã nguồn'}</span>
              </button>
            </div>
            <pre className="p-3 text-zinc-300 overflow-x-auto max-h-60 leading-relaxed font-mono">
              {pythonScript}
            </pre>
          </div>

          {/* Instructions */}
          <div className="bg-[#121c27] p-3 rounded-xl border border-zinc-800/80 space-y-1.5">
            <h4 className="font-bold text-white text-xs">Cách chạy tool trên máy tính:</h4>
            <ol className="list-decimal list-inside space-y-1 text-zinc-300 text-[11px]">
              <li>Cài đặt Python trên máy tính (<a href="https://www.python.org" target="_blank" rel="noreferrer" className="text-emerald-400 underline">python.org</a>).</li>
              <li>Mở Command Prompt (cmd) và chạy lệnh: <code className="bg-black/60 px-1 py-0.5 rounded text-emerald-300">pip install pyautogui keyboard</code>.</li>
              <li>Lưu đoạn mã trên vào file <code className="bg-black/60 px-1 py-0.5 rounded text-emerald-300">auto_ep.py</code>.</li>
              <li>Bật game FC Online ở chế độ Cửa sổ không viền hoặc Toàn màn hình (1920x1080), mở màn hình Nâng cấp cầu thủ.</li>
              <li>Chạy script bằng lệnh <code className="bg-black/60 px-1 py-0.5 rounded text-emerald-300">python auto_ep.py</code> rồi bấm phím <strong>F6</strong> để bắt đầu, bấm <strong>F7</strong> để dừng!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#090e16] border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

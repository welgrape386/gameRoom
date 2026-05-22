import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Character } from '../App';
import { PixelChar } from './shared/PixelChar';

interface Props {
  chars: Character[];
  displayTime?: Date;
  onSelect: (charId: string) => void;
}

const CHAR_DESCRIPTIONS: Record<string, string[]> = {
  minseon: ['밤새 코딩', '감정 폭발', '미친 개발자'],
  yeomtoli: ['늙은이', '모자르지만 착함', '분위기 메이커'],
  kamong: ['사차원', '쓸 데 없이 무언갈 잘함', '집돌이'],
  kyunggeun: ['알겠습니당', '착한 막내', '다 따라가'],
  enggdengi: ['여미새', '살짝 미쳐있음', '다정함'],
};

export function CharacterSelect({ chars, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  const selectedChar = chars.find(c => c.id === selected);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;

  return (
    <div
      className="w-screen min-h-screen flex flex-col items-center justify-center relative overflow-y-auto"
      style={{
        background: '#04040a',
        fontFamily: '"Press Start 2P", monospace',
        padding: '40px 20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Animated background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(124,58,237,0.06) 39px, rgba(124,58,237,0.06) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(124,58,237,0.06) 39px, rgba(124,58,237,0.06) 40px)
          `,
        }}
      />

      {/* Corner glow */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
        style={{ position: 'relative', zIndex: 5 }}
      >
        <div
          style={{
            fontSize: 'clamp(10px, 0.8vw, 14px)',
            color: '#7c3aed',
            letterSpacing: 4,
            marginBottom: 12,
          }}
        >
          🌧️ {hours12}:{minutes} {ampm}
        </div>

        <div
          style={{
            fontSize: 'clamp(18px, 1.6vw, 28px)',
            color: '#e2e8f0',
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          친구의 방에 입장하기
        </div>

        <div
          style={{
            fontSize: 'clamp(11px, 0.9vw, 15px)',
            color: '#64748b',
          }}
        >
          누구로 들어갈지 선택해주세요
        </div>
      </motion.div>

      {/* Character cards */}
      <div
        className="grid w-full max-w-[1400px] gap-5 mb-8 px-2"
        style={{
          position: 'relative',
          zIndex: 5,
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        }}
      >
        {chars.map((char, idx) => {
          const isSelected = selected === char.id;
          const isHovered = hovered === char.id;

          return (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isSelected ? 1.04 : isHovered ? 1.02 : 1,
              }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              onClick={() => setSelected(char.id)}
              onMouseEnter={() => setHovered(char.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                cursor: 'pointer',
                width: '100%',
                minHeight: 320,
                background: isSelected ? `${char.primaryColor}18` : '#0a0a1a',
                border: `2px solid ${
                  isSelected
                    ? char.primaryColor
                    : isHovered
                    ? `${char.primaryColor}66`
                    : '#1e1e3a'
                }`,
                boxShadow: isSelected
                  ? `0 0 20px ${char.primaryColor}55, 0 0 40px ${char.primaryColor}22`
                  : isHovered
                  ? `0 0 10px ${char.primaryColor}33`
                  : 'none',
                padding: '24px 18px',
                borderRadius: 18,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                position: 'relative',
                boxSizing: 'border-box',
              }}
            >
              {/* Selected checkmark */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: char.primaryColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      color: '#fff',
                    }}
                  >
                    ✓
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pixel character */}
              <motion.div
                animate={{ y: isSelected ? [0, -4, 0] : 0 }}
                transition={{
                  duration: 1.2,
                  repeat: isSelected ? Infinity : 0,
                  ease: 'easeInOut',
                }}
                style={{
                  filter: `drop-shadow(0 4px 8px ${char.primaryColor}88)`,
                }}
              >
                <PixelChar
                  char={{ ...char, state: 'idle', walkStep: 0 }}
                  scale={3.6}
                  preview
                />
              </motion.div>

              {/* Name */}
              <div
                style={{
                  fontSize: 'clamp(15px, 1.2vw, 20px)',
                  color: isSelected ? char.primaryColor : '#e2e8f0',
                  textShadow: isSelected ? `0 0 8px ${char.primaryColor}` : 'none',
                  textAlign: 'center',
                }}
              >
                {char.name}
              </div>

              {/* Gender + age */}
              <div
                style={{
                  fontSize: 'clamp(10px, 0.75vw, 13px)',
                  color: '#64748b',
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}
              >
                {char.gender === 'f' ? '여' : '남'}, {char.age}세 · {char.role}
              </div>

              {/* Trait tags */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                  width: '100%',
                }}
              >
                {(CHAR_DESCRIPTIONS[char.id] ?? []).map(tag => (
                  <div
                    key={tag}
                    style={{
                      fontSize: 'clamp(10px, 0.75vw, 13px)',
                      color: isSelected ? char.primaryColor : '#94a3b8',
                      background: isSelected ? `${char.primaryColor}15` : '#0d0d1e',
                      border: `1px solid ${
                        isSelected ? `${char.primaryColor}44` : '#1e1e3a'
                      }`,
                      padding: '7px 10px',
                      borderRadius: 8,
                      textAlign: 'center',
                      lineHeight: 1.4,
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>

              {/* Online indicator */}
              <div
                style={{
                  fontSize: 'clamp(10px, 0.75vw, 13px)',
                  color: char.online ? '#22c55e' : '#475569',
                  marginTop: 4,
                }}
              >
                {char.online ? '🟢 온라인' : '⚫ 오프라인'}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enter button */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col items-center gap-3"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <div
              style={{
                fontSize: 'clamp(11px, 0.8vw, 14px)',
                color: '#64748b',
              }}
            >
              <span style={{ color: selectedChar?.primaryColor }}>
                {selectedChar?.name}
              </span>
              으로 입장합니다
            </div>

            <button
              onClick={() => onSelect(selected!)}
              style={{
                background: `linear-gradient(135deg, ${selectedChar?.primaryColor}, ${selectedChar?.primaryColor}88)`,
                border: `2px solid ${selectedChar?.primaryColor}`,
                boxShadow: `0 0 20px ${selectedChar?.primaryColor}55`,
                color: '#fff',
                padding: '14px 40px',
                borderRadius: 14,
                fontSize: 'clamp(12px, 0.9vw, 16px)',
                letterSpacing: 3,
                cursor: 'pointer',
                fontFamily: '"Press Start 2P", monospace',
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onMouseDown={e => {
                e.currentTarget.style.transform = 'scale(0.96)';
              }}
              onMouseUp={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
            >
              입장하기 →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
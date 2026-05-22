import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Character } from '../App';
import { PixelChar } from './shared/PixelChar';

interface Props {
  chars: Character[];
  displayTime?: Date;
  onSelect: (charId: string) => void;
}

const CHAR_DESCRIPTIONS: Record<string, string[]> = {
  minseon:   ['밤새 코딩', '감정 폭발', '천재 개발자'],
  yeomtoli:  ['항상 활발', '게임 선두', '분위기 메이커'],
  kamong:    ['집만 좋아', '잠 최고', '한 마디면 충분'],
  kyunggeun: ['알겠습니당', '착한 막내', '다 따라가'],
  enggdengi: ['다 괜찮아', '감정 쿠션', '카몽집 단골'],
};

export function CharacterSelect({ chars, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedChar = chars.find(c => c.id === selected);

  return (
    <div
      className="size-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#04040a', fontFamily: '"Press Start 2P", monospace' }}
    >
      {/* Animated background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(124,58,237,0.06) 39px, rgba(124,58,237,0.06) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(124,58,237,0.06) 39px, rgba(124,58,237,0.06) 40px)
          `,
        }}
      />

      {/* Corner glow */}
      <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div style={{ fontSize: 7, color: '#7c3aed', letterSpacing: 4, marginBottom: 8 }}>
          🌧️ 새벽 3:42 AM
        </div>
        <div style={{ fontSize: 11, color: '#e2e8f0', letterSpacing: 2, marginBottom: 6 }}>
          친구의 방에 입장하기
        </div>
        <div style={{ fontSize: 6, color: '#475569' }}>
          누구로 들어갈지 선택해주세요
        </div>
      </motion.div>

      {/* Character cards */}
      <div className="flex gap-4 mb-8 flex-wrap justify-center px-4">
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
                scale: isSelected ? 1.06 : isHovered ? 1.02 : 1,
              }}
              transition={{ delay: idx * 0.08, duration: 0.35 }}
              onClick={() => setSelected(char.id)}
              onMouseEnter={() => setHovered(char.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                cursor: 'pointer',
                width: 130,
                background: isSelected ? `${char.primaryColor}18` : '#0a0a1a',
                border: `2px solid ${isSelected ? char.primaryColor : isHovered ? `${char.primaryColor}66` : '#1e1e3a'}`,
                boxShadow: isSelected
                  ? `0 0 20px ${char.primaryColor}55, 0 0 40px ${char.primaryColor}22`
                  : isHovered
                  ? `0 0 10px ${char.primaryColor}33`
                  : 'none',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                position: 'relative',
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
                      top: 6,
                      right: 6,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: char.primaryColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 7,
                    }}
                  >
                    ✓
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pixel character (large preview) */}
              <motion.div
                animate={{ y: isSelected ? [0, -4, 0] : 0 }}
                transition={{ duration: 1.2, repeat: isSelected ? Infinity : 0, ease: 'easeInOut' }}
                style={{ filter: `drop-shadow(0 4px 8px ${char.primaryColor}88)` }}
              >
                <PixelChar
                  char={{ ...char, state: 'idle', walkStep: 0 }}
                  scale={2.8}
                  preview
                />
              </motion.div>

              {/* Name */}
              <div style={{ fontSize: 9, color: isSelected ? char.primaryColor : '#e2e8f0', textShadow: isSelected ? `0 0 8px ${char.primaryColor}` : 'none' }}>
                {char.name}
              </div>

              {/* Gender + age */}
              <div style={{ fontSize: 5, color: '#475569' }}>
                {char.gender === 'f' ? '여' : '남'}, {char.age}세 · {char.role}
              </div>

              {/* Trait tags */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
                {(CHAR_DESCRIPTIONS[char.id] ?? []).map(tag => (
                  <div
                    key={tag}
                    style={{
                      fontSize: 5,
                      color: isSelected ? char.primaryColor : '#334155',
                      background: isSelected ? `${char.primaryColor}15` : '#0d0d1e',
                      border: `1px solid ${isSelected ? `${char.primaryColor}44` : '#1e1e3a'}`,
                      padding: '2px 6px',
                      textAlign: 'center',
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>

              {/* Online indicator */}
              <div style={{ fontSize: 5, color: char.online ? '#22c55e' : '#1e293b', marginTop: 2 }}>
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
          >
            <div style={{ fontSize: 6, color: '#475569' }}>
              <span style={{ color: selectedChar?.primaryColor }}>{selectedChar?.name}</span>으로 입장합니다
            </div>
            <button
              onClick={() => onSelect(selected!)}
              style={{
                background: `linear-gradient(135deg, ${selectedChar?.primaryColor}, ${selectedChar?.primaryColor}88)`,
                border: `2px solid ${selectedChar?.primaryColor}`,
                boxShadow: `0 0 20px ${selectedChar?.primaryColor}55`,
                color: '#fff',
                padding: '10px 32px',
                fontSize: 9,
                letterSpacing: 3,
                cursor: 'pointer',
                fontFamily: '"Press Start 2P", monospace',
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)'; }}
              onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; }}
            >
              입장하기 →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient flavor */}
      <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', fontSize: 5, color: '#1e293b' }}>
        새벽 3시 42분 · 비 오는 밤 · 친구들의 공간으로
      </div>
    </div>
  );
}

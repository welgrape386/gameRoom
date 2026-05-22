import { motion, AnimatePresence } from 'motion/react';

export interface CharLook {
  id: string;
  primaryColor: string;
  hairColor: string;
  skinColor: string;
  state: 'walking' | 'sitting' | 'lying' | 'idle';
  walkStep: number;
  personality: string;
}

interface PixelCharProps {
  char: CharLook;
  scale?: number;
  preview?: boolean;
}

export function PixelChar({ char, scale = 1, preview = false }: PixelCharProps) {
  const isLying = !preview && char.state === 'lying';
  const isSitting = !preview && char.state === 'sitting';
  const bobY = !preview && char.state === 'walking' && char.walkStep >= 4 ? -1 : 0;

  // 캐릭터 크기 키움
  const w = Math.round((isLying ? 58 : 42) * scale);
  const h = Math.round((isLying ? 40 : 70) * scale);

  const xform = isLying
    ? 'rotate(90deg)'
    : isSitting
    ? 'scaleY(0.9)'
    : `translateY(${bobY}px)`;

  const hairLong = char.id === 'minseon';
  const hasHoodie = char.id === 'minseon' || char.id === 'kamong';
  const isIntense = char.personality === 'intense';
  const isLazy = char.personality === 'lazy';
  const isCalm = char.personality === 'calm';

  const mouthColor = isIntense ? '#7c3a3a' : isCalm ? '#d97706' : '#c0706a';

  return (
    <svg
      viewBox="0 -3 16 29"
      width={w}
      height={h}
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        transform: xform,
      }}
    >
      {/* Long hair back */}
      {hairLong && <rect x="4" y="3" width="8" height="2" fill={char.hairColor} />}
      {hairLong && <rect x="12" y="2" width="2" height="7" fill={char.hairColor} />}

      {/* Head */}
      <rect x="4" y="1" width="8" height="8" fill={char.skinColor} />

      {/* Hair */}
        {char.id === 'yeomtoli' ? (
  <>
    {/* 염톨이: 얼굴 위 세모 픽셀 머리 */}
    <rect x="7" y="-3" width="2" height="1" fill={char.hairColor} />
    <rect x="6" y="-2" width="4" height="1" fill={char.hairColor} />
    <rect x="4" y="-1" width="8" height="1" fill={char.hairColor} />

    <rect x="3" y="0" width="10" height="3" fill={char.hairColor} />

    <rect x="3" y="2" width="1" height="3" fill={char.hairColor} />
    <rect x="12" y="2" width="1" height="3" fill={char.hairColor} />
  </>
) : (
  <>
    <rect x="3" y="0" width="10" height="3" fill={char.hairColor} />
    <rect x="3" y="2" width="1" height="3" fill={char.hairColor} />
    {!hairLong && <rect x="12" y="1" width="1" height="2" fill={char.hairColor} />}
  </>
)}

      {/* Enggdengi lower back hair */}
      {char.id === 'enggdengi' && (
        <>
          <rect x="2" y="6" width="2" height="4" fill={char.hairColor} />
          <rect x="12" y="6" width="2" height="4" fill={char.hairColor} />

          <rect x="1" y="8" width="2" height="3" fill={char.hairColor} />
          <rect x="13" y="8" width="2" height="3" fill={char.hairColor} />
        </>
      )}

      {/* Eyes */}
      <rect x="6" y="4" width="1" height={isLazy ? 1 : 2} fill="#0d0d1a" />
      <rect x="9" y="4" width="1" height={isLazy ? 1 : 2} fill="#0d0d1a" />

      {isLazy && (
        <>
          <rect x="6" y="4" width="1" height="1" fill="#6b7280" opacity="0.6" />
          <rect x="9" y="4" width="1" height="1" fill="#6b7280" opacity="0.6" />
        </>
      )}

      {/* Blush for minseon */}
      {char.id === 'minseon' && (
        <>
          <rect x="5" y="6" width="2" height="1" fill="#3b2060" />
          <rect x="9" y="6" width="2" height="1" fill="#3b2060" />
        </>
      )}

      {/* Mouth */}
      <rect x="7" y="7" width="2" height="1" fill={mouthColor} />

      {/* Body */}
      <rect x="3" y="9" width="10" height="8" fill={char.primaryColor} />

      {/* Hoodie pocket */}
      {hasHoodie && (
        <rect x="6" y="14" width="4" height="2" fill={`${char.primaryColor}99`} />
      )}

      {/* Arms */}
      <rect x="1" y="9" width="2" height="7" fill={char.primaryColor} />
      <rect x="13" y="9" width="2" height="7" fill={char.primaryColor} />
      <rect x="1" y="16" width="2" height="2" fill={char.skinColor} />
      <rect x="13" y="16" width="2" height="2" fill={char.skinColor} />

      {/* Legs */}
      <rect
        x="4"
        y="17"
        width="3"
        height={char.state === 'walking' && char.walkStep >= 4 ? 5 : 6}
        fill="#1e1b4b"
      />
      <rect
        x="9"
        y="17"
        width="3"
        height={char.state === 'walking' && char.walkStep >= 4 ? 6 : 5}
        fill="#1e1b4b"
      />

      {/* Shoes */}
      {!isSitting && (
        <>
          <rect x="3" y="22" width="4" height="2" fill="#111827" />
          <rect x="9" y="22" width="4" height="2" fill="#111827" />
        </>
      )}
    </svg>
  );
}

interface BubbleProps {
  text: string;
  color: string;
}

export function SpeechBubble({ text, color }: BubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, y: -4 }}
      transition={{ duration: 0.18 }}
      style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: 14,
        background: '#0d0d1e',
        border: `2px solid ${color}`,
        boxShadow: `0 0 15px ${color}66`,
        color: '#e2e8f0',
        padding: '6px 14px',
        borderRadius: 8,
        whiteSpace: 'nowrap',
        zIndex: 200,
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: '"VT323", monospace',
          fontSize: 26,
          lineHeight: 1.2,
          display: 'block',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>

      <div
        style={{
          position: 'absolute',
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: `5px solid ${color}`,
        }}
      />
    </motion.div>
  );
}

interface SpriteProps {
  char: CharLook & {
    x: number;
    y: number;
    facing: 'left' | 'right';
    speechBubble: string | null;
    name: string;
  };
  isPlayer?: boolean;
}

export function CharSprite({ char, isPlayer }: SpriteProps) {
  const safeX = Math.max(8, Math.min(92, char.x));
  const safeY = Math.max(18, Math.min(58, char.y));

  return (
    <div
      style={{
        position: 'absolute',
        left: `${safeX}%`,
        top: `${safeY}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: Math.round(safeY * 10),
        transition: 'left 0.1s linear, top 0.1s linear',
      }}
    >
      <div style={{ position: 'relative' }}>
        <AnimatePresence>
          {char.speechBubble && (
            <SpeechBubble
              key={char.speechBubble + char.id}
              text={char.speechBubble}
              color={char.primaryColor}
            />
          )}
        </AnimatePresence>

        {isPlayer && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 14,
              zIndex: 300,
              marginBottom: char.speechBubble ? 44 : 4,
            }}
          >
            👑
          </div>
        )}

        <div
          style={{
            transform: char.facing === 'left' ? 'scaleX(-1)' : undefined,
            filter: `drop-shadow(0 3px 8px ${char.primaryColor}66)`,
          }}
        >
          <PixelChar char={char} />
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: 4,
          fontSize: isPlayer ? 9 : 8,
          color: isPlayer ? '#fbbf24' : char.primaryColor,
          textShadow: `0 0 6px ${isPlayer ? '#fbbf24' : char.primaryColor}`,
          fontFamily: '"Press Start 2P", monospace',
          whiteSpace: 'nowrap',
        }}
      >
        {char.name}
        {isPlayer && <span style={{ fontSize: 6 }}> ★</span>}
      </div>
    </div>
  );
}
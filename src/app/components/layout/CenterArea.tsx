import { CharSprite } from '../shared/PixelChar';
import type { Character } from '../../App';

interface CenterAreaProps {
  chars: Character[];
  playerCharId: string | null;
}

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

export function CenterArea({ chars, playerCharId }: CenterAreaProps) {
  return (
    <div
      className="relative overflow-hidden min-h-0"
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #0a0a18 0%, #050509 100%)',
        minWidth: 0,
        fontFamily: "'MaruMinya', monospace",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          pointerEvents: 'none',
        }}
      />

      {/* Room title */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: 24,
          zIndex: 100,
          color: '#a78bfa',
          fontSize: 'clamp(14px, 1.2vw, 22px)',
          letterSpacing: 1,
          textShadow: '0 0 12px rgba(167,139,250,0.6)',
        }}
      >
        친구들의 새벽방
      </div>

      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 24,
          zIndex: 100,
          color: '#64748b',
          fontSize: 'clamp(10px, 0.75vw, 14px)',
        }}
      >
        비 오는 밤 · 디스코드 통화 중
      </div>

      {/* Back wall */}
      <div
        style={{
          position: 'absolute',
          left: '6%',
          right: '6%',
          top: 80,
          height: 180,
          zIndex: 1,
          background: 'linear-gradient(180deg, #11112a 0%, #090914 100%)',
          border: '2px solid #1e1b4b',
          boxShadow: '0 0 30px rgba(124,58,237,0.15)',
          pointerEvents: 'none',
        }}
      />

      {/* LED line */}
      <div
        style={{
          position: 'absolute',
          left: '8%',
          right: '8%',
          top: 96,
          height: 4,
          zIndex: 2,
          background: 'linear-gradient(90deg, #a855f7, #38bdf8, #34d399, #fb923c)',
          boxShadow: '0 0 18px rgba(56,189,248,0.7)',
          pointerEvents: 'none',
        }}
      />

      {/* Desks */}
      <div
        style={{
          position: 'absolute',
          left: '10%',
          right: '10%',
          top: 150,
          height: 150,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 14,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        {chars.map(char => (
          <div
            key={char.id}
            style={{
              position: 'relative',
              background: '#0d0d1f',
              border: `2px solid ${char.primaryColor}55`,
              boxShadow: `0 0 16px ${char.primaryColor}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: char.primaryColor,
              fontSize: 13,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 10,
                width: '58%',
                height: '38%',
                background: '#030308',
                border: `2px solid ${char.primaryColor}`,
                boxShadow: `0 0 14px ${char.primaryColor}88`,
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: 14,
                width: '70%',
                height: 12,
                background: `${char.primaryColor}22`,
                border: `1px solid ${char.primaryColor}55`,
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: -24,
                fontSize: 'clamp(9px, 0.7vw, 13px)',
              }}
            >
              {char.name}
            </div>
          </div>
        ))}
      </div>

      {/* Floor */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 300,
          bottom: 0,
          zIndex: 1,
          background:
            'linear-gradient(180deg, rgba(10,10,24,0.2) 0%, #050509 100%)',
          borderTop: '2px solid #11112a',
          pointerEvents: 'none',
        }}
      />

      {/* Floor perspective lines */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          top: 300,
          zIndex: 2,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(255,255,255,0.035) 36px), repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,0.025) 49px)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient lights */}
      <div
        className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{
          zIndex: 4,
          background: '#a855f7',
          pointerEvents: 'none',
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-20 blur-3xl"
        style={{
          zIndex: 4,
          background: '#38bdf8',
          pointerEvents: 'none',
        }}
      />

      {/* Characters */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 50,
          pointerEvents: 'none',
        }}
      >
        {chars.map(char => {
          const safeChar = {
            ...char,
            x: clamp(char.x, 8, 92),
            y: clamp(char.y, 58, 76),
            targetY: clamp(char.targetY, 58, 76),
          };

          return (
            <CharSprite
              key={char.id}
              char={safeChar}
              isPlayer={char.id === playerCharId}
            />
          );
        })}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 90,
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(4,4,10,0.55) 100%)',
        }}
      />
    </div>
  );
}
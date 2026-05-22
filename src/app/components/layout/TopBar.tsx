import type { Character } from '../../App';

interface Props {
  chars: Character[];
  displayTime: Date;
}

const STATE_ICONS: Record<string, string> = {
  sitting: '💻',
  lying: '😴',
  walking: '🚶',
  idle: '💬',
};

export function TopBar({ chars, displayTime }: Props) {
  const h = displayTime.getHours();
  const m = displayTime.getMinutes().toString().padStart(2, '0');
  const s = displayTime.getSeconds().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;

  return (
    <div
      className="flex items-center px-6 shrink-0"
      style={{
        width: '100%',
        height: 56,
        background: 'linear-gradient(180deg, #090914 0%, #05050c 100%)',
        borderBottom: '2px solid #1e1b4b',
        boxShadow: '0 0 24px rgba(124,58,237,0.18)',
        fontFamily: "'MaruMinya', monospace",
        boxSizing: 'border-box',
      }}
    >
      <div className="flex items-center gap-3 shrink-0">
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            background: '#7c3aed',
            boxShadow: '0 0 10px #7c3aed, 0 0 22px #7c3aed66',
          }}
        />
        <span style={{ fontSize: 'clamp(10px, 0.8vw, 15px)', color: '#a78bfa', letterSpacing: 1 }}>
          DISCORD ROOM
        </span>
      </div>

      <div className="mx-5 shrink-0" style={{ width: 1, height: 24, background: '#272755' }} />

      <span style={{ color: '#38bdf8', fontSize: 'clamp(14px, 1.1vw, 20px)', letterSpacing: 1 }}>
        {h12.toString().padStart(2, '0')}:{m}:{s} {ampm}
      </span>

      <div
        className="ml-5 flex items-center gap-2 shrink-0 rounded-md"
        style={{
          background: '#071b10',
          border: '1px solid #166534',
          padding: '5px 10px',
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
          }}
        />
        <span style={{ fontSize: 'clamp(9px, 0.7vw, 13px)', color: '#22c55e' }}>🎙️ 통화 중</span>
      </div>

      <div className="ml-5 flex items-center gap-2 shrink-0">
        <span style={{ fontSize: 'clamp(12px, 0.9vw, 17px)' }}>🌧️</span>
        <span style={{ fontSize: 'clamp(8px, 0.65vw, 12px)', color: '#64748b' }}>자정 빗소리</span>
      </div>

      <div className="mx-5 shrink-0" style={{ width: 1, height: 24, background: '#272755' }} />

      <div className="flex items-center gap-4 overflow-hidden flex-1">
        {chars.map(char => (
          <div key={char.id} className="flex items-center gap-2 shrink-0">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: char.primaryColor,
                boxShadow: `0 0 8px ${char.primaryColor}`,
              }}
            />
            <span style={{ fontSize: 'clamp(9px, 0.7vw, 13px)', color: char.primaryColor, whiteSpace: 'nowrap' }}>
              {char.name}
            </span>
            <span style={{ fontSize: 'clamp(10px, 0.75vw, 14px)' }}>{STATE_ICONS[char.state] ?? '💬'}</span>
          </div>
        ))}
      </div>

      <div className="shrink-0 flex items-center gap-1">
        {['🟣', '🔵', '🟢', '🟡', '🟠'].map((d, i) => (
          <span key={i} style={{ fontSize: 'clamp(8px, 0.65vw, 12px)', opacity: 0.6 + i * 0.08 }}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
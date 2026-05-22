import { Monitor, Gamepad2, Home, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import type { PanelId, GameType } from '../../App';

interface LeftRoomsProps {
  selectedPanel: PanelId;
  onSelectPanel: (panel: PanelId) => void;
  gameType: GameType;
  gameTriggered: boolean;
  enggdengiAtKamong: boolean;
}

export function LeftRooms({
  selectedPanel,
  onSelectPanel,
  gameType,
  gameTriggered,
  enggdengiAtKamong,
}: LeftRoomsProps) {
  return (
    <div
      className="flex flex-col gap-4"
      style={{
        width: '100%',
        height: '100%',
        background: '#070711',
        borderRight: '2px solid #1e1b4b',
        padding: 'clamp(10px, 1.2vw, 16px)',
        boxSizing: 'border-box',
        fontFamily: "'MaruMinya', monospace",
        overflowY: 'auto',
        minWidth: 0,
      }}
    >
      <RoomCard
        title="민선 개발방"
        icon={<Monitor size={22} />}
        selected={selectedPanel === 'dev'}
        onClick={() => onSelectPanel('dev')}
        color="#a855f7"
      >
        {'</> CODE'}
      </RoomCard>

      <RoomCard
        title="게임룸"
        icon={<Gamepad2 size={22} />}
        selected={selectedPanel === 'game'}
        onClick={() => onSelectPanel('game')}
        color="#38bdf8"
        badge={gameTriggered ? '🎮 LIVE' : undefined}
      >
        {gameType === 'pubg'
          ? 'PUBG'
          : gameType === 'valorant'
          ? 'VALORANT'
          : '5 PCs'}
      </RoomCard>

      <RoomCard
        title="카몽집"
        icon={<Home size={22} />}
        selected={selectedPanel === 'kamong'}
        onClick={() => onSelectPanel('kamong')}
        color="#94a3b8"
        badge={enggdengiAtKamong ? '👤 방문중' : undefined}
      >
        🏠 HOME
      </RoomCard>

      <RoomCard
        title="잠수방"
        icon={<Moon size={22} />}
        selected={selectedPanel === 'afk'}
        onClick={() => onSelectPanel('afk')}
        color="#fbbf24"
      >
        Zzz AFK
      </RoomCard>
    </div>
  );
}

interface RoomCardProps {
  title: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  color: string;
  badge?: string;
  children: React.ReactNode;
}

function RoomCard({
  title,
  icon,
  selected,
  onClick,
  color,
  badge,
  children,
}: RoomCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col overflow-hidden"
      style={{
        width: '100%',
        height: 'clamp(110px, 18vh, 170px)',
        flexShrink: 0,
        background: selected ? '#111122' : '#0a0a14',
        border: `2px solid ${selected ? color : '#1e1e2e'}`,
        boxShadow: selected ? `0 0 18px ${color}55` : 'none',
        cursor: 'pointer',
        padding: 0,
        textAlign: 'left',
        color: '#fff',
        fontFamily: "'MaruMinya', monospace",
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="flex items-center gap-3"
        style={{
          height: 'clamp(36px, 5vh, 46px)',
          padding: '0 12px',
          background: selected ? `${color}18` : '#14141f',
          borderBottom: `1px solid ${selected ? `${color}55` : '#1e1e2e'}`,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ color, display: 'flex', alignItems: 'center' }}>
          {icon}
        </div>

        <div
          style={{
            fontSize: 'clamp(12px, 1vw, 17px)',
            flex: 1,
            color: selected ? color : '#cbd5e1',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>

        {badge && (
          <div
            style={{
              fontSize: 'clamp(9px, 0.8vw, 12px)',
              padding: '3px 7px',
              background: `${color}20`,
              border: `1px solid ${color}66`,
              color,
              whiteSpace: 'nowrap',
            }}
          >
            {badge}
          </div>
        )}
      </div>

      <div
        className="flex items-center justify-center"
        style={{
          flex: 1,
          fontSize: 'clamp(14px, 1.4vw, 20px)',
          color,
          opacity: 0.75,
          background: selected
            ? `linear-gradient(135deg, ${color}18 0%, #05050c 100%)`
            : 'linear-gradient(135deg, #10101f 0%, #05050c 100%)',
        }}
      >
        {children}
      </div>
    </motion.button>
  );
}
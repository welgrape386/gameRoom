import { Monitor, Gamepad2, Home } from 'lucide-react';
import { DevTerminal } from '../screens/DevTerminal';
import { GameScreen } from '../screens/GameScreen';
import type { PanelId, GameType } from '../../App';

interface RightPanelProps {
  selectedPanel: PanelId;
  gameType: GameType;
  gameTriggered: boolean;
}

export function RightPanel({ selectedPanel, gameType, gameTriggered }: RightPanelProps) {
  const color =
    selectedPanel === 'dev' ? '#a855f7' :
    selectedPanel === 'game' ? '#38bdf8' :
    '#94a3b8';

  const title =
    selectedPanel === 'dev' ? '민선 개발방' :
    selectedPanel === 'game'
      ? gameType === 'pubg'
        ? 'PUBG'
        : gameType === 'valorant'
        ? 'VALORANT'
        : '게임룸'
      : '카몽집';

  const icon =
    selectedPanel === 'dev' ? <Monitor size={22} /> :
    selectedPanel === 'game' ? <Gamepad2 size={22} /> :
    <Home size={22} />;

  return (
    <div
      className="flex flex-col shrink-0"
      style={{
        width: '100%',
        height: '100%',
        background: '#070711',
        borderLeft: '2px solid #1e1b4b',
        fontFamily: "'MaruMinya', monospace",
      }}
    >
      <div
        className="flex items-center gap-3 shrink-0"
        style={{
          height: 54,
          padding: '0 16px',
          background: '#11111f',
          borderBottom: `2px solid ${color}55`,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ color, display: 'flex', alignItems: 'center' }}>{icon}</div>

        <div
          style={{
            flex: 1,
            color,
            fontSize: 'clamp(12px, 1vw, 18px)',
            letterSpacing: 1,
            textShadow: `0 0 10px ${color}66`,
          }}
        >
          {title}
        </div>

        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </div>

      <div className="flex-1 relative overflow-hidden min-h-0">
        {selectedPanel === 'dev' && <DevTerminal />}
        {selectedPanel === 'game' && (
          <GameScreen gameType={gameType} gameTriggered={gameTriggered} />
        )}
        {selectedPanel === 'kamong' && (
          <div
            className="size-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #1a1a22 0%, #0d0d12 100%)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(32px, 3vw, 56px)', marginBottom: 18 }}>🏠</div>
              <div style={{ fontSize: 'clamp(14px, 1.1vw, 20px)', color: '#94a3b8' }}>카몽의 아지트</div>
              <div style={{ fontSize: 'clamp(10px, 0.75vw, 14px)', color: '#64748b', marginTop: 10 }}>
                집이 최고야...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
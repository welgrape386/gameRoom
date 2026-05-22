import { useState, useEffect } from 'react';
import { Crosshair, Activity, Users, Trophy } from 'lucide-react';
import type { GameType } from '../../App';

interface GameScreenProps {
  gameType: GameType;
  gameTriggered: boolean;
}

export function GameScreen({ gameType, gameTriggered }: GameScreenProps) {
  const [kills, setKills] = useState(0);
  const [health, setHealth] = useState(100);
  const [ammo, setAmmo] = useState(30);
  const [alive, setAlive] = useState(85);

  useEffect(() => {
    if (!gameTriggered) return;
    
    const interval = setInterval(() => {
      // Simulate game events
      if (Math.random() < 0.15) {
        setKills(prev => Math.min(prev + 1, 25));
      }
      if (Math.random() < 0.08) {
        setHealth(prev => Math.max(prev - Math.floor(Math.random() * 15), 20));
      }
      if (Math.random() < 0.25) {
        setAmmo(prev => Math.max(prev - Math.floor(Math.random() * 3), 0));
      }
      if (Math.random() < 0.12) {
        setAlive(prev => Math.max(prev - 1, 5));
      }
      // Reload
      if (Math.random() < 0.1) {
        setAmmo(30);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [gameTriggered]);

  if (!gameTriggered) {
    return (
      <div className="size-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #050a14 100%)' }}>
        <div className="text-center">
          <Gamepad2Icon />
          <div className="text-[9px] opacity-60 mt-3" style={{ color: '#38bdf8' }}>게임 대기 중...</div>
        </div>
      </div>
    );
  }

  if (gameType === 'pubg') {
    return <PUBGScreen kills={kills} health={health} ammo={ammo} alive={alive} />;
  }

  if (gameType === 'valorant') {
    return <ValorantScreen kills={kills} health={health} ammo={ammo} />;
  }

  return (
    <div className="size-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #050a14 100%)' }}>
      <div className="text-center">
        <Gamepad2Icon />
        <div className="text-[9px] opacity-60 mt-3" style={{ color: '#38bdf8' }}>게임 진행 중...</div>
      </div>
    </div>
  );
}

function Gamepad2Icon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5">
      <path d="M6 12h4m2 0h4M8 8v8m8-8v8" strokeLinecap="round" />
      <rect x="2" y="6" width="20" height="12" rx="2" />
    </svg>
  );
}

function PUBGScreen({ kills, health, ammo, alive }: { kills: number; health: number; ammo: number; alive: number }) {
  return (
    <div className="size-full relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #2d4a3e 0%, #1a2922 50%, #0f1612 100%)' }}>
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Crosshair size={32} style={{ color: '#fff', opacity: 0.6 }} />
      </div>

      {/* HUD - Top */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
        {/* Map */}
        <div className="w-24 h-24 rounded-sm overflow-hidden" style={{ background: '#1a2922', border: '2px solid #3d5a4e' }}>
          <div className="size-full relative" style={{ background: 'linear-gradient(45deg, #2d4a3e 0%, #1a2922 100%)' }}>
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#3d5a4e 1px, transparent 1px), linear-gradient(90deg, #3d5a4e 1px, transparent 1px)', backgroundSize: '8px 8px', opacity: 0.3 }} />
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: '#f59e0b' }} />
          </div>
        </div>

        {/* Alive count */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 px-2 py-1 rounded" style={{ background: '#1a292280', backdropFilter: 'blur(8px)' }}>
            <Users size={12} style={{ color: '#fff' }} />
            <div className="text-[11px] font-bold" style={{ color: '#fff' }}>{alive}</div>
          </div>
          <div className="text-[8px] opacity-70" style={{ color: '#fff' }}>ALIVE</div>
        </div>
      </div>

      {/* HUD - Bottom */}
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
        {/* Health & Armor */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Activity size={14} style={{ color: health > 50 ? '#10b981' : '#ef4444' }} />
            <div className="text-[13px] font-bold" style={{ color: '#fff' }}>{health}</div>
          </div>
          <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: '#1a2922' }}>
            <div className="h-full transition-all" style={{ width: `${health}%`, background: health > 50 ? '#10b981' : '#ef4444' }} />
          </div>
        </div>

        {/* Ammo & Kills */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Trophy size={12} style={{ color: '#f59e0b' }} />
              <div className="text-[11px] font-bold" style={{ color: '#fff' }}>{kills}</div>
            </div>
            <div className="text-[18px] font-bold" style={{ color: '#fff', fontFamily: 'monospace' }}>{ammo}/90</div>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-1 h-3 rounded-sm" style={{ background: i < ammo ? '#f59e0b' : '#1a2922' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Kill feed */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-1" style={{ maxWidth: 200 }}>
        {kills > 0 && (
          <div className="px-2 py-1 rounded text-[8px]" style={{ background: '#1a292280', backdropFilter: 'blur(8px)', color: '#fff' }}>
            <span style={{ color: '#f59e0b' }}>염톨이</span> eliminated <span style={{ color: '#ef4444' }}>Enemy</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ValorantScreen({ kills, health, ammo }: { kills: number; health: number; ammo: number }) {
  return (
    <div className="size-full relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a1625 0%, #0f0a15 50%, #08050a 100%)' }}>
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #ff4655, #ff4655, transparent)' }} />
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(45deg, #ff4655 1px, transparent 1px), linear-gradient(-45deg, #ff4655 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-8 h-8">
          <div className="absolute top-1/2 left-1/2 w-3 h-0.5 -translate-x-1/2 -translate-y-1/2" style={{ background: '#0f0', boxShadow: '0 0 8px #0f0' }} />
          <div className="absolute top-1/2 left-1/2 w-0.5 h-3 -translate-x-1/2 -translate-y-1/2" style={{ background: '#0f0', boxShadow: '0 0 8px #0f0' }} />
        </div>
      </div>

      {/* HUD - Top */}
      <div className="absolute top-3 inset-x-3 flex items-start justify-between">
        {/* Round timer */}
        <div className="px-3 py-1.5 rounded" style={{ background: '#0f0a1580', backdropFilter: 'blur(8px)', border: '1px solid #ff465530' }}>
          <div className="text-[10px] font-bold" style={{ color: '#fff', fontFamily: 'monospace' }}>1:23</div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4 px-3 py-1.5 rounded" style={{ background: '#0f0a1580', backdropFilter: 'blur(8px)', border: '1px solid #ff465530' }}>
          <div className="text-[11px] font-bold" style={{ color: '#0ff' }}>5</div>
          <div className="text-[9px] opacity-70" style={{ color: '#fff' }}>-</div>
          <div className="text-[11px] font-bold" style={{ color: '#ff4655' }}>3</div>
        </div>

        {/* Kills */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: '#0f0a1580', backdropFilter: 'blur(8px)', border: '1px solid #ff465530' }}>
          <Trophy size={12} style={{ color: '#f59e0b' }} />
          <div className="text-[11px] font-bold" style={{ color: '#fff' }}>{kills}</div>
        </div>
      </div>

      {/* HUD - Bottom */}
      <div className="absolute bottom-4 inset-x-4">
        <div className="flex items-end justify-between">
          {/* Health */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="text-[24px] font-bold" style={{ color: health > 50 ? '#0ff' : '#ff4655', fontFamily: 'monospace' }}>
                {health}
              </div>
              <Activity size={16} style={{ color: health > 50 ? '#0ff' : '#ff4655' }} />
            </div>
            <div className="w-40 h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1625', border: '1px solid #ff465530' }}>
              <div className="h-full transition-all" style={{ width: `${health}%`, background: health > 50 ? '#0ff' : '#ff4655' }} />
            </div>
          </div>

          {/* Weapon & Ammo */}
          <div className="flex flex-col items-end gap-2">
            <div className="text-[9px] font-bold" style={{ color: '#ff4655', letterSpacing: 1 }}>VANDAL</div>
            <div className="flex items-baseline gap-1.5">
              <div className="text-[28px] font-bold" style={{ color: '#fff', fontFamily: 'monospace' }}>{ammo}</div>
              <div className="text-[14px] opacity-70" style={{ color: '#fff', fontFamily: 'monospace' }}>/90</div>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="w-1 h-4 rounded-sm" style={{ background: i < ammo ? '#ff4655' : '#1a1625' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ability icons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {['Q', 'E', 'C', 'X'].map((key, i) => (
          <div key={key} className="w-10 h-10 rounded flex items-center justify-center text-[10px] font-bold" style={{ background: '#0f0a1580', border: '1px solid #ff465530', color: i === 0 ? '#0ff' : '#888' }}>
            {key}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { Character, PanelId } from '../../App';
import { CharSprite } from '../shared/PixelChar';

interface CenterAreaProps {
  chars: Character[];
  playerCharId: string | null;
  selectedPanel: PanelId;
  onMoveCharacterToRoom: (charId: string, room: PanelId) => void;
}

const DEV_CODE_LINES = [
  'import { useState, useEffect } from "react";',
  '',
  'export function DiscordRoom() {',
  '  const [messages, setMessages] = useState([]);',
  '  const [selectedRoom, setSelectedRoom] = useState("dev");',
  '',
  '  useEffect(() => {',
  '    console.log("새벽방 접속 완료");',
  '  }, []);',
  '',
  '  const sendMessage = (text) => {',
  '    if (!text.trim()) return;',
  '    setMessages(prev => [...prev, text]);',
  '  };',
  '',
  '  return (',
  '    <div className="discord-room">',
  '      <RoomPanel selectedRoom={selectedRoom} />',
  '      <ChatBox messages={messages} />',
  '    </div>',
  '  );',
  '}',
];

export function CenterArea({
  chars,
  playerCharId,
  selectedPanel,
  onMoveCharacterToRoom,
}: CenterAreaProps) {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const [fixedHeight, setFixedHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!areaRef.current || fixedHeight !== null) return;

    const height = areaRef.current.getBoundingClientRect().height;

    if (height > 0) {
      setFixedHeight(height);
    }
  }, [fixedHeight]);

  return (
    <div
      ref={areaRef}
      className="relative overflow-hidden"
      style={{
        width: '100%',
        height: fixedHeight ? `${fixedHeight}px` : '100%',
        maxHeight: fixedHeight ? `${fixedHeight}px` : '100%',
        minHeight: 0,
        background: 'linear-gradient(180deg, #0a0a18 0%, #050509 100%)',
        minWidth: 0,
        fontFamily: "'MaruMinya', monospace",
      }}
    >
      {selectedPanel === 'dev' && <DevRoom />}

      {selectedPanel === 'game' && (
        <GameRoom
          chars={chars}
          onMoveCharacterToRoom={onMoveCharacterToRoom}
        />
      )}

      {selectedPanel === 'kamong' && (
        <KamongRoom chars={chars.filter(char => char.currentRoom === 'kamong')} />
      )}

      {selectedPanel === 'afk' && (
        <AfkRoom
          chars={chars.filter(char => char.currentRoom === 'afk')}
          playerCharId={playerCharId}
          onMoveCharacterToRoom={onMoveCharacterToRoom}
        />
      )}
    </div>
  );
}

function BackgroundGrid() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: '34px 34px',
        opacity: 0.7,
      }}
    />
  );
}

function RoomTitle({
  title,
  subtitle,
  color,
}: {
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: 24,
          zIndex: 100,
          color,
          fontSize: 'clamp(15px, 1.2vw, 22px)',
          letterSpacing: 2,
          textShadow: `0 0 12px ${color}`,
        }}
      >
        {title}
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
        {subtitle}
      </div>
    </>
  );
}

function DevRoom() {
  const [typedText, setTypedText] = useState('');
  const fullText = DEV_CODE_LINES.map(line => `> ${line}`).join('\n');

  useEffect(() => {
    setTypedText('');
    let index = 0;

    const iv = window.setInterval(() => {
      index += Math.floor(Math.random() * 3) + 1;
      setTypedText(fullText.slice(0, index));

      if (index >= fullText.length) {
        window.clearInterval(iv);
      }
    }, 35);

    return () => window.clearInterval(iv);
  }, [fullText]);

  return (
    <>
      <BackgroundGrid />
      <RoomTitle title="개발방" subtitle="코드 · 터미널 · 배포 오류와의 싸움" color="#a855f7" />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '14%',
          transform: 'translateX(-50%)',
          width: 'min(90%, 1040px)',
          height: '76%',
          background: '#030308',
          border: '4px solid #a855f7',
          boxShadow: '0 0 30px rgba(168,85,247,0.4)',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: 34,
            background: 'rgba(168,85,247,0.133)',
            borderBottom: '2px solid rgba(168,85,247,0.4)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            color: '#a855f7',
            fontSize: 'clamp(10px, 0.8vw, 13px)',
          }}
        >
          ● ● ● &nbsp; minseon-dev-terminal
        </div>

        <div
          style={{
            height: 'calc(100% - 34px)',
            overflow: 'hidden',
            padding: '72px 24px 24px 24px',
            boxSizing: 'border-box',
            color: '#cbd5e1',
            fontSize: 'clamp(12px, 0.95vw, 16px)',
            lineHeight: 1.65,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
          }}
        >
          {typedText}
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 16,
              marginLeft: 4,
              background: '#a855f7',
              verticalAlign: 'middle',
              animation: 'blink 0.8s ease infinite',
            }}
          />
        </div>
      </div>

      <style>
        {`
          @keyframes blink {
            0%, 45% { opacity: 1; }
            46%, 100% { opacity: 0; }
          }
        `}
      </style>
    </>
  );
}

function getDisplayName(char: Character) {
  return char.fullName || char.name;
}

function GameRoom({
  chars,
  onMoveCharacterToRoom,
}: {
  chars: Character[];
  onMoveCharacterToRoom: (charId: string, room: PanelId) => void;
}) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const gameChars = chars.filter(char => char.currentRoom === 'game');
  const inviteChars = chars.filter(char => char.currentRoom !== 'game');

  // 5칸 기준 배치 순서
  // 1명: [빈, 빈, 플레이어1, 빈, 빈]
  // 2명: [빈, 플레이어2, 플레이어1, 빈, 빈]
  // 3명: [빈, 플레이어2, 플레이어1, 플레이어3, 빈]
  // 4명: [플레이어4, 플레이어2, 플레이어1, 플레이어3, 빈]
  // 5명: [플레이어4, 플레이어2, 플레이어1, 플레이어3, 플레이어5]
  const slotOrder = [2, 1, 3, 0, 4];
  const slots: Array<Character | null> = Array(5).fill(null);

  gameChars.slice(0, 5).forEach((char, index) => {
    slots[slotOrder[index]] = char;
  });

  const selectedPlayer = chars.find(char => char.id === selectedPlayerId);

  return (
    <>
      <BackgroundGrid />
      <RoomTitle title="게임룸" subtitle="발로란트 · 배틀그라운드 · 파티 대기실" color="#38bdf8" />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '14%',
          transform: 'translateX(-50%)',
          width: 'min(90%, 1040px)',
          height: '76%',
          background:
            'radial-gradient(circle at 50% 30%, rgba(56,189,248,0.22), transparent 35%), linear-gradient(135deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95))',
          border: '4px solid #38bdf8',
          boxShadow: '0 0 30px rgba(56,189,248,0.35), inset 0 0 30px rgba(56,189,248,0.25)',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '5%',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '10%',
            transform: 'translateX(-50%)',
            color: '#bae6fd',
            fontSize: 'clamp(12px, 1vw, 18px)',
            letterSpacing: 2,
            zIndex: 20,
          }}
        >
          GAME PARTY SCREEN
        </div>

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '54%',
            transform: 'translate(-50%, -50%)',
            width: '92%',
            height: '72%',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            alignItems: 'center',
            justifyItems: 'center',
            gap: 'clamp(8px, 1.5vw, 22px)',
            zIndex: 25,
          }}
        >
          {slots.map((char, index) =>
            char ? (
              <button
                key={char.id}
                type="button"
                onClick={() => setSelectedPlayerId(char.id)}
                style={{
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: "'MaruMinya', monospace",
                }}
              >
                <PlayerCard char={char} />
              </button>
            ) : (
              <EmptyPlayerCard
                key={`empty-${index}`}
                onClick={() => setInviteOpen(true)}
              />
            )
          )}
        </div>

        {selectedPlayer && (
          <PlayerActionModal
            char={selectedPlayer}
            onClose={() => setSelectedPlayerId(null)}
            onExit={() => {
              onMoveCharacterToRoom(selectedPlayer.id, 'afk');
              setSelectedPlayerId(null);
              setInviteOpen(false);
            }}
          />
        )}

        {inviteOpen && (
          <InviteModal
            chars={inviteChars}
            onClose={() => setInviteOpen(false)}
            onInvite={charId => {
              onMoveCharacterToRoom(charId, 'game');
              setInviteOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
}

function PlayerCard({ char }: { char: Character }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 'clamp(82px, 12vw, 130px)',
        aspectRatio: '130 / 270',
        background: '#0f172a',
        border: '3px solid rgba(148,163,184,0.45)',
        boxShadow: '0 0 24px rgba(56,189,248,0.35)',
        flexShrink: 1,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '7.7%',
          top: '5.2%',
          width: '84.6%',
          height: '70.3%',
          background:
            'linear-gradient(135deg, #dbeafe 0%, #7dd3fc 35%, #7c3aed 70%, #111827 100%)',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: '32%', top: '16%' }}>
          <PixelGameAvatar char={char} />
        </div>
        <Lightning left="10%" top="10%" />
        <Lightning left="70%" top="5%" />
        <Lightning left="16%" top="55%" />
      </div>

      <div
        style={{
          position: 'absolute',
          left: '6%',
          right: '6%',
          top: '75.5%',
          height: '6.7%',
          background: '#fef9c3',
          color: '#111827',
          fontSize: 'clamp(7px, 0.75vw, 10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {getDisplayName(char)}
      </div>
    </div>
  );
}

function PlayerActionModal({
  char,
  onClose,
  onExit,
}: {
  char: Character;
  onClose: () => void;
  onExit: () => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(2,6,23,0.72)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(82%, 420px)',
          background: '#020617',
          border: `3px solid ${char.primaryColor}`,
          boxShadow: `0 0 28px ${char.primaryColor}66`,
          padding: '22px',
          textAlign: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            color: char.primaryColor,
            fontSize: 'clamp(15px, 1.2vw, 20px)',
            marginBottom: 10,
            letterSpacing: 2,
          }}
        >
          {getDisplayName(char)}
        </div>

        <div
          style={{
            color: '#94a3b8',
            fontSize: 'clamp(10px, 0.85vw, 14px)',
            marginBottom: 18,
          }}
        >
          이 플레이어의 게임을 종료할까요?
        </div>

        <button
          type="button"
          onClick={onExit}
          style={{
            width: '100%',
            height: 42,
            background: '#7f1d1d',
            border: '2px solid #ef4444',
            color: '#fee2e2',
            cursor: 'pointer',
            fontFamily: "'MaruMinya', monospace",
            marginBottom: 10,
          }}
        >
          게임 종료하기
        </button>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            height: 38,
            background: '#0f172a',
            border: '2px solid #334155',
            color: '#cbd5e1',
            cursor: 'pointer',
            fontFamily: "'MaruMinya', monospace",
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

function EmptyPlayerCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: 'relative',
        width: 'clamp(82px, 12vw, 130px)',
        aspectRatio: '130 / 270',
        background: 'rgba(15,23,42,0.55)',
        border: '3px dashed rgba(148,163,184,0.55)',
        boxShadow: '0 0 18px rgba(148,163,184,0.18)',
        flexShrink: 1,
        cursor: 'pointer',
        fontFamily: "'MaruMinya', monospace",
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '7.7%',
          top: '5.2%',
          width: '84.6%',
          height: '70.3%',
          background:
            'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(2,6,23,0.95))',
          border: '2px solid rgba(148,163,184,0.22)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontSize: 'clamp(26px, 4vw, 44px)',
        }}
      >
        +
      </div>

      <div
        style={{
          position: 'absolute',
          left: '6%',
          right: '6%',
          top: '75.5%',
          height: '6.7%',
          background: '#1e293b',
          color: '#cbd5e1',
          fontSize: 'clamp(7px, 0.7vw, 10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        초대하기
      </div>
    </button>
  );
}

function InviteModal({
  chars,
  onClose,
  onInvite,
}: {
  chars: Character[];
  onClose: () => void;
  onInvite: (charId: string) => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(2,6,23,0.72)',
        zIndex: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(88%, 760px)',
          background: '#020617',
          border: '3px solid #38bdf8',
          boxShadow: '0 0 28px rgba(56,189,248,0.45)',
          padding: '22px',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            color: '#bae6fd',
            fontSize: 'clamp(14px, 1.2vw, 20px)',
            marginBottom: 16,
            letterSpacing: 2,
            textAlign: 'center',
          }}
        >
          게임룸에 초대할 캐릭터 선택
        </div>

        {chars.length === 0 ? (
          <div
            style={{
              color: '#64748b',
              textAlign: 'center',
              padding: '28px 0',
              fontSize: 'clamp(11px, 0.9vw, 15px)',
            }}
          >
            초대 가능한 캐릭터가 없습니다
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 14,
            }}
          >
            {chars.map(char => (
              <button
                key={char.id}
                type="button"
                onClick={() => onInvite(char.id)}
                style={{
                  background: `${char.primaryColor}18`,
                  border: `2px solid ${char.primaryColor}`,
                  boxShadow: `0 0 14px ${char.primaryColor}44`,
                  color: '#e2e8f0',
                  padding: '14px 10px',
                  cursor: 'pointer',
                  fontFamily: "'MaruMinya', monospace",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{char.emoji}</div>
                <div
                  style={{
                    color: char.primaryColor,
                    fontSize: 'clamp(11px, 0.9vw, 15px)',
                    marginBottom: 6,
                  }}
                >
                  {getDisplayName(char)}
                </div>
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: 'clamp(9px, 0.75vw, 12px)',
                  }}
                >
                  {char.role}
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: 18,
            width: '100%',
            height: 38,
            background: '#0f172a',
            border: '2px solid #334155',
            color: '#cbd5e1',
            cursor: 'pointer',
            fontFamily: "'MaruMinya', monospace",
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

function PixelGameAvatar({ char }: { char: Character }) {
  return (
    <svg
      viewBox="0 0 32 42"
      width="clamp(38px, 5vw, 54px)"
      height="clamp(52px, 6.7vw, 72px)"
      style={{ imageRendering: 'pixelated' }}
    >
      <rect x="10" y="4" width="12" height="4" fill={char.hairColor} />
      <rect x="7" y="8" width="18" height="14" fill={char.skinColor} />
      <rect x="5" y="11" width="4" height="5" fill={char.skinColor} />
      <rect x="23" y="11" width="4" height="5" fill={char.skinColor} />
      <rect x="10" y="13" width="3" height="3" fill="#1e1b4b" />
      <rect x="19" y="13" width="3" height="3" fill="#1e1b4b" />
      <rect x="14" y="18" width="4" height="2" fill="#fb7185" />
      <rect x="8" y="22" width="16" height="12" fill={char.primaryColor} />
      <rect x="5" y="25" width="4" height="8" fill="#7dd3fc" />
      <rect x="23" y="25" width="4" height="8" fill="#7dd3fc" />
      <rect x="11" y="34" width="4" height="6" fill="#312e81" />
      <rect x="17" y="34" width="4" height="6" fill="#312e81" />
    </svg>
  );
}

function Lightning({ left, top }: { left: string; top: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: '16%',
        height: '19%',
        background: '#e0f2fe',
        clipPath:
          'polygon(45% 0, 100% 0, 65% 42%, 100% 42%, 30% 100%, 48% 55%, 15% 55%)',
        boxShadow: '0 0 10px #bae6fd',
      }}
    />
  );
}

function AfkRoom({
  chars,
  playerCharId,
  onMoveCharacterToRoom,
}: {
  chars: Character[];
  playerCharId: string | null;
  onMoveCharacterToRoom: (charId: string, room: PanelId) => void;
}) {
  const [localChars, setLocalChars] = useState(chars);

  useEffect(() => {
    setLocalChars(chars);
  }, [chars]);

  useEffect(() => {
    const iv = window.setInterval(() => {
      setLocalChars(prev =>
        prev.map(char => ({
          ...char,
          x: Math.max(10, Math.min(90, char.x + (Math.random() - 0.5) * 14)),
          y: Math.max(28, Math.min(78, char.y + (Math.random() - 0.5) * 10)),
          state: 'walking',
          facing: Math.random() > 0.5 ? 'right' : 'left',
          walkStep: (char.walkStep + 1) % 8,
        }))
      );
    }, 1500);

    return () => window.clearInterval(iv);
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, charId: string) => {
    e.dataTransfer.setData('text/plain', charId);
  };

  return (
    <>
      <BackgroundGrid />

      <RoomTitle
        title="잠수방"
        subtitle="캐릭터를 드래그해서 개발방 · 게임룸 · 카몽집으로 이동"
        color="#fbbf24"
      />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '14%',
          transform: 'translateX(-50%)',
          width: 'min(90%, 1040px)',
          height: '76%',
          background: 'linear-gradient(180deg, #111827 0%, #020617 100%)',
          border: '4px solid #fbbf24',
          boxShadow: '0 0 30px rgba(251,191,36,0.3)',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        <DropZone label="개발방" room="dev" color="#a855f7" left="4%" onMoveCharacterToRoom={onMoveCharacterToRoom} />
        <DropZone label="게임룸" room="game" color="#38bdf8" left="36%" onMoveCharacterToRoom={onMoveCharacterToRoom} />
        <DropZone label="카몽집" room="kamong" color="#94a3b8" left="68%" onMoveCharacterToRoom={onMoveCharacterToRoom} />

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '62%',
            background: 'linear-gradient(rgba(15,23,42,0.4) 0%, rgb(2,6,23) 100%)',
            borderTop: '3px solid rgba(251,191,36,0.35)',
            zIndex: 2,
          }}
        />

        {localChars.map(char => (
          <div
            key={char.id}
            draggable
            onDragStart={e => handleDragStart(e, char.id)}
            style={{
              position: 'absolute',
              left: `${char.x}%`,
              top: `${char.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 30,
              transition: 'left 1.5s linear, top 1.5s linear',
              cursor: 'grab',
            }}
          >
            <CharSprite char={char} isPlayer={char.id === playerCharId} />
          </div>
        ))}
      </div>
    </>
  );
}

function DropZone({
  label,
  room,
  color,
  left,
  onMoveCharacterToRoom,
}: {
  label: string;
  room: PanelId;
  color: string;
  left: string;
  onMoveCharacterToRoom: (charId: string, room: PanelId) => void;
}) {
  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        const charId = e.dataTransfer.getData('text/plain');
        if (charId) onMoveCharacterToRoom(charId, room);
      }}
      style={{
        position: 'absolute',
        left,
        top: '7%',
        width: '28%',
        height: '18%',
        border: `3px dashed ${color}`,
        background: `${color}18`,
        color,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(12px, 1vw, 18px)',
        boxShadow: `0 0 18px ${color}44`,
      }}
    >
      {label} DROP
    </div>
  );
}

function KamongRoom({ chars }: { chars: Character[] }) {
  const [kamongX, setKamongX] = useState(22);
  const [kamongY, setKamongY] = useState(68);
  const [enggdengiX, setEnggdengiX] = useState(70);
  const [enggdengiY, setEnggdengiY] = useState(72);

  const [showVapeGetText, setShowVapeGetText] = useState(false);
  const [showPuffText, setShowPuffText] = useState(false);
  const [showVapeSmoke, setShowVapeSmoke] = useState(false);
  const [yeomtoliJoin, setYeomtoliJoin] = useState(false);

  const [introEventText, setIntroEventText] = useState<string | null>(null);
  const [puffTexts, setPuffTexts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const kamongPosRef = useRef({ x: kamongX, y: kamongY });
  const yeomtoliInRoom = chars.some(char => char.id === 'yeomtoli');
  const kamongInRoom = chars.some(char => char.id === 'kamong');

  useEffect(() => {
    kamongPosRef.current = { x: kamongX, y: kamongY };
  }, [kamongX, kamongY]);

  useEffect(() => {
    setIntroEventText('보석십자수가 방을 점령했습니다.');

    const t = window.setTimeout(() => {
      setIntroEventText(null);
    }, 10000);

    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const iv = window.setInterval(() => {
      setKamongX(prev => Math.max(8, Math.min(88, prev + (Math.random() - 0.5) * 18)));
      setKamongY(prev => Math.max(61, Math.min(84, prev + (Math.random() - 0.5) * 10)));

      setEnggdengiX(prev => Math.max(8, Math.min(88, prev + (Math.random() - 0.5) * 14)));
      setEnggdengiY(prev => Math.max(61, Math.min(84, prev + (Math.random() - 0.5) * 8)));
    }, 1800);

    return () => window.clearInterval(iv);
  }, []);

  useEffect(() => {
    let eventRunning = false;
    let checkIv: number | null = null;
    let puffIv: number | null = null;
    let getTextTimer: number | null = null;
    let endTimer: number | null = null;
    let cooldownTimer: number | null = null;

    const startDelay = window.setTimeout(() => {
      checkIv = window.setInterval(() => {
        if (eventRunning) return;
        if (!kamongInRoom) return;

        const foundVape = Math.random() < 0.45;
        if (!foundVape) return;

        eventRunning = true;

        setIntroEventText(null);
        setShowVapeGetText(true);
        setShowPuffText(false);
        setShowVapeSmoke(true);
        setYeomtoliJoin(yeomtoliInRoom && Math.random() < 0.5);
        setPuffTexts([]);

        getTextTimer = window.setTimeout(() => {
          setShowVapeGetText(false);
          setShowPuffText(true);
        }, 2000);

        puffIv = window.setInterval(() => {
          const { x, y } = kamongPosRef.current;

          setPuffTexts(prev => [
            ...prev.slice(-10),
            {
              id: Date.now() + Math.random(),
              x: x + 2 + Math.random() * 12,
              y: y - 8 - Math.random() * 10,
            },
          ]);
        }, 550);

        endTimer = window.setTimeout(() => {
          if (puffIv) window.clearInterval(puffIv);

          setShowVapeGetText(false);
          setShowPuffText(false);
          setShowVapeSmoke(false);
          setYeomtoliJoin(false);
          setPuffTexts([]);

          cooldownTimer = window.setTimeout(() => {
            eventRunning = false;
          }, 5000);
        }, 10000);
      }, 3000);
    }, 3000);

    return () => {
      window.clearTimeout(startDelay);
      if (checkIv) window.clearInterval(checkIv);
      if (puffIv) window.clearInterval(puffIv);
      if (getTextTimer) window.clearTimeout(getTextTimer);
      if (endTimer) window.clearTimeout(endTimer);
      if (cooldownTimer) window.clearTimeout(cooldownTimer);
    };
  }, [kamongInRoom, yeomtoliInRoom]);

  return (
    <>
      <BackgroundGrid />

      <RoomTitle
        title="카몽집"
        subtitle="전자담배 · 보석십자수 · 만화 캐릭터 굿즈방"
        color="#94a3b8"
      />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '14%',
          transform: 'translateX(-50%)',
          width: 'min(90%, 1040px)',
          height: '76%',
          background: 'linear-gradient(180deg, #111827 0%, #020617 100%)',
          border: '4px solid #94a3b8',
          boxShadow: '0 0 30px rgba(148,163,184,0.35)',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            opacity: 0.5,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: '5%',
            right: '5%',
            top: '7%',
            height: '46%',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 12,
            zIndex: 4,
          }}
        >
          {[
            '#f472b6',
            '#60a5fa',
            '#facc15',
            '#34d399',
            '#c084fc',
            '#fb923c',
            '#f87171',
            '#38bdf8',
            '#a3e635',
            '#e879f9',
            '#fde68a',
            '#94a3b8',
          ].map((color, index) => (
            <PixelDiamondArt key={index} color={color} index={index} />
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '42%',
            background:
              'linear-gradient(rgba(15, 23, 42, 0.4) 0%, rgb(2, 6, 23) 100%)',
            borderTop: '3px solid rgba(148, 163, 184, 0.35)',
            zIndex: 2,
          }}
        />

        {showVapeSmoke && (
          <div
            style={{
              position: 'absolute',
              left: `${kamongX + 7}%`,
              top: `${kamongY - 5}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 36,
              pointerEvents: 'none',
              transition: 'left 1.8s linear, top 1.8s linear',
            }}
          >
            <PixelVape />
          </div>
        )}

        {introEventText && (
          <EventBox color="#94a3b8">EVENT · {introEventText}</EventBox>
        )}

        {showVapeGetText && (
          <EventBox color="#38bdf8">EVENT · 전자담배를 획득했습니다.</EventBox>
        )}

        {showPuffText && (
          <EventBox color="#38bdf8">
            뻐억 뻐억{yeomtoliJoin ? ' · 염톨이 형도 같이 피는 중' : ''}
          </EventBox>
        )}

        {showPuffText &&
          puffTexts.map(puff => (
            <div
              key={puff.id}
              style={{
                position: 'absolute',
                left: `${puff.x}%`,
                top: `${puff.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 45,
                color: '#e2e8f0',
                fontSize: 'clamp(16px, 1.5vw, 26px)',
                textShadow: '0 0 10px rgba(255,255,255,0.8)',
                animation: 'puffText 1.8s ease-out forwards',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              뻐억 뻐억
            </div>
          ))}

        {kamongInRoom && (
          <div
            style={{
              position: 'absolute',
              left: `${kamongX}%`,
              top: `${kamongY}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 25,
              transition: 'left 1.8s linear, top 1.8s linear',
              textAlign: 'center',
            }}
          >
            <BitmapPerson
              name="카몽"
              bodyColor="#94a3b8"
              hairColor="#1f2937"
              skinColor="#fde8a0"
              textColor="#94a3b8"
            />
          </div>
        )}

        {chars.some(char => char.id === 'enggdengi') && (
          <div
            style={{
              position: 'absolute',
              left: `${enggdengiX}%`,
              top: `${enggdengiY}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 25,
              transition: 'left 1.8s linear, top 1.8s linear',
              textAlign: 'center',
            }}
          >
            <BitmapPerson
              name="엉덩이"
              bodyColor="#38bdf8"
              hairColor="#1e1b4b"
              skinColor="#e8c090"
              textColor="#38bdf8"
            />
          </div>
        )}

        {yeomtoliInRoom && (
          <div
            style={{
              position: 'absolute',
              left: '58%',
              top: '74%',
              transform: 'translate(-50%, -50%)',
              zIndex: 25,
              textAlign: 'center',
            }}
          >
            <BitmapPerson
              name="염톨이"
              bodyColor="#fb923c"
              hairColor="#78350f"
              skinColor="#fdd9b5"
              textColor="#fb923c"
            />
          </div>
        )}

        <style>
          {`
            @keyframes puffText {
              0% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
              100% { opacity: 0; transform: translate(-50%, -50%) translateY(-34px); }
            }
          `}
        </style>
      </div>
    </>
  );
}

function EventBox({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '5%',
        transform: 'translateX(-50%)',
        width: 'min(82%, 760px)',
        minHeight: 54,
        background: '#020617',
        border: `3px solid ${color}`,
        boxShadow: `0 0 22px ${color}77`,
        color: '#e2e8f0',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(13px, 1vw, 18px)',
        letterSpacing: 1,
        textAlign: 'center',
        padding: '0 18px',
      }}
    >
      {children}
    </div>
  );
}

function BitmapPerson({
  name,
  bodyColor,
  hairColor,
  skinColor,
  textColor,
}: {
  name: string;
  bodyColor: string;
  hairColor: string;
  skinColor: string;
  textColor: string;
}) {
  return (
    <>
      <svg
        viewBox="0 0 16 24"
        width="58"
        height="86"
        style={{
          imageRendering: 'pixelated',
          display: 'block',
          filter: `drop-shadow(0 0 10px ${textColor}88)`,
        }}
      >
        <rect x="4" y="1" width="8" height="8" fill={skinColor} />
        <rect x="3" y="0" width="10" height="3" fill={hairColor} />
        <rect x="3" y="2" width="1" height="3" fill={hairColor} />
        <rect x="12" y="1" width="1" height="2" fill={hairColor} />
        <rect x="6" y="4" width="1" height="2" fill="#0d0d1a" />
        <rect x="9" y="4" width="1" height="2" fill="#0d0d1a" />
        <rect x="7" y="7" width="2" height="1" fill="#c0706a" />
        <rect x="3" y="9" width="10" height="8" fill={bodyColor} />
        <rect x="1" y="9" width="2" height="7" fill={bodyColor} />
        <rect x="13" y="9" width="2" height="7" fill={bodyColor} />
        <rect x="1" y="16" width="2" height="2" fill={skinColor} />
        <rect x="13" y="16" width="2" height="2" fill={skinColor} />
        <rect x="4" y="17" width="3" height="6" fill="#1e1b4b" />
        <rect x="9" y="17" width="3" height="5" fill="#1e1b4b" />
      </svg>

      <div
        style={{
          marginTop: 4,
          color: textColor,
          fontSize: 'clamp(9px, 0.75vw, 13px)',
          textShadow: `0 0 8px ${textColor}`,
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </div>
    </>
  );
}

function PixelDiamondArt({ color, index }: { color: string; index: number }) {
  return (
    <div
      style={{
        position: 'relative',
        background: '#f8fafc',
        border: `3px solid ${color}`,
        boxShadow: `0 0 14px ${color}66`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
          backgroundSize: '7px 7px',
          opacity: 0.75,
        }}
      />

      <svg
        viewBox="0 0 28 28"
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          inset: 0,
          imageRendering: 'pixelated',
        }}
      >
        <rect x="8" y="3" width="12" height="4" fill={color} />
        <rect x="5" y="7" width="18" height="5" fill={index % 2 === 0 ? '#fde68a' : '#bfdbfe'} />
        <rect x="4" y="12" width="20" height="7" fill={index % 3 === 0 ? '#f9a8d4' : '#ddd6fe'} />
        <rect x="7" y="19" width="14" height="4" fill={color} />

        <rect x="8" y="9" width="3" height="3" fill="#0f172a" />
        <rect x="17" y="9" width="3" height="3" fill="#0f172a" />
        <rect x="12" y="14" width="4" height="2" fill="#ef4444" />

        <rect x="2" y="4" width="3" height="3" fill={color} />
        <rect x="23" y="4" width="3" height="3" fill={color} />
        <rect x="2" y="21" width="3" height="3" fill={color} />
        <rect x="23" y="21" width="3" height="3" fill={color} />
      </svg>
    </div>
  );
}

function PixelVape() {
  return (
    <svg
      viewBox="0 0 70 46"
      width="104"
      height="68"
      style={{
        imageRendering: 'pixelated',
        filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.9))',
      }}
    >
      <rect x="8" y="28" width="34" height="6" fill="#e2e8f0" />
      <rect x="42" y="26" width="10" height="10" fill="#38bdf8" />
      <rect x="4" y="29" width="5" height="4" fill="#94a3b8" />
      <rect x="13" y="30" width="20" height="2" fill="#64748b" />
      <rect x="46" y="29" width="3" height="3" fill="#0f172a" />

      <rect x="50" y="12" width="6" height="6" fill="#e0f2fe" opacity="0.75" />
      <rect x="56" y="6" width="8" height="8" fill="#f8fafc" opacity="0.55" />
      <rect x="42" y="4" width="5" height="5" fill="#e0f2fe" opacity="0.45" />
    </svg>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { ChatMessage, Character } from '../../App';

interface Props {
  messages: ChatMessage[];
  chars: Character[];
  playerCharId: string | null;
  onSendMessage: (text: string) => void;
}

export function ChatBox({ messages, chars, playerCharId, onSendMessage }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const playerChar = chars.find(c => c.id === playerCharId);

  const fmtTime = (d: Date) => {
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || !playerCharId) return;
    onSendMessage(trimmed);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div
      className="flex flex-col shrink-0"
      style={{
        width: '100%',
        height: '100%',
        background: '#070712',
        borderLeft: '1px solid #14143a',
        fontFamily: "'MaruMinya', monospace",
      }}
    >
      <div
        className="flex items-center gap-2 shrink-0"
        style={{
          height: 54,
          padding: '0 14px',
          borderBottom: '2px solid #14143a',
          background: '#090914',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
          }}
        />
        <span style={{ fontSize: 'clamp(11px, 0.85vw, 14px)', color: '#4ade80' }}># 친구들의-방</span>
        <div className="flex-1" />
        <span style={{ fontSize: 'clamp(8px, 0.65vw, 11px)', color: '#64748b' }}>{messages.length}개</span>
      </div>

      <div
        className="shrink-0 flex gap-2 items-center flex-wrap"
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid #0d0d2a',
        }}
      >
        <span style={{ fontSize: 'clamp(8px, 0.65vw, 10px)', color: '#64748b' }}>온라인</span>
        {chars.map(c => (
          <div key={c.id} className="flex items-center gap-1" title={c.fullName}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: c.primaryColor,
                boxShadow: `0 0 5px ${c.primaryColor}`,
              }}
            />
            <span
              style={{
                fontSize: 'clamp(8px, 0.65vw, 10px)',
                color: c.id === playerCharId ? '#fbbf24' : c.primaryColor,
                whiteSpace: 'nowrap',
              }}
            >
              {c.name}
              {c.id === playerCharId ? ' ★' : ''}
            </span>
          </div>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{
          padding: '10px 0',
          scrollbarWidth: 'thin',
          scrollbarColor: '#1e1e3a transparent',
        }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
            <span style={{ fontSize: 'clamp(20px, 1.5vw, 28px)' }}>🌧️</span>
            <span style={{ fontSize: 'clamp(10px, 0.75vw, 12px)', color: '#64748b', textAlign: 'center' }}>
              고요한 새벽...
            </span>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className="flex items-start gap-3"
            style={{
              padding: '7px 12px',
              background: msg.isPlayer
                ? 'rgba(251,191,36,0.06)'
                : msg.isReaction
                ? 'rgba(255,255,255,0.02)'
                : 'transparent',
            }}
          >
            <div
              className="shrink-0 flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                marginTop: 2,
                background: `${msg.color}18`,
                border: `1px solid ${msg.isPlayer ? '#fbbf24' : msg.color}55`,
              }}
            >
              <div
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  background: msg.isPlayer ? '#fbbf24' : msg.color,
                  boxShadow: `0 0 6px ${msg.isPlayer ? '#fbbf24' : msg.color}`,
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontSize: 'clamp(9px, 0.7vw, 11px)',
                    color: msg.isPlayer ? '#fbbf24' : msg.color,
                    textShadow: msg.isPlayer ? '0 0 6px #fbbf2466' : 'none',
                  }}
                >
                  {msg.charName}
                  {msg.isPlayer ? ' ★' : ''}
                </span>
                <span style={{ fontSize: 'clamp(7px, 0.6vw, 9px)', color: '#475569' }}>{fmtTime(msg.time)}</span>
                {msg.isReaction && <span style={{ fontSize: 'clamp(7px, 0.6vw, 9px)', color: '#38bdf8' }}>↩</span>}
              </div>

              <div
                style={{
                  color: msg.isPlayer ? '#fde68a' : '#cbd5e1',
                  wordBreak: 'break-word',
                  lineHeight: 1.55,
                  fontSize: 'clamp(10px, 0.75vw, 13px)',
                  marginTop: 3,
                }}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        <div className="px-3 py-2 flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#334155',
                  animation: `bounce 1s ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 'clamp(8px, 0.65vw, 10px)', color: '#475569' }}>누군가 입력 중...</span>
        </div>
      </div>

      {playerChar ? (
        <div
          className="shrink-0"
          style={{
            padding: 12,
            borderTop: '2px solid #14143a',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#fbbf24',
                boxShadow: '0 0 6px #fbbf24',
              }}
            />
            <span style={{ fontSize: 'clamp(8px, 0.65vw, 10px)', color: '#fbbf24' }}>
              {playerChar.name}으로 입력 중
            </span>
            <span style={{ fontSize: 'clamp(7px, 0.6vw, 9px)', color: '#64748b', marginLeft: 'auto' }}>
              Enter
            </span>
          </div>

          <div
            className="flex items-center gap-2"
            style={{
              padding: '8px 9px',
              background: '#0f0f1e',
              border: `1px solid ${playerChar.primaryColor}66`,
              boxShadow: `0 0 10px ${playerChar.primaryColor}22`,
            }}
          >
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지 보내기..."
              maxLength={60}
              style={{
                flex: 1,
                minWidth: 0,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e2e8f0',
                fontFamily: "'MaruMinya', monospace",
                fontSize: 'clamp(10px, 0.75vw, 13px)',
                lineHeight: 1.3,
              }}
            />

            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              style={{
                background: inputValue.trim() ? playerChar.primaryColor : '#1e1e3a',
                border: 'none',
                color: '#fff',
                padding: '6px 10px',
                fontSize: 14,
                cursor: inputValue.trim() ? 'pointer' : 'default',
                fontFamily: "'MaruMinya', monospace",
                opacity: inputValue.trim() ? 1 : 0.4,
              }}
            >
              →
            </button>
          </div>

          <div style={{ marginTop: 8, fontSize: 'clamp(7px, 0.6vw, 9px)', color: '#38648f', lineHeight: 1.4 }}>
            💡 “발로 ㄱ?” “배그 킬게요” 입력 시 게임룸 이동
          </div>
        </div>
      ) : (
        <div className="shrink-0" style={{ padding: 12, borderTop: '2px solid #14143a' }}>
          <div style={{ padding: 12, background: '#0f0f1e', border: '1px solid #1e1e3a' }}>
            <span style={{ fontSize: 'clamp(9px, 0.7vw, 11px)', color: '#64748b' }}>#방에서 메시지 보내기</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
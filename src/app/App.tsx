import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { CharacterSelect } from './components/CharacterSelect';
import { TopBar } from './components/layout/TopBar';
import { LeftRooms } from './components/layout/LeftRooms';
import { CenterArea } from './components/layout/CenterArea';
import { RightPanel } from './components/layout/RightPanel';
import { ChatBox } from './components/layout/ChatBox';

export type CharacterState = 'walking' | 'sitting' | 'lying' | 'idle';
export type CharacterPersonality = 'intense' | 'social' | 'lazy' | 'passive' | 'calm';
export type PanelId = 'dev' | 'game' | 'kamong';
export type GameType = 'pubg' | 'valorant' | null;

export interface Character {
  id: string;
  name: string;
  fullName: string;
  age: number;
  gender: 'f' | 'm';
  role: string;
  primaryColor: string;
  hairColor: string;
  skinColor: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  state: CharacterState;
  facing: 'left' | 'right';
  speechBubble: string | null;
  speechTimer: number;
  dialogues: string[];
  reactDialogues: Record<string, string[]>;
  personality: CharacterPersonality;
  emoji: string;
  online: boolean;
  walkStep: number;
}

export interface ChatMessage {
  id: number;
  charId: string;
  charName: string;
  color: string;
  text: string;
  time: Date;
  isReaction?: boolean;
  isPlayer?: boolean;
}

// ── Game positions (when gaming, sit in a row) ────────────────────────────────

const GAME_POSITIONS: Record<string, { x: number; y: number }> = {
  minseon:   { x: 10, y: 40 },
  yeomtoli:  { x: 26, y: 40 },
  kamong:    { x: 42, y: 40 },
  kyunggeun: { x: 58, y: 40 },
  enggdengi: { x: 74, y: 40 },
};

// ── Movement ──────────────────────────────────────────────────────────────────

function pickTarget(char: Character): { x: number; y: number; state: CharacterState } {
  const r = Math.random();
  if (char.personality === 'lazy') {
    if (r < 0.6) return { x: 68 + Math.random() * 18, y: 55 + Math.random() * 22, state: 'lying' };
    if (r < 0.82) return { x: 50 + Math.random() * 35, y: 48 + Math.random() * 30, state: 'idle' };
    return { x: 20 + Math.random() * 55, y: 20 + Math.random() * 50, state: 'walking' };
  }
  if (char.personality === 'intense') {
    if (r < 0.5) return { x: 8 + Math.random() * 18, y: 22 + Math.random() * 22, state: 'sitting' };
    if (r < 0.72) return { x: 8 + Math.random() * 35, y: 18 + Math.random() * 40, state: 'idle' };
    return { x: 8 + Math.random() * 55, y: 18 + Math.random() * 55, state: 'walking' };
  }
  if (char.personality === 'social') {
    return { x: 10 + Math.random() * 78, y: 12 + Math.random() * 68, state: 'walking' };
  }
  return {
    x: Math.max(8, Math.min(88, 15 + Math.random() * 65)),
    y: Math.max(12, Math.min(82, 15 + Math.random() * 60)),
    state: r < 0.45 ? 'walking' : 'idle',
  };
}

function detectGameType(text: string): GameType {
  const t = text.toLowerCase();
  if (t.includes('배그') || t.includes('pubg') || t.includes('배틀그라운드')) return 'pubg';
  if (t.includes('발로') || t.includes('valorant') || t.includes('발로란트')) return 'valorant';
  return null;
}

const GAME_KEYWORDS = ['발로', '배그', 'pubg', '게임', 'ㄱ?', '하자', '한판', '발로란트', '배틀'];

function hasGameKeyword(text: string) {
  return GAME_KEYWORDS.some(k => text.toLowerCase().includes(k));
}

// ── Initial characters ────────────────────────────────────────────────────────

const INITIAL_CHARS: Character[] = [
  {
    id: 'minseon',
    name: '민선',
    fullName: '김민선',
    age: 24,
    gender: 'f',
    role: '열정 코더',
    primaryColor: '#a855f7',
    hairColor: '#0d0d1a',
    skinColor: '#f0c8a0',
    x: 12,
    y: 35,
    targetX: 12,
    targetY: 35,
    state: 'sitting',
    facing: 'right',
    speechBubble: null,
    speechTimer: 0,
    dialogues: ['야 시끄러워', '배포 망했어 ㅡㅡ', '왜 이게 안 돼', '집중 좀...', '진짜 미치겠다', 'npm 또 오류', '잠깐만'],
    reactDialogues: {
      enggdengi: ['...알았어', '고마워'],
      yeomtoli: ['야 지금 바빠', '잠깐만'],
    },
    personality: 'intense',
    emoji: '👩‍💻',
    online: true,
    walkStep: 0,
  },
  {
    id: 'yeomtoli',
    name: '염톨이',
    fullName: '염톨이',
    age: 29,
    gender: 'm',
    role: '사회적 리더',
    primaryColor: '#38bdf8',
    hairColor: '#1e1b4b',
    skinColor: '#e8c090',
    x: 50,
    y: 50,
    targetX: 50,
    targetY: 50,
    state: 'walking',
    facing: 'right',
    speechBubble: null,
    speechTimer: 0,
    dialogues: ['야야야 들어봐', '발로 ㄱ?', '배그 킬게요', 'ㅋㅋㅋ 진짜?', '야 진정해!!', '다들 뭐해 ㅋㅋ', '치킨 먹자'],
    reactDialogues: {
      minseon: ['민선아 진정해', '야 괜찮아?'],
      kamong: ['카몽 일어나 ㅋㅋ', '야 자냐?'],
    },
    personality: 'social',
    emoji: '🎮',
    online: true,
    walkStep: 0,
  },
  {
    id: 'kamong',
    name: '카몽',
    fullName: '카몽',
    age: 27,
    gender: 'm',
    role: '홈바디',
    primaryColor: '#94a3b8',
    hairColor: '#1f2937',
    skinColor: '#fde8a0',
    x: 74,
    y: 65,
    targetX: 74,
    targetY: 65,
    state: 'lying',
    facing: 'left',
    speechBubble: null,
    speechTimer: 0,
    dialogues: ['집', '나 졸려', '배고파', '...', 'ㅋ', '어', '그래', '뭐', '잠깐'],
    reactDialogues: {
      yeomtoli: ['어', '알겠어'],
      minseon: ['ㅋ', '...'],
    },
    personality: 'lazy',
    emoji: '😴',
    online: true,
    walkStep: 0,
  },
  {
    id: 'kyunggeun',
    name: '변경근',
    fullName: '변경근',
    age: 23,
    gender: 'm',
    role: '막내',
    primaryColor: '#34d399',
    hairColor: '#111827',
    skinColor: '#fcd9b0',
    x: 44,
    y: 48,
    targetX: 44,
    targetY: 48,
    state: 'idle',
    facing: 'right',
    speechBubble: null,
    speechTimer: 0,
    dialogues: ['알겠습니당', '저도요...', 'ㄴ네', '어 어 맞아요', '죄송합니다 ㅎ', '저 해볼게요!', '네넵'],
    reactDialogues: {
      yeomtoli: ['알겠습니당', '넵!'],
      minseon: ['괜찮으세요...?', '도와드릴까요?'],
    },
    personality: 'passive',
    emoji: '🙂',
    online: true,
    walkStep: 0,
  },
  {
    id: 'enggdengi',
    name: '엉덩이',
    fullName: '엉덩이',
    age: 27,
    gender: 'm',
    role: '감정 지지',
    primaryColor: '#fb923c',
    hairColor: '#78350f',
    skinColor: '#fdd9b5',
    x: 32,
    y: 55,
    targetX: 32,
    targetY: 55,
    state: 'idle',
    facing: 'right',
    speechBubble: null,
    speechTimer: 0,
    dialogues: ['괜찮아 괜찮아', '다들 진정하자', '밥은 먹었어?', '사이좋게 하자', 'ㅎㅎ', '민선아 잠깐', '나는 다 좋아'],
    reactDialogues: {
      minseon: ['민선아 잠깐 쉬어', '괜찮아?'],
      yeomtoli: ['ㅎㅎ 맞아', '좋지'],
    },
    personality: 'calm',
    emoji: '🫂',
    online: true,
    walkStep: 0,
  },
];

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [gamePhase, setGamePhase] = useState<'select' | 'playing'>('select');
  const [playerCharId, setPlayerCharId] = useState<string | null>(null);
  const [chars, setChars] = useState<Character[]>(INITIAL_CHARS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<PanelId>('dev');
  const [gameType, setGameType] = useState<GameType>(null);
  const [gameTriggered, setGameTriggered] = useState(false);
  const [enggdengiAtKamong, setEnggdengiAtKamong] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const gameTimeRef = useRef(new Date());
  const [displayTime, setDisplayTime] = useState(new Date());
  const idleTimersRef = useRef<Record<string, number>>({});
  const gameTriggeredRef = useRef(false);

  const enterGame = useCallback((charId: string) => {
    setPlayerCharId(charId);
    setGamePhase('playing');
  }, []);

  const addMessage = useCallback((charId: string, text: string, opts?: { isReaction?: boolean; isPlayer?: boolean }) => {
    const char = INITIAL_CHARS.find(c => c.id === charId)!;
    setMessages(prev => [
      ...prev.slice(-80),
      { id: Date.now() + Math.random(), charId, charName: char.name, color: char.primaryColor, text, time: new Date(gameTimeRef.current), ...opts },
    ]);
  }, []);

  const triggerGame = useCallback((type: GameType) => {
    if (gameTriggeredRef.current) return;
    gameTriggeredRef.current = true;
    setGameTriggered(true);
    setGameType(type);
    setSelectedPanel('game');

    const label = type === 'pubg' ? '배틀그라운드' : type === 'valorant' ? '발로란트' : '게임';
    setNotification(`🎮 ${label} 시작!! 전원 게임 중...`);
    setTimeout(() => addMessage('kyunggeun', '알겠습니당', { isReaction: true }), 700);
    setTimeout(() => addMessage('kamong', '...어', { isReaction: true }), 1500);
    setTimeout(() => addMessage('enggdengi', '좋지 ㅎㅎ', { isReaction: true }), 2000);

    setTimeout(() => {
      setChars(prev => prev.map(c => {
        const pos = GAME_POSITIONS[c.id] ?? { x: 50, y: 40 };
        return { ...c, targetX: pos.x, targetY: pos.y, state: 'walking' };
      }));
    }, 2500);

    setTimeout(() => {
      setChars(prev =>
        prev.map(c => {
          const pos = GAME_POSITIONS[c.id] ?? { x: 50, y: 40 };
          return {
            ...c,
            x: pos.x,
            y: pos.y,
            targetX: pos.x,
            targetY: pos.y,
            state: 'sitting',
          };
        })
      );
      setNotification(null);
    }, 5500);
  }, [addMessage]);

  const sendPlayerMessage = useCallback((text: string) => {
    if (!playerCharId || !text.trim()) return;
    addMessage(playerCharId, text, { isPlayer: true });
    setChars(prev => prev.map(c => c.id === playerCharId ? { ...c, speechBubble: text, speechTimer: 5 } : c));

    const detected = detectGameType(text);
    if (hasGameKeyword(text) && !gameTriggeredRef.current) {
      setTimeout(() => triggerGame(detected), 1200);
    }

    const reactors = INITIAL_CHARS.filter(c => c.id !== playerCharId);
    if (Math.random() < 0.7) {
      const reactor = reactors[Math.floor(Math.random() * reactors.length)];
      const reacts = reactor.reactDialogues[playerCharId];
      const line = reacts ? reacts[Math.floor(Math.random() * reacts.length)] : reactor.dialogues[Math.floor(Math.random() * reactor.dialogues.length)];
      setTimeout(() => {
        addMessage(reactor.id, line, { isReaction: true });
        setChars(prev => prev.map(c => c.id === reactor.id ? { ...c, speechBubble: line, speechTimer: 5 } : c));
      }, 900 + Math.random() * 900);
    }
  }, [playerCharId, addMessage, triggerGame]);

  useEffect(() => {
    const iv = setInterval(() => {
      gameTimeRef.current = new Date();
      setDisplayTime(new Date());
    }, 1000);

    return () => clearInterval(iv);
  }, []);

  // Movement loop
  useEffect(() => {
    const iv = setInterval(() => {
      setChars(prev => prev.map(char => {
        if (char.state === 'sitting' || char.state === 'lying' || char.state === 'idle') {
          const t = (idleTimersRef.current[char.id] ?? 0) - 50;
          if (t <= 0 && !gameTriggeredRef.current) {
            const next = pickTarget(char);
            idleTimersRef.current[char.id] = 2200 + Math.random() * 5500;
            return { ...char, targetX: next.x, targetY: next.y, state: next.state === 'sitting' || next.state === 'lying' ? next.state : 'walking' };
          }
          idleTimersRef.current[char.id] = t;
          return char;
        }
        const dx = char.targetX - char.x;
        const dy = char.targetY - char.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.0) {
          const next = pickTarget(char);
          idleTimersRef.current[char.id] = 2000 + Math.random() * 4500;
          return { ...char, x: char.targetX, y: char.targetY, state: gameTriggeredRef.current ? 'sitting' : next.state, targetX: next.x, targetY: next.y, facing: dx >= 0 ? 'right' : 'left', walkStep: 0 };
        }
        const speed = char.personality === 'social' ? 0.32 : char.personality === 'lazy' ? 0.14 : 0.24;
        return { ...char, x: char.x + (dx / dist) * speed, y: char.y + (dy / dist) * speed, state: 'walking', facing: dx >= 0 ? 'right' : 'left', walkStep: (char.walkStep + 1) % 8 };
      }));
    }, 50);
    return () => clearInterval(iv);
  }, []);

  // Dialogue
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        setChars(prev => {
          const idx = Math.floor(Math.random() * prev.length);
          const speaker = prev[idx];
          const line = speaker.dialogues[Math.floor(Math.random() * speaker.dialogues.length)];
          addMessage(speaker.id, line);

          const detected = detectGameType(line);
          if ((detected || hasGameKeyword(line)) && !gameTriggeredRef.current) {
            setTimeout(() => triggerGame(detected), 2000);
          }

          if (Math.random() < 0.5) {
            const others = prev.filter((_, i) => i !== idx);
            const reactor = others[Math.floor(Math.random() * others.length)];
            const reacts = reactor.reactDialogues[speaker.id];
            const reactLine = reacts ? reacts[Math.floor(Math.random() * reacts.length)] : reactor.dialogues[Math.floor(Math.random() * reactor.dialogues.length)];
            setTimeout(() => {
              addMessage(reactor.id, reactLine, { isReaction: true });
              setChars(c => c.map(ch => ch.id === reactor.id ? { ...ch, speechBubble: reactLine, speechTimer: 5 } : ch));
            }, 1000 + Math.random() * 1200);
          }

          return prev.map((c, i) => i === idx ? { ...c, speechBubble: line, speechTimer: 5 } : c);
        });
        schedule();
      }, 2500 + Math.random() * 2800);
    };
    schedule();
    return () => clearTimeout(t);
  }, [addMessage, triggerGame]);

  // Speech bubble timer
  useEffect(() => {
    const iv = setInterval(() => {
      setChars(prev => prev.map(c => ({
        ...c,
        speechBubble: c.speechTimer > 0 ? c.speechBubble : null,
        speechTimer: Math.max(0, c.speechTimer - 0.4),
      })));
    }, 400);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      if (gameTriggeredRef.current || enggdengiAtKamong) return;

      if (Math.random() < 0.07) {
        setEnggdengiAtKamong(true);
        addMessage('enggdengi', '카몽아 나 왔어 ㅎㅎ');

        setTimeout(() => {
          setEnggdengiAtKamong(false);
        }, 80000 + Math.random() * 40000);
      }
    }, 8000);

    return () => clearInterval(iv);
  }, [addMessage, enggdengiAtKamong]);

  useEffect(() => {
    const seedMessages: Array<[string, string]> = [
      ['kamong', '집'],
      ['yeomtoli', '또 시작이네 ㅋㅋ'],
      ['kyunggeun', '알겠습니당'],
      ['enggdengi', '다들 왔어? ㅎㅎ'],
      ['minseon', '코딩하는데 집중 좀...'],
    ];

    seedMessages.forEach(([id, text], i) => {
      setTimeout(() => addMessage(id, text), i * 700);
    });
  }, [addMessage]);

  if (gamePhase === 'select') {
    return (
      <CharacterSelect
        chars={INITIAL_CHARS}
        displayTime={displayTime}
        onSelect={enterGame}
      />
    );
  }

  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col"
      style={{
        background: '#04040a',
        fontFamily: "'MaruMinya', monospace",
      }}
    >
      <TopBar chars={chars} displayTime={displayTime} />

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            style={{
              background: 'linear-gradient(90deg,#7c3aed,#2563eb)',
              color: '#fff',
              textAlign: 'center',
              padding: '8px 16px',
              fontSize: 'clamp(10px, 0.75vw, 14px)',
              letterSpacing: 1,
              boxShadow: '0 4px 20px rgba(124,58,237,0.6)',
              zIndex: 100,
              flexShrink: 0,
              fontFamily: "'MaruMinya', monospace",
            }}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          width: '100%',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'clamp(150px, 14vw, 220px) minmax(0, 1fr) clamp(260px, 26vw, 400px) clamp(210px, 18vw, 260px)',
        }}
      >
        <LeftRooms
          selectedPanel={selectedPanel}
          onSelectPanel={setSelectedPanel}
          gameType={gameType}
          gameTriggered={gameTriggered}
          enggdengiAtKamong={enggdengiAtKamong}
        />

        <CenterArea chars={chars} playerCharId={playerCharId} />

        <RightPanel
          selectedPanel={selectedPanel}
          gameType={gameType}
          gameTriggered={gameTriggered}
        />

        <ChatBox
          messages={messages}
          chars={chars}
          playerCharId={playerCharId}
          onSendMessage={sendPlayerMessage}
        />
      </div>
    </div>
  );
}

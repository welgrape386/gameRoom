import { useState, useEffect, useRef } from 'react';

const CODE_SNIPPETS = [
  `import { useState } from 'react';\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  return <div onClick={() => setCount(c => c + 1)}>{count}</div>;\n}\n\n`,
  `const fetchData = async () => {\n  try {\n    const res = await fetch('/api/users');\n    const data = await res.json();\n    console.log(data);\n  } catch (err) {\n    console.error('Error:', err);\n  }\n};\n\n`,
  `interface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\nconst users: User[] = [];\n\n`,
  `const styles = {\n  container: {\n    display: 'flex',\n    flexDirection: 'column',\n    gap: '1rem',\n  },\n  button: {\n    background: '#a855f7',\n    color: 'white',\n  },\n};\n\n`,
  `function debounce(fn: Function, ms: number) {\n  let timer: ReturnType<typeof setTimeout>;\n  return function(...args: any[]) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}\n\n`,
  `const calculateTotal = (items) => {\n  return items.reduce((sum, item) => {\n    return sum + item.price * item.quantity;\n  }, 0);\n};\n\n`,
];

export function DevTerminal() {
  const [lines, setLines] = useState<string[]>(['$ npm run dev', '']);
  const [currentSnippet, setCurrentSnippet] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const snippetIndexRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const snippet = CODE_SNIPPETS[snippetIndexRef.current];
    
    if (charIndex < snippet.length) {
      const timer = setTimeout(() => {
        setCurrentSnippet(prev => prev + snippet[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 15 + Math.random() * 35);
      return () => clearTimeout(timer);
    } else {
      // Snippet complete, wait then start next
      const timer = setTimeout(() => {
        setLines(prev => [...prev, currentSnippet, '']);
        setCurrentSnippet('');
        setCharIndex(0);
        snippetIndexRef.current = (snippetIndexRef.current + 1) % CODE_SNIPPETS.length;
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [charIndex, currentSnippet]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, currentSnippet]);

  return (
    <div className="size-full flex flex-col" style={{ background: '#0d0d12', fontFamily: 'monospace' }}>
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#1a1a22', borderBottom: '1px solid #2a2a3a' }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10b981' }} />
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#a855f7', opacity: 0.7 }}>민선@dev-machine ~ /project</div>
      </div>

      {/* Terminal content */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4" style={{ color: '#c9d1d9', fontFamily: 'monospace', fontSize: 15, lineHeight: 1.8 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre-wrap', color: line.startsWith('$') ? '#a855f7' : '#c9d1d9' }}>
            {line}
          </div>
        ))}
        <div style={{ whiteSpace: 'pre-wrap', color: '#c9d1d9' }}>
          {currentSnippet}<span className="animate-pulse" style={{ color: '#a855f7' }}>▊</span>
        </div>
      </div>
    </div>
  );
}

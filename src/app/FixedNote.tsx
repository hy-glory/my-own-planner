'use client';
import { useState, useEffect } from 'react';

interface Line {
  id: number;
  text: string;
  type: 'task' | 'memo';
  time?: string;
  done?: boolean;
}

const FixedNote = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('weekly_notes');
    if (saved) setLines(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('weekly_notes', JSON.stringify(lines));
  }, [lines]);

  const addLine = (raw: string) => {
    if (!raw.trim()) return;

    let type: 'task' | 'memo' = 'memo';
    let done = false;
    let text = raw.trim();

    if (text.startsWith('- ')) {
      type = 'task';
      text = text.slice(2).trim();
    }

    const newLine: Line = {
      id: Date.now(),
      text,
      type,
      done,
    };

    setLines([...lines, newLine]);
    setInputValue('');
  };

  const toggleTask = (id: number) => {
    setLines(
      lines.map((l) => (l.id === id ? { ...l, done: !l.done } : l))
    );
  };

  const deleteLine = (id: number) => {
    setLines(lines.filter((l) => l.id !== id));
  };

  const memos = lines.filter((l) => l.type === 'memo');
  const incomplete = lines.filter(
    (l) => l.type === 'task' && !l.done
  );
  const complete = lines.filter((l) => l.type === 'task' && l.done);

  return (
    <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
      <h2 className="font-bold mb-2">📌 메모장</h2>

      {memos.map((l) => (
        <div
          key={l.id}
          className="flex items-center mb-1 text-gray-700"
        >
          <span className="flex-1 whitespace-pre-line">
            📍 {l.text}
          </span>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => deleteLine(l.id)}
          >
            X
          </button>
        </div>
      ))}

      {incomplete.map((l) => (
        <div
          key={l.id}
          className="flex items-center mb-1 border-b border-gray-300 py-1"
        >
          <input
            type="checkbox"
            checked={l.done}
            onChange={() => toggleTask(l.id)}
            className="mr-2"
          />
          <span className="flex-1">{l.text}</span>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => deleteLine(l.id)}
          >
            X
          </button>
        </div>
      ))}

      {complete.length > 0 && (
        <div className="mt-4">
          {complete.map((l) => (
            <div
              key={l.id}
              className="flex items-center mb-1 text-gray-400"
            >
              <input
                type="checkbox"
                checked={l.done}
                onChange={() => toggleTask(l.id)}
                className="mr-2"
              />
              <span className="flex-1 line-through">{l.text}</span>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => deleteLine(l.id)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        placeholder="내용 추가"
        className="border-0 border-b border-gray-300 focus:outline-none focus:border-sky-400 px-2 py-1 w-full mt-2 resize-none"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addLine(inputValue);
          }
        }}
      />
    </div>
  );
};

export default FixedNote;

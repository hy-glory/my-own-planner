'use client';
import { useState, useEffect } from 'react';

interface Line {
  id: number;
  text: string;
  type: 'task' | 'memo';
  time?: string;
  done?: boolean;
  date: string;
}

const DailyNote = ({ selectedDate }: { selectedDate: Date }) => {
  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(d.getDate()).padStart(2, '0')}`;

  const todayKey = formatDate(selectedDate);
  const [lines, setLines] = useState<Line[]>([]);
  const [inputValue, setInputValue] = useState('');

  // LS에서 가져오기
  useEffect(() => {
    const saved = localStorage.getItem('daily_notes');
    if (saved) setLines(JSON.parse(saved));
  }, []);

  // LS에 저장
  useEffect(() => {
    localStorage.setItem('daily_notes', JSON.stringify(lines));
  }, [lines]);

  // line 추가
  const addLine = (raw: string) => {
    if (!raw.trim()) return;

    let type: 'task' | 'memo' = 'memo';
    const done = false;
    let text = raw.trim();
    let time: string | undefined = undefined;

    if (text.startsWith('- ')) {
      type = 'task';
      text = text.slice(2).trim();
    }

    const match = text.match(/@(\d{3,4})$/);
    if (match) {
      const rawTime = match[1];
      if (rawTime.length === 3) {
        time = `0${rawTime[0]}:${rawTime.slice(1)}`;
      } else {
        time = `${rawTime.slice(0, 2)}:${rawTime.slice(2)}`;
      }
      text = text.replace(/@\d{3,4}$/, '').trim();
    }

    const newLine: Line = {
      id: Date.now(),
      text,
      type,
      time,
      done,
      date: todayKey,
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

  const todayLines = lines.filter((l) => l.date === todayKey);
  const memos = todayLines.filter((l) => l.type === 'memo');
  const sortByTime = (arr: Line[]) =>
    [...arr].sort((a, b) => {
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      return 0;
    });
  const incomplete = sortByTime(
    todayLines.filter((l) => l.type === 'task' && !l.done)
  );
  const complete = sortByTime(
    todayLines.filter((l) => l.type === 'task' && l.done)
  );

  return (
    <div className="p-2 bg-sky-50 rounded-md border border-sky-200">
      <h2 className="font-bold mb-2">
        📆{' '}
        {selectedDate.toLocaleDateString('ko-KR', {
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })}
      </h2>

      {memos.map((l) => (
        <div key={l.id} className="flex items-center mb-1">
          📍
          <span className="whitespace-pre-line">{l.text}</span>
          <button
            className="ml-auto text-gray-400 hover:text-gray-600"
            onClick={() => deleteLine(l.id)}
          >
            x
          </button>
        </div>
      ))}

      {incomplete.map((l) => (
        <div
          key={l.id}
          className="flex items-center gap-2 mb-1 border-b border-gray-300 py-1"
        >
          <input
            type="checkbox"
            checked={l.done}
            onChange={() => toggleTask(l.id)}
          />
          <span className="flex-1 whitespace-pre-line">{l.text}</span>
          {l.time && (
            <span className="ml-auto text-sm text-gray-500">
              {l.time}
            </span>
          )}
          <button
            className="text-gray-400 hover:text-gray-600 ml-2"
            onClick={() => deleteLine(l.id)}
          >
            x
          </button>
        </div>
      ))}

      {complete.length > 0 && (
        <div className="mt-4">
          {complete.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-2 mb-1 text-gray-400"
            >
              <input
                type="checkbox"
                checked={l.done}
                onChange={() => toggleTask(l.id)}
              />
              <span className="flex-1 line-through whitespace-pre-line">
                {l.text}
              </span>
              {l.time && (
                <span className="ml-auto text-sm">{l.time}</span>
              )}
              <button
                className="text-gray-400 hover:text-gray-600 ml-2"
                onClick={() => deleteLine(l.id)}
              >
                x
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

export default DailyNote;

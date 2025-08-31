'use client';
import { useState, useEffect, useRef } from 'react';
import AddTask from './AddTask';

interface Task {
  id: number;
  text: string;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');
  const refText = useRef<HTMLTextAreaElement>(null);

  // LS에서 가져오기
  useEffect(() => {
    const saved = localStorage.getItem('daily_notes');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // addTask
  const addTask = (raw: string) => {
    if (raw.trim() === '') return;

    const done = false;
    let rawText = raw.trim();
    let time: string | undefined = undefined;

    const matchTime = raw.match(/@(\d{3,4})$/);
    if (matchTime) {
      const rawTime = matchTime[1];
      if (rawTime.length === 3) {
        time = `0${rawTime[0]}:${rawTime.slice(1)}`;
      } else {
        time = `${rawTime.slice(0, 2)}:${rawTime.slice(2)}`;
      }
      rawText = raw.replace(/@\d{3,4}$/, '').trim();
    }

    const newTask: Task = {
      id: Date.now(),
      text: rawText,
      time,
      done,
      date: todayKey,
    };
    localStorage.setItem(
      'daily_notes',
      JSON.stringify([...tasks, newTask])
    );
    setTasks([...tasks, newTask]);
  };

  // updateTask
  const updateTask = (id: number, newText: string) => {
    const matchTime = text.match(/@(\d{3,4})$/);
    let newTime: string | undefined = undefined;
    if (matchTime) {
      const rawTime = matchTime[1];
      if (rawTime.length === 3) {
        newTime = `0${rawTime[0]}:${rawTime.slice(1)}`;
      } else {
        newTime = `${rawTime.slice(0, 2)}:${rawTime.slice(2)}`;
      }
      newText = text.replace(/@\d{3,4}$/, '').trim();
    }

    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id
          ? { ...task, text: newText, time: newTime }
          : task
      );

      localStorage.setItem('daily_notes', JSON.stringify(updated));
      return updated;
    });
  };

  // 입력창 높이 자동 조절 (이미 저장된 task 편집 시 적용)
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [[tasks], [text]]);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const todayTasks = tasks.filter((task) => task.date === todayKey);
  const sortByTime = (arr: Task[]) =>
    [...arr].sort((a, b) => {
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      return 0;
    });

  const incomplete = sortByTime(
    todayTasks.filter((task) => !task.done)
  );
  const complete = sortByTime(todayTasks.filter((task) => task.done));

  return (
    <div className="p-2 bg-sky-50 rounded-md border border-sky-200 select-none">
      <h2 className="font-bold mb-2">
        📆{' '}
        {selectedDate.toLocaleDateString('ko-KR', {
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })}
      </h2>

      {incomplete.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 mb-1 border-b border-gray-300 
          py-1 select-none"
        >
          <input
            type="checkbox"
            className="w-4 h-4 accent-sky-400 cursor-pointer"
            checked={t.done}
            onChange={() => toggleTask(t.id)}
          />
          <textarea
            key={t.id}
            ref={ref}
            className="flex-1 resize-none border-0 focus:outline-none 
            overflow-hidden cursor-text"
            style={{ minHeight: '1.5rem' }}
            value={t.text}
            onChange={(e) => updateTask(t.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                updateTask(t.id, t.text);
                e.currentTarget.blur();
              }
              // 내용이 없을 때 Backspace → 삭제
              if (e.key === 'Backspace' && t.text === '') {
                e.preventDefault();
                setTasks((prev) => {
                  const updated = prev.filter(
                    (task) => task.id !== t.id
                  );
                  localStorage.setItem(
                    'daily_notes',
                    JSON.stringify(updated)
                  );
                  return updated;
                });
              }
            }}
          />
          {t.time && (
            <span className="ml-auto text-sm text-gray-500">
              {t.time}
            </span>
          )}
        </div>
      ))}

      <AddTask onAddTask={addTask} />

      {complete.length > 0 && (
        <>
          <hr className="border-dashed border-gray-500" />
          <div className="mt-4 select-none">
            {complete.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2 mb-1 text-gray-400 border-b border-gray-300 py-1"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-sky-300 cursor-pointer"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                />
                <span
                  className="flex-1 line-through overflow-hidden 
              whitespace-pre-line cursor-text"
                >
                  {t.text}
                </span>

                {t.time && (
                  <span className="ml-auto text-sm">{t.time}</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DailyNote;

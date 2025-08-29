'use client';
import { useState, useRef } from 'react';

interface Task {
  id: number;
  text: string;
  time?: string;
  done?: boolean;
  date: string;
}

const AddTask = ({ todayKey }: { todayKey: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');
  const refText = useRef<HTMLTextAreaElement>(null);

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
      rawText = text.replace(/@\d{3,4}$/, '').trim();
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
    setText('');
  };

  return (
    <textarea
      placeholder="task 추가"
      className="border-0 border-b border-gray-300 focus:outline-none focus:border-sky-400 
        px-2 py-1 w-full mt-2 resize-none overflow-hidden cursor-text"
      ref={refText}
      value={text}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (refText.current) {
          refText.current.style.height = 'auto';
          refText.current.style.height = `${refText.current.scrollHeight}px`;
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          addTask(text);
          setText('');
        }
      }}
    />
  );
};

export default AddTask;

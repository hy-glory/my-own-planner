'use client';
import { useState, useEffect } from 'react';

export interface Note {
  id: number;
  title: string;
  text: string;
  date: string;
}

const OneNote = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  // localStorage에서 노트 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // 노트를 localStorage에 저장하기
  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  return (
    <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
      <h2 className="font-bold mb-2"></h2>
    </div>
  );
};

export default OneNote;

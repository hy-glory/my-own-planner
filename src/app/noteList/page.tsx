'use client';
import { useState, useEffect, use } from 'react';
import { Note } from '../note/page';

const NoteList = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  // localStorage에서 노트 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // addNote
  const addNote = () => {
    {
      /** 작성중 */
    }
  };

  // deleteNote
  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  // openNote
  const openNote = (id: number) => {};

  return (
    <>
      <h2 className="font-bold mb-2">Note List</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h3 className="font-semibold">{note.title}</h3>
            <p>{note.text}</p>
            <p className="text-sm text-gray-500">{note.date}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default NoteList;

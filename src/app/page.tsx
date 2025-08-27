"use client";
import { useState } from "react";
import Header from "./Header";
import DailyNote from "./DailyNote";
import { NoteType, FixedNote } from "./FixedNote";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [memos, setMemos] = useState<FixedNote[]>([]);

  const addNote = () => {
    const newNote: FixedNote = {
      id: Date.now(),
      text: "",
    };
    setMemos((prev) => [...prev, newNote]);
  };

  const updateNote = (id: number, text: string, title?: string) => {
    setMemos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, text, title } : m))
    );
  };

  const deleteNote = (id: number) => {
    setMemos((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <div>
      <Header
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onAddNote={addNote}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailyNote selectedDate={selectedDate} />
        <div className="p-4 flex flex-wrap gap-4">
          {memos.map((note) => (
            <FixedNote
              key={note.id}
              note={note}
              onChange={updateNote}
              onDelete={deleteNote}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

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
    <div className="min-h-screen bg-sky-50">
      <Header
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onAddNote={addNote}
      />
      <DailyNote selectedDate={selectedDate} />
    </div>
  );
};

export default Home;

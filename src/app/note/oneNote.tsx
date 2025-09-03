"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export interface Note {
  id: number;
  title: string;
  text: string;
  latestDate: string;
  isOpen: boolean;
}

export const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

const OneNote = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [note, setNote] = useState<Note | null>(null);

  // localStorage에서 노트 불러오기
  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem("notes");
    if (saved) {
      const notes: Note[] = JSON.parse(saved);
      const currentNote = notes.find((note) => note.id === Number(id));
      if (currentNote) setNote(currentNote);
    }
  }, [id]);

  // updateNote
  const updateNote = (field: "title" | "text", value: string) => {
    if (!note) return;
    const updatedNote = {
      ...note,
      [field]: value,
      latestDate: new Date().toISOString(),
    };
    setNote(updatedNote);

    const saved = localStorage.getItem("notes");
    if (saved) {
      const notes: Note[] = JSON.parse(saved);
      const updatedNotes = notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      );
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    }
  };

  if (!note) return <div>노트를 불러올 수 없습니다.</div>;

  return (
    <div className="p-2 min-h-screen bg-yellow-100 flex flex-col">
      <input
        type="text"
        value={note.title}
        placeholder="제목"
        onChange={(e) => updateNote("title", e.target.value)}
        className="w-full p-2 font-bold focus:outline-none"
      />
      <textarea
        className="flex-grow w-full h-48 p-2 focus:outline-none resize-none"
        value={note.text}
        placeholder="내용을 입력하세요"
        onChange={(e) => updateNote("text", e.target.value)}
      />
      <p className="text-sm text-gray-500 mt-2">
        {formatDate(note.latestDate)}
      </p>
    </div>
  );
};

export default OneNote;

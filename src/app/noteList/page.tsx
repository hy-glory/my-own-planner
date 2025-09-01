"use client";
import { useState, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { LuCirclePlus } from "react-icons/lu";
import { FiMoreHorizontal } from "react-icons/fi";
import { Note, formatDate } from "../note/page";

const NoteList = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  // localStorage에서 노트 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // addNote
  const addNote = () => {
    const newId = Date.now();
    const newNote = {
      id: newId,
      title: "",
      text: "",
      latestDate: new Date().toISOString(),
      isOpen: true,
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    const noteUrl = `/note?id=${newId}`;
    const features = "width=400,height=600";
    window.open(noteUrl, "_blank", features);
  };

  // deleteNote
  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  // openNote
  const openNote = (id: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, isOpen: true } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    const noteUrl = `/note?id=${id}`;
    const features = "width=400,height=600";
    window.open(noteUrl, "_blank", features);
  };

  // closeNote
  const closeNote = (id: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, isOpen: false } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  // menudrop
  const menuDrop = (id: number) => {};

  return (
    <>
      <div className="flex justify-between items-center px-2 py-1 select-none border-b border-sky-600">
        <h2 className="text-lg font-bold">노트 목록</h2>
        <IoIosClose
          className="h-10 w-10 text-sky-600 hover:text-sky-800"
          onClick={() => {}}
        />
      </div>
      <div className="p-2 min-h-screen select-none">
        <p
          className="bg-sky-100 p-2 rounded-md w-full h-18 shadow-md mb-2
        hover:shadow-lg hover:bg-sky-200 transition flex items-center justify-center"
        >
          <LuCirclePlus className="text-sky-700 h-8 w-8" onClick={addNote} />
        </p>
        <ul className="flex flex-col gap-2 justify-center">
          {notes.map((note) => (
            <li
              key={note.id}
              className="bg-sky-100 p-2 rounded-md w-full h-28 shadow-md mb-2
            hover:shadow-lg hover:bg-sky-200 transition flex flex-col"
              onClick={() => openNote(note.id)}
            >
              <FiMoreHorizontal className="ml-auto" />
              <h3 className="font-semibold mb-1 line-clamp-1">
                {note.title || "제목 없음"}
              </h3>
              <p className="text-gray-700 line-clamp-2">{note.text}</p>
              <p className="text-sm text-gray-500 mt-auto">
                {formatDate(note.latestDate)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NoteList;

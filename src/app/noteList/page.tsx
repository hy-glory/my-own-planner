"use client";
import { useState, useEffect, useRef } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { Note, formatDate } from "../note/oneNote";

const NoteList = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  // localStorage에서 노트 불러오기
  useEffect(() => {
    const loadList = () => {
      const saved = localStorage.getItem("notes");
      if (saved) {
        const parsed: Note[] = JSON.parse(saved);
        parsed.sort(
          (a, b) =>
            new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
        );
        setNotes(parsed);
      }
    };
    loadList();
    window.addEventListener("storage", loadList);
    return () => window.removeEventListener("storage", loadList);
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

    updatedNotes.sort((a, b) => {
      return (
        new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
      );
    });
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
  // const closeNote = (id: number) => {
  //   const updatedNotes = notes.map((note) =>
  //     note.id === id ? { ...note, isOpen: false } : note
  //   );
  //   setNotes(updatedNotes);
  //   localStorage.setItem("notes", JSON.stringify(updatedNotes));
  //   // window.close(); 함수 아직 구현 안됨...
  // };

  return (
    <>
      <div className="flex justify-between items-center px-2 py-1 select-none border-b border-sky-600">
        <h2 className="text-lg font-bold">노트 목록</h2>
      </div>
      <div className="p-2 min-h-screen select-none">
        <p
          className="bg-sky-100 p-2 rounded-md w-full h-18 shadow-md mb-4
        hover:shadow-lg hover:bg-sky-200 transition flex items-center justify-center"
          onClick={addNote}
        >
          <LuCirclePlus className="text-sky-700 h-8 w-8" />
        </p>
        <ul className="flex flex-col gap-2 justify-center">
          {notes.map((note) => (
            <li
              key={note.id}
              className="bg-sky-100 p-2 rounded-md w-full h-33 shadow-md mb-2
            hover:shadow-lg hover:bg-sky-200 transition flex flex-col"
              onClick={() => openNote(note.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold line-clamp-1">
                  {note.title || "제목 없음"}
                </h3>
                <FaRegTrashAlt
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("삭제하시겠습니까?")) deleteNote(note.id);
                  }}
                />
              </div>
              <div>
                <div className="flex-grow">
                  <p className="text-gray-700 line-clamp-2 h-11 mb-3">
                    {note.text}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {formatDate(note.latestDate)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NoteList;

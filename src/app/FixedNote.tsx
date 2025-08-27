"use client";
import { useState, useEffect } from "react";

export interface NoteType {
  id: number;
  text: string;
  type: "task" | "memo";
  title?: string;
  time?: string;
  done?: boolean;
}

export interface FixedNote {
  note: Note;
  onChange: (id: number, text: string, title?: string) => void;
  onDelete: (id: number) => void;
}

const FixedNote = ({ note, onChange, onDelete }: FixedNote) => {
  
  
  return (
    
  );
};

export default FixedNote;

'use client';
import React, { useState, useRef } from 'react';

const AddTask = ({
  onAddTask,
}: {
  onAddTask: (task: string) => void;
}) => {
  const [text, setText] = useState('');
  const refText = useRef<HTMLTextAreaElement>(null);
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
      onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onAddTask(text);
          setText('');
          if (refText.current) {
            refText.current.style.height = 'auto';
          }
        }
      }}
    />
  );
};

export default AddTask;

'use client';
import { useState, useRef, useEffect } from 'react';
import { Task } from './DailyNote';

interface TaskItemProps {
  task: Task;
  updateTask: (id: number, newText: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TaskItem = ({
  task,
  updateTask,
  toggleTask,
  deleteTask,
}: TaskItemProps) => {
  const refText = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(task.text);

  useEffect(() => {
    if (refText.current) {
      refText.current.style.height = 'auto';
      refText.current.style.height = `${refText.current.scrollHeight}px`;
    }
  }, [task.text]);

  return (
    <>
      <div
        key={task.id}
        className="flex items-center gap-2 mb-1 border-b border-gray-300 
             py-1 select-none"
      >
        <input
          type="checkbox"
          className="w-4 h-4 accent-sky-400 cursor-pointer"
          checked={task.done}
          onChange={() => toggleTask(task.id)}
        />
        <textarea
          className="flex-1 resize-none border-0 focus:outline-none 
               overflow-hidden cursor-text"
          ref={refText}
          value={task.text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            updateTask(task.id, e.target.value);
            setText(e.target.value);
          }}
          onKeyDown={(
            e: React.KeyboardEvent<HTMLTextAreaElement>
          ) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              updateTask(task.id, text);
              e.currentTarget.blur();
            }
            // 내용이 없을 때 Backspace → 삭제
            if (e.key === 'Backspace' && task.text === '') {
              e.preventDefault();
              deleteTask(task.id);
            }
          }}
        />
        {task.time && (
          <span className="ml-auto text-sm text-gray-500">
            {task.time}
          </span>
        )}
      </div>
    </>
  );
};

export default TaskItem;

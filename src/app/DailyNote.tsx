"use client";
import React, { useState, useEffect, useRef } from "react";
import AddTask from "./AddTask";
import TaskItem from "./TaskItem";

export interface Task {
  id: number;
  text: string;
  time?: string;
  done?: boolean;
  date: string;
}

const DailyNote = ({ selectedDate }: { selectedDate: Date }) => {
  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const todayKey = formatDate(selectedDate);
  const [tasks, setTasks] = useState<Task[]>([]);

  // localStorage에서 Get
  useEffect(() => {
    const saved = localStorage.getItem("daily_notes");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // addTask
  const addTask = (raw: string) => {
    if (raw.trim() === "") return;

    const done = false;
    let rawText = raw.trim();
    let time: string | undefined = undefined;

    const matchTime = raw.match(/@(\d{3,4})$/);
    if (matchTime) {
      const rawTime = matchTime[1];
      if (rawTime.length === 3) {
        time = `0${rawTime[0]}:${rawTime.slice(1)}`;
      } else {
        time = `${rawTime.slice(0, 2)}:${rawTime.slice(2)}`;
      }
      rawText = raw.replace(/@\d{3,4}$/, "").trim();
    }

    const newTask: Task = {
      id: Date.now(),
      text: rawText,
      time,
      done,
      date: todayKey,
    };
    localStorage.setItem("daily_notes", JSON.stringify([...tasks, newTask]));
    setTasks([...tasks, newTask]);
  };

  // updateTask
  const updateTask = (id: number, newrawText: string) => {
    const newText = newrawText;

    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      );

      localStorage.setItem("daily_notes", JSON.stringify(updated));
      return updated;
    });
  };

  // deleteTask
  const deleteTask = (id: number) => {
    setTasks((prev) => {
      const updated = prev.filter((task) => task.id !== id);
      localStorage.setItem("daily_notes", JSON.stringify(updated));
      return updated;
    });
  };

  // toggleTask
  const toggleTask = (id: number) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      );
      localStorage.setItem("daily_notes", JSON.stringify(updated));
      return updated;
    });
  };

  const todayTasks = tasks.filter((task) => task.date === todayKey);
  const sortByTime = (arr: Task[]) =>
    [...arr].sort((a, b) => {
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      return 0;
    });
  const incomplete = sortByTime(todayTasks.filter((task) => !task.done));
  const complete = sortByTime(todayTasks.filter((task) => task.done));

  return (
    <div className="p-2 bg-sky-50 select-none">
      <h2 className="font-bold mb-2">
        📆{" "}
        {selectedDate.toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
          weekday: "long",
        })}
      </h2>

      {incomplete.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          updateTask={updateTask}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      ))}

      <AddTask onAddTask={addTask} />

      {complete.length > 0 && (
        <>
          <hr className="border-dashed border-gray-500" />
          <div className="mt-4 select-none">
            {complete.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2 mb-1 text-gray-400 border-b border-gray-300 py-1"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-sky-300 cursor-pointer"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                />
                <span
                  className="flex-1 line-through overflow-hidden 
              whitespace-pre-line cursor-text"
                >
                  {t.text}
                </span>

                {t.time && <span className="ml-auto text-sm">{t.time}</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DailyNote;

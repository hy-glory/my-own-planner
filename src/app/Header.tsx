"use client";

import AddNote from "./AddNote";

interface HeaderProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onAddNote: () => void;
}

const Header = ({ selectedDate, onSelectDate, onAddNote }: HeaderProps) => {
  const today = new Date();
  const localToday = new Date(today.getTime() + 9 * 60 * 60 * 1000);
  const year = localToday.getFullYear();
  const month = String(localToday.getMonth() + 1).padStart(2, "0");
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="flex flex-col border-b p-2">
      <h1 className="font-bold text-lg select-none">
        {year}.{month}
      </h1>
      <div className="flex gap-4 mt-2 select-none">
        {weekDates.map((date, i) => {
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={i}
              onClick={() => onSelectDate(date)}
              className="flex flex-col items-center focus:outline-none cursor-pointer"
            >
              <span className={isSelected ? "font-bold text-sky-600" : ""}>
                {days[i]}
              </span>
              <div
                className={`w-2 h-2 rounded-full mt-1 ${
                  isSelected ? "bg-sky-600" : "bg-sky-300"
                }`}
              />
            </button>
          );
        })}
        <AddNote onAddNote={onAddNote} />
      </div>
    </div>
  );
};

export default Header;

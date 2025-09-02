"use client";
import { IoIosList } from "react-icons/io";

interface HeaderProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const Header = ({ selectedDate, onSelectDate }: HeaderProps) => {
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
    <div className="flex justify-between items-center p-3 bg-white border-b">
      <div className="flex flex-col p-2 select-none">
        <h1 className="font-bold text-lg">
          {year}.{month}
        </h1>
        <div className="flex gap-5 mt-1">
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
        </div>
      </div>
      <IoIosList
        className="mr-4 text-sky-600 h-8 w-8 cursor-pointer hover:text-blue-600"
        onClick={() =>
          window.open("/noteList", "_blank", "width=400,height=600")
        }
      />
    </div>
  );
};

export default Header;

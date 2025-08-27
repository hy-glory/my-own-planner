"use client";
const AddNote = ({ onAddNote }: { onAddNote: () => void }) => {
  return (
    <button
      onClick={onAddNote}
      className="w-8 h-8 rounded-full 
              bg-sky-400 text-white text-xl shadow-lg cursor-pointer"
    >
      +
    </button>
  );
};

export default AddNote;

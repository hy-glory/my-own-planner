import { Suspense } from "react";
import OneNote from "./page";

const NoteForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OneNote />
    </Suspense>
  );
};

export default NoteForm;

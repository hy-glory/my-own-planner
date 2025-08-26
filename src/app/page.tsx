'use client';
import { useState } from 'react';
import Header from './Header';
import DailyNote from './DailyNote';
import FixedNote from './FixedNote';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div>
      <Header
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailyNote selectedDate={selectedDate} />
        <FixedNote />
      </div>
    </div>
  );
};

export default Home;

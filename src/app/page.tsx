'use client';
import { useState } from 'react';
import Header from './Header';
import DailyNote from './DailyNote';
import FixedNote from './FixedNote';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-sky-50">
      <Header
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <DailyNote selectedDate={selectedDate} />
    </div>
  );
};

export default Home;

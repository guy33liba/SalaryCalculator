import React, { useState, useEffect } from 'react';

function Clock() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    return date.toLocaleTimeString(undefined, options);
  };

  return (
    <div className="clock">
      <div className="date">{formatDate(currentDateTime)}</div>
      <div className="time">{formatTime(currentDateTime)}</div>
    </div>
  );
}

export default Clock;

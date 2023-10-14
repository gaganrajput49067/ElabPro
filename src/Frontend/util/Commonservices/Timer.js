import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [seconds, setSeconds] = useState(300);
  const [timerFinished, setTimerFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(prevSeconds => prevSeconds - 1);
      } else {
        clearInterval(timer);
        setTimerFinished(true); // Timer finished, set the state
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{color:'red'}}>
      {formatTime(seconds)}
    </div>
  );
};
export default Timer

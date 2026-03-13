import React, { useState, useEffect } from 'react';

const calculateTimeLeft = (targetDate) => {
  const difference = +new Date(targetDate) - +new Date();
  if (difference <= 0) return "LATE";

  const parts = {
    d: Math.floor(difference / (1000 * 60 * 60 * 24)),
    h: Math.floor((difference / (1000 * 60 * 60)) % 24),
    m: Math.floor((difference / 1000 / 60) % 60),
    s: Math.floor((difference / 1000) % 60),
  };

  return `${parts.d}d ${parts.h}h ${parts.m}m ${parts.s}s`;
};

const LiveTimer = ({ dueDate, completed }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(dueDate));

  useEffect(() => {
    if (completed) return; // Stop ticking if done
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(dueDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [dueDate, completed]);

  return <span>{completed ? "Completed" : timeLeft}</span>;
};

export default LiveTimer;
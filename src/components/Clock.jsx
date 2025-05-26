import React, { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-4xl font-mono text-white">
      {time.toLocaleTimeString()}
      
    </div>
  );
};

export default Clock;

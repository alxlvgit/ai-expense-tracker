"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const CurrentDateTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-xs text-gray-500 mt-1">
        {format(currentTime, "MM/dd/yyyy, hh:mm a")}
      </h2>
    </div>
  );
};

export default CurrentDateTime;

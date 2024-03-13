"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const CurrentDateTime = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-xs text-gray-500 mt-1">
        {currentTime ? (
          format(currentTime, "MM/dd/yyyy, hh:mm a")
        ) : (
          <span className="animate-pulse bg-gray-200 h-2 w-24 inline-block rounded"></span>
        )}
      </h2>
    </div>
  );
};

export default CurrentDateTime;

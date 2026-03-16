import React from 'react';
import { cn } from '../../utils/cn';

const ProgressBar = ({ 
  progress = 0, // 0 to 100
  className,
  colorClass = 'bg-primary' 
}) => {
  return (
    <div className={cn("h-3 w-full overflow-hidden rounded-full bg-slate-800", className)}>
      <div
        className={cn("h-full transition-all duration-500 ease-in-out", colorClass)}
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
    </div>
  );
};

export default ProgressBar;

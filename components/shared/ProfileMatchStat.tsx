import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const ProfileMatchStat = ({ data }: { data?: number }) => {
  if (!data) return null;

  const circumference = 20 * 2 * Math.PI;
  const offset = circumference - (data / 100) * circumference;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipContent>Profile Match: {data}%</TooltipContent>
        <TooltipTrigger>
          <div className="relative flex items-center justify-center w-20 h-20">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                className="text-gray-300"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="20"
                cx="50%"
                cy="50%"
              />
              <circle
                className="text-blue-500"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="20"
                cx="50%"
                cy="50%"
              />
            </svg>
          </div>
          <span className="sm:hidden block text-xs text-zinc-400">
            Profile Match {data}%
          </span>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProfileMatchStat;

import React from "react";

interface ScoreCircleProps {
  score: number;
  bigger?: boolean;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, bigger = false }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = () => {
    if (score <= 40) return "red";
    if (score <= 70) return "orange";
    return "green";
  };

  return (
    <svg
      height={bigger ? "120" : "80"}
      width={bigger ? "120" : "80"}
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="lightgray"
        strokeWidth="5"
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke={getColor()}
        strokeWidth="10"
        fill="#191919"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        fontSize="24"
        fill="white"
        fontWeight={600}
      >
        {score}
      </text>
    </svg>
  );
};

export default ScoreCircle;

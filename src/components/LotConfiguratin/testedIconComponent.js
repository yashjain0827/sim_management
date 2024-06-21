import React from "react";

const TestedIconComponent = ({ active, completed }) => {
  return (
    <svg
      width="75"
      height="75"
      viewBox="0 0 75 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="37.296"
        cy="37.296"
        r="36.046"
        fill="white"
        stroke={completed==null ?"#2196f3":completed==true ? "#4BB01B" : "#ff0000"}
        stroke-width="1.5"
      />
      <circle
        cx="37.6839"
        cy="37.6839"
        r="24.8235"
        fill={completed==null ?"#2196f3":completed==true ? "#4BB01B" : "#ff0000"}
      />
      <path
        d="M33.4802 48L24 38.5197L26.3701 36.1497L33.4802 43.2599L48.7401 28L51.1102 30.3701L33.4802 48Z"
        fill="white"
      />
    </svg>
  );
};

export default TestedIconComponent;

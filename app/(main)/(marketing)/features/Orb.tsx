"use client";

import React, { useState } from "react";

interface OrbProps {
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  hue?: number;
  forceHoverState?: boolean;
  backgroundColor?: string;
}

export default function Orb({
  hoverIntensity = 2,
  rotateOnHover = true,
  hue = 350,
  forceHoverState = false,
  backgroundColor = "#000000",
}: OrbProps) {
  const [isHovered, setIsHovered] = useState(forceHoverState);

  return (
    <div
      className="absolute inset-0 overflow-hidden flex items-center justify-center transition-all duration-700"
      style={{ backgroundColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !forceHoverState && setIsHovered(false)}
    >
      <div
        className="absolute w-[600px] h-[600px] rounded-full mix-blend-screen opacity-20 blur-[100px]"
        style={{
          background: `radial-gradient(circle at 50% 50%, hsl(${hue}, 100%, 65%), transparent 60%)`,
          transform: `scale(${isHovered ? hoverIntensity : 1}) ${
            rotateOnHover && isHovered ? "rotate(180deg)" : "rotate(0deg)"
          }`,
          transition: "transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

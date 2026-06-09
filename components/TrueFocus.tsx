"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface TrueFocusProps {
  sentence: string;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
  wordClassName?: string;
}

export default function TrueFocus({
  sentence = "",
  blurAmount = 1.5,
  borderColor = "#FF5C73", // Primary brand color
  glowColor = "rgba(255, 92, 115, 0.25)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1.5,
  className = "justify-center",
  wordClassName = "text-2xl sm:text-4xl lg:text-5xl",
}: TrueFocusProps) {
  const words = sentence.split(" ");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusRect, setFocusRect] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [words.length, animationDuration, pauseBetweenAnimations]);

  useEffect(() => {
    if (!containerRef.current) return;

    const activeElement = containerRef.current.querySelector(
      `[data-word-index="${activeIndex}"]`
    ) as HTMLElement;

    if (activeElement) {
      setFocusRect({
        left: activeElement.offsetLeft - 8,
        top: activeElement.offsetTop - 4,
        width: activeElement.offsetWidth + 16,
        height: activeElement.offsetHeight + 8,
      });
    }
  }, [activeIndex, sentence]);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-wrap gap-x-4 gap-y-3 py-4 ${className}`}
    >
      {/* Animated Focus Box */}
      <motion.div
        className="absolute rounded-xl pointer-events-none border-2 z-10 hidden sm:block"
        style={{
          borderColor,
          boxShadow: `0 0 20px ${glowColor}`,
        }}
        animate={{
          left: focusRect.left,
          top: focusRect.top,
          width: focusRect.width,
          height: focusRect.height,
        }}
        transition={{
          duration: animationDuration,
          ease: "easeInOut",
        }}
      >
        {/* Decorative corner brackets */}
        <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 rounded-tl" style={{ borderColor }} />
        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 rounded-tr" style={{ borderColor }} />
        <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 rounded-bl" style={{ borderColor }} />
        <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 rounded-br" style={{ borderColor }} />
      </motion.div>

      {/* Words */}
      {words.map((word, index) => {
        const isActive = index === activeIndex;
        return (
          <motion.span
            key={index}
            data-word-index={index}
            className={`relative cursor-pointer font-black tracking-tight transition-all ${wordClassName}`}
            animate={{
              filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
              opacity: isActive ? 1 : 0.7,
              scale: isActive ? 1.05 : 0.98,
              color: isActive ? "#FFFFFF" : "#CBD5E1",
            }}
            transition={{
              duration: animationDuration,
            }}
            onClick={() => setActiveIndex(index)}
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}

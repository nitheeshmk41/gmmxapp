"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: any;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  className = "",
  as = "div",
}: FadeInProps) {
  const Component = motion(as);

  return (
    <Component
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function FadeInStagger({
  children,
  staggerDelay = 0.05,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  as?: any;
}) {
  const Component = motion(as);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </Component>
  );
}

export function FadeInItem({
  children,
  className = "",
  as = "div",
  ...props
}: {
  children: ReactNode;
  className?: string;
  as?: any;
} & React.HTMLAttributes<HTMLElement>) {
  const Component = motion(as);

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <Component variants={itemVariants} className={className} {...props}>
      {children}
    </Component>
  );
}

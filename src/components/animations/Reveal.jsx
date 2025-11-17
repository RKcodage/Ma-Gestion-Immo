import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// Simple, reusable reveal-on-scroll wrapper using framer-motion
// Props:
// - from: 'up' | 'down' | 'left' | 'right' | 'none'
// - delay: seconds (e.g., 0.1)
// - duration: seconds (e.g., 0.6)
// - once: play only once when in view
// - amount: viewport threshold (0..1) before triggering
export default function Reveal({
  children,
  from = "up",
  delay = 0.1,
  duration = 0.6,
  once = true,
  amount = 0.2,
  className = "",
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const offset = 24; // px
  const hidden = {
    opacity: 0,
    x: from === "left" ? -offset : from === "right" ? offset : 0,
    y: from === "up" ? offset : from === "down" ? -offset : 0,
  };
  const shown = { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      className={className}
      initial={"hidden"}
      whileInView={"shown"}
      viewport={{ once, amount }}
      variants={{ hidden, shown }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}


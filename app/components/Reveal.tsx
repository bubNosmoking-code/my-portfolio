"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

type RevealProps = {
  children: ReactNode;
  /** stagger index — each step adds delay */
  index?: number;
  /** vertical offset in px before reveal (newspaper restraint: keep small) */
  y?: number;
  /** seconds between staggered siblings */
  step?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
  style?: CSSProperties;
};

const baseVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  index = 0,
  y = 10,
  step = 0.08,
  duration = 0.5,
  className,
  as = "div",
  style,
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay: index * step, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/** Wraps a group of children, staggering each direct child's entrance. */
export function RevealGroup({
  children,
  className,
  step = 0.08,
  y = 10,
  duration = 0.5,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  y?: number;
  duration?: number;
}) {
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: step } },
  };
  const childVariants: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration, ease: [0.22, 0.61, 0.36, 1] } },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={childVariants} style={{ display: "contents" }}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

export { baseVariants };

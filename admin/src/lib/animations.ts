import type { Variants } from "motion/react";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export const slideInLeft: Variants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  exit: { x: "-100%", transition: { duration: 0.2, ease: "easeIn" } },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -10, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    height: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
};

export const tableRowEnter: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

export const badgeBounce: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.3, 1],
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

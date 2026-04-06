import { type Variants } from "motion/react";

// ─── Fade in from below (scroll reveals) ─────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// ─── Fade in from left (LTR content) ─────────────────────
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Fade in from right (RTL content) ─────────────────────
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Scale up (cards, modals) ─────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// ─── Stagger children (grids, lists) ─────────────────────
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// ─── Stagger item (child of staggerContainer) ────────────
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// ─── Slide down (dropdowns, mini-cart) ────────────────────
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

// ─── Slide in from right (mobile menu, drawers) ──────────
export const slideInRight: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  exit: { x: "100%", transition: { duration: 0.2, ease: "easeIn" } },
};

// ─── Backdrop overlay fade ───────────────────────────────
export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// ─── Cart badge bounce ───────────────────────────────────
export const badgeBounce: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.3, 1],
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

// ─── Page transition ─────────────────────────────────────
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

// ─── Floating action button pulse ────────────────────────
export const floatingPulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
  },
};

// ─── Shimmer (skeleton loading) ──────────────────────────
export const shimmer: Variants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
  },
};

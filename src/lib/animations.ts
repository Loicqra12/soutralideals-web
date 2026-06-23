import type { Easing } from "framer-motion";

const easeOut: Easing = "easeOut";

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

export const cardHover = {
  rest: { y: 0, boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.08)" },
  hover: {
    y: -4,
    boxShadow:
      "0 20px 40px -8px rgb(0 0 0 / 0.14), 0 8px 16px -4px rgb(0 0 0 / 0.08)",
    transition: { duration: 0.25, ease: easeOut },
  },
};

export const imageZoom = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: { duration: 0.4, ease: easeOut } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: easeOut },
  },
};

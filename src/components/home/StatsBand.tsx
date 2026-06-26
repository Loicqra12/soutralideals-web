"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/lib/hooks/useInView";

const STATS = [
  { value: 1200, suffix: "+", label: "Prestataires" },
  { value: 350, suffix: "+", label: "Freelances" },
  { value: 5000, suffix: "+", label: "Produits" },
  { value: 98, suffix: "%", label: "Satisfaction client" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.5 });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const duration = 1400;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease-out: ralentir vers la fin
      current = target * (1 - Math.pow(1 - step / steps, 3));
      setCount(Math.round(current));
      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

export function StatsBand() {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="border-y border-neutral-100 bg-neutral-50 py-10"
      aria-label="Chiffres clés Soutrali Deals"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <p className="text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1.5 text-sm font-medium text-neutral-500">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";

interface StatItemProps {
  icon: string;
  value: number;
  suffix: string;
  label: string;
}

function StatItem({ icon, value, suffix, label }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return n.toLocaleString();
    return n.toString();
  };

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl md:text-4xl font-bold text-white number-glow">
        {formatNumber(count)}
        <span className="text-redpacket">{suffix}</span>
      </div>
      <div className="text-sm text-text-secondary mt-1">{label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="glass rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem icon="🧧" value={12847} suffix="+" label="已发送红包" />
            <StatItem icon="💰" value={3284700} suffix="+" label="已发放金额 (USD)" />
            <StatItem icon="⛓️" value={6} suffix="" label="支持的链" />
            <StatItem icon="🤝" value={47} suffix="+" label="合作项目方" />
          </div>
        </div>
      </div>
    </section>
  );
}

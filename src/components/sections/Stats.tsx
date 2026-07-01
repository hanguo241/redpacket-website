"use client";

import { useEffect, useState, useRef } from "react";

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
}

function StatItem({ value, suffix, label }: StatItemProps) {
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
      <div style={{ fontSize: "48px", fontWeight: 600, letterSpacing: "-2.4px", lineHeight: 1.0, color: "#171717" }}>
        {formatNumber(count)}
        <span style={{ color: "#171717" }}>{suffix}</span>
      </div>
      <div style={{ fontSize: "14px", color: "#4d4d4d", marginTop: "8px" }}>{label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <div style={{
          padding: "32px 40px",
          borderRadius: "12px",
          background: "#fff",
          boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, rgba(0,0,0,0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px",
        }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value={12847} suffix="+" label="已发送红包" />
            <StatItem value={3284700} suffix="+" label="已发放金额 (USD)" />
            <StatItem value={6} suffix="" label="支持的链" />
            <StatItem value={47} suffix="+" label="合作项目方" />
          </div>
        </div>
      </div>
    </section>
  );
}

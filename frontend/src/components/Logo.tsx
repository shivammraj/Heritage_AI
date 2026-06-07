import React from 'react';

// 8-petal lotus drawn as camera shutter aperture — turmeric on dark
export default function Logo({ size = 40, className = '' }: { size?: number; className?: string }) {
  const petals = Array.from({ length: 8 }, (_, i) => i);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.22;
  const offset = size * 0.16;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Heritage AI logo"
      role="img"
    >
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={size * 0.46} stroke="#E8A020" strokeWidth="2" opacity="0.85" />
      {/* 8 petals */}
      {petals.map((i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const px = cx + Math.cos(angle) * offset;
        const py = cy + Math.sin(angle) * offset;
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx={r * 0.55}
            ry={r}
            fill="#E8A020"
            opacity="0.85"
            transform={`rotate(${i * 45}, ${px}, ${py})`}
          />
        );
      })}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={size * 0.08} fill="#1A0A2E" />
      <circle cx={cx} cy={cy} r={size * 0.05} fill="#E8A020" />
    </svg>
  );
}

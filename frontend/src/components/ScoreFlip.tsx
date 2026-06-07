import React, { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  className?: string;
}

// Departure-board style digit flip — each digit flips independently
function Digit({ char, prev }: { char: string; prev: string }) {
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (char !== prev) {
      setFlipping(true);
      const t = setTimeout(() => setFlipping(false), 300);
      return () => clearTimeout(t);
    }
  }, [char, prev]);

  return (
    <span
      className={`inline-block font-mono text-turmeric transition-all duration-150 ${
        flipping ? 'opacity-0 scale-y-0' : 'opacity-100 scale-y-100'
      } origin-center`}
      style={{ display: 'inline-block', minWidth: '0.6em', textAlign: 'center' }}
    >
      {char}
    </span>
  );
}

export default function ScoreFlip({ value, className = '' }: Props) {
  const [displayed, setDisplayed] = useState(String(value).padStart(3, '0'));
  const [prev, setPrev] = useState(String(value).padStart(3, '0'));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const next = String(value).padStart(3, '0');
    setPrev(displayed);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDisplayed(next);
    }, 50);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [value]);

  const digits = displayed.split('');
  const prevDigits = prev.split('');

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`Score: ${value} points`}
    >
      {digits.map((d, i) => (
        <Digit key={i} char={d} prev={prevDigits[i] || d} />
      ))}
      <span className="font-mono text-turmeric/50 ml-2 text-sm">pts</span>
    </div>
  );
}

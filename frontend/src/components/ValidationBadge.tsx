import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  attempts?: number;
  size?: 'sm' | 'md';
}

export default function ValidationBadge({ attempts = 1, size = 'md' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 rounded-btn border ${
        size === 'sm'
          ? 'px-3 py-1.5 text-[11px]'
          : 'px-4 py-2 text-[12px]'
      } bg-[rgba(26,107,74,0.15)] border-[rgba(26,107,74,0.4)]`}
    >
      <CheckCircle size={size === 'sm' ? 12 : 14} className="text-forest shrink-0" />
      <span className="font-mono text-forest leading-none">
        State name verified absent ✓
      </span>
      {attempts > 1 && (
        <span className="font-mono text-forest/60 text-[10px] ml-1">
          ({attempts} attempt{attempts > 1 ? 's' : ''})
        </span>
      )}
    </motion.div>
  );
}

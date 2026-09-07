import { motion } from 'framer-motion';
import { BurgerPaths } from './BurgerGlyph';

// A friendly burger character that gently bobs and waves its hand.
export function Mascot({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 160 156"
      className={className}
      role="img"
      aria-label="Маскот-бургер машет рукой"
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* legs + feet */}
      <g stroke="#3A2A1E" strokeWidth="6" strokeLinecap="round">
        <line x1="64" y1="130" x2="60" y2="148" />
        <line x1="96" y1="130" x2="100" y2="148" />
      </g>
      <g fill="#3A2A1E">
        <ellipse cx="56" cy="149" rx="9" ry="5" />
        <ellipse cx="104" cy="149" rx="9" ry="5" />
      </g>

      {/* left arm (resting) */}
      <line x1="36" y1="98" x2="18" y2="106" stroke="#3A2A1E" strokeWidth="6" strokeLinecap="round" />
      <circle cx="16" cy="107" r="7" fill="#FFFFFF" stroke="#3A2A1E" strokeWidth="2" />

      {/* burger body */}
      <g transform="translate(20 32)">
        <BurgerPaths />
      </g>

      {/* googly eyes on the patty */}
      <g>
        <circle cx="68" cy="100" r="9" fill="#FFFFFF" stroke="#3A2A1E" strokeWidth="2" />
        <circle cx="92" cy="100" r="9" fill="#FFFFFF" stroke="#3A2A1E" strokeWidth="2" />
        <circle cx="70" cy="101" r="4" fill="#2B1B12" />
        <circle cx="94" cy="101" r="4" fill="#2B1B12" />
        <circle cx="71.5" cy="99.5" r="1.4" fill="#fff" />
        <circle cx="95.5" cy="99.5" r="1.4" fill="#fff" />
      </g>
      {/* smile */}
      <path d="M70 114 q10 9 20 0" fill="none" stroke="#3A2A1E" strokeWidth="3" strokeLinecap="round" />

      {/* right arm — waving (rotates around the shoulder) */}
      <g className="animate-wiggle" style={{ transformBox: 'fill-box', transformOrigin: '0% 100%' }}>
        <line x1="124" y1="94" x2="142" y2="74" stroke="#3A2A1E" strokeWidth="6" strokeLinecap="round" />
        <circle cx="144" cy="72" r="7" fill="#FFFFFF" stroke="#3A2A1E" strokeWidth="2" />
      </g>
    </motion.svg>
  );
}

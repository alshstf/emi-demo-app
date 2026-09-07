import { motion } from 'framer-motion';
import { BurgerGlyph } from './BurgerGlyph';

const items = [
  { left: '6%', top: '16%', size: 96, dur: 7, delay: 0, rotate: -12 },
  { left: '80%', top: '12%', size: 124, dur: 9, delay: 0.6, rotate: 10 },
  { left: '11%', top: '66%', size: 80, dur: 8, delay: 1.2, rotate: 8 },
  { left: '85%', top: '62%', size: 104, dur: 10, delay: 0.3, rotate: -8 },
  { left: '45%', top: '8%', size: 64, dur: 7.5, delay: 0.9, rotate: 14 },
];

export function FloatingBurgers() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((it, i) => (
        <motion.div
          key={i}
          className="absolute drop-shadow-xl"
          style={{ left: it.left, top: it.top, width: it.size }}
          initial={{ y: 0, rotate: it.rotate }}
          animate={{ y: [0, -22, 0], rotate: [it.rotate, it.rotate + 6, it.rotate] }}
          transition={{ duration: it.dur, delay: it.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BurgerGlyph className="w-full opacity-90" />
        </motion.div>
      ))}
    </div>
  );
}

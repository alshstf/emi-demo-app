import { motion, useReducedMotion } from 'framer-motion';
import { GoCloudLogo } from './Logo';
import { QrBlock } from './QrBlock';
import { LANES, type Lane } from '../brand';
import { config } from '../../../config';

export interface BadgeProps {
  lane: Lane;
  /** Participant name. Undefined → dashed placeholders (the badge is not assembled yet). */
  name?: string;
  /** Second line: organisation, e-mail or login. */
  org?: string;
  /** Small monospace line under the organisation (e.g. the login). */
  note?: string;
  /** Up to two lines bottom-left. Default: event date and venue. */
  footer?: string[];
  /** Seed of the decorative QR block (use the token `sub`). */
  qrSeed?: string;
  /** Play the "assembling" animation once (right after login). */
  assembling?: boolean;
  /** Draw the lanyard ribbons above the badge. */
  lanyard?: boolean;
  className?: string;
}

function Placeholder({ label, tall = false }: { label: string; tall?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-gc-grey text-[10px] font-extrabold uppercase tracking-[0.14em] text-gc-grey ${
        tall ? 'h-16' : 'h-9'
      }`}
    >
      {label}
    </div>
  );
}

const item = {
  hidden: { opacity: 0, y: 10 },
  shown: { opacity: 1, y: 0 },
};

const list = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};

/**
 * The conference badge, assembled from token claims. Width 300px; the lanyard
 * adds 64px above. Colours of strip and lanyard come from the lane (= role).
 */
export function Badge({ lane, name, org, note, footer, qrSeed, assembling = false, lanyard = true, className = '' }: BadgeProps) {
  const L = LANES[lane];
  const reduce = useReducedMotion();
  const animate = assembling && !reduce;
  const lines = footer ?? [config.event_date, config.event_place];

  return (
    <div className={`relative w-[300px] max-w-full ${lanyard ? 'pt-16' : ''} ${className}`}>
      {lanyard && (
        <>
          <span className={`gc-lanyard gc-lanyard--l ${L.lanyard}`} aria-hidden />
          <span className={`gc-lanyard gc-lanyard--r ${L.lanyard}`} aria-hidden />
        </>
      )}

      <motion.div
        className="relative border border-gc-ink bg-white shadow-[0_18px_40px_-24px_rgba(22,25,22,0.45)]"
        initial={animate ? { opacity: 0, y: 28, rotate: -2 } : false}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 170, damping: 18 }}
        role="img"
        aria-label={name ? `Бейдж: ${name}, ${L.label}` : `Бейдж не собран: ${L.label}`}
      >
        <div className={`relative flex h-16 items-center justify-center ${L.strip}`}>
          <span className="absolute left-1/2 top-2 h-2.5 w-7 -translate-x-1/2 rounded-full border border-black/30 bg-gc-paper" aria-hidden />
          <GoCloudLogo tone={L.logo} className="h-10 w-auto" />
        </div>

        <motion.div className="px-5 pt-4" variants={list} initial={animate ? 'hidden' : false} animate="shown">
          <motion.div variants={item} className={`gc-label ${L.accent}`}>
            {L.label}
          </motion.div>
          {name ? (
            <motion.div variants={item} className="mt-1.5 break-words text-[26px] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-gc-ink">
              {name}
            </motion.div>
          ) : (
            <motion.div variants={item} className="mt-2">
              <Placeholder label="Имя и фамилия" tall />
            </motion.div>
          )}
          {name ? (
            org && (
              <motion.div variants={item} className="mt-2 break-words text-sm text-gc-muted">
                {org}
              </motion.div>
            )
          ) : (
            <motion.div variants={item} className="mt-2">
              <Placeholder label="Компания" />
            </motion.div>
          )}
          {name && note && (
            <motion.div variants={item} className="mt-1 break-all font-gcmono text-[11px] text-gc-grey">
              {note}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="flex items-end justify-between gap-3 px-5 pb-5 pt-8"
          initial={animate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-xs leading-snug text-gc-muted">
            {lines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
          <QrBlock seed={qrSeed ?? 'gocloud-tech'} className="w-14 shrink-0" />
        </motion.div>
      </motion.div>
    </div>
  );
}

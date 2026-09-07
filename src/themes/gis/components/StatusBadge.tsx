export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const TONE: Record<Tone, string> = {
  neutral: 'bg-gis-surface2 text-gis-ink',
  info: 'bg-gis-blueLight text-gis-blueDark',
  success: 'bg-gis-greenLight text-gis-green',
  warning: 'bg-gis-amberLight text-gis-amber',
  danger: 'bg-gis-redLight text-gis-red',
};

export function StatusBadge({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={`gis-badge ${TONE[tone]}`}>{children}</span>;
}

export interface ModernIconProps {
  className?: string;
}

const STROKE_ATTRIBUTES = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
  xmlns: 'http://www.w3.org/2000/svg',
};

export function CodeIcon({ className }: ModernIconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} {...STROKE_ATTRIBUTES}>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
  );
}

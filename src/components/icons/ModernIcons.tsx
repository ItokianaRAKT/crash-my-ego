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

export function SparkleIcon({ className }: ModernIconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} {...STROKE_ATTRIBUTES}>
      <path d="M12 3.5c.6 3.7 1.9 5.5 5.6 6.1-3.7.6-5 2.4-5.6 6.1-.6-3.7-1.9-5.5-5.6-6.1 3.7-.6 5-2.4 5.6-6.1Z" />
      <path d="M19 15.5c.3 1.7.9 2.5 2.6 2.8-1.7.3-2.3 1.1-2.6 2.8-.3-1.7-.9-2.5-2.6-2.8 1.7-.3 2.3-1.1 2.6-2.8Z" />
      <path d="M5.5 3c.2 1.1.6 1.6 1.7 1.8-1.1.2-1.5.7-1.7 1.8-.2-1.1-.6-1.6-1.7-1.8 1.1-.2 1.5-.7 1.7-1.8Z" />
    </svg>
  );
}

export function InboxIcon({ className }: ModernIconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} {...STROKE_ATTRIBUTES}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

export function AlertTriangleIcon({ className }: ModernIconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} {...STROKE_ATTRIBUTES}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function CheckIcon({ className }: ModernIconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} {...STROKE_ATTRIBUTES}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function TerminalIcon({ className }: ModernIconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} {...STROKE_ATTRIBUTES}>
      <path d="m4 17 6-6-6-6" />
      <path d="M12 19h8" />
    </svg>
  );
}

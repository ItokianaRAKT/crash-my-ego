/**
 * Hand-drawn Windows 95 style icons.
 *
 * Everything here is plain inline SVG so the app keeps its retro look
 * without pulling an icon package into the dependency tree. Each icon is
 * drawn on a 16×16 grid (the CriticalStop icon uses 32×32 for extra detail)
 * with the flat, low-colour palette of the original system icons.
 */

/** Props shared by every retro icon: only a className for sizing. */
export interface RetroIconProps {
  className?: string;
}

const DEFAULT_SVG_ATTRIBUTES = {
  'aria-hidden': true,
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
} as const;

/** Classic grey CRT monitor with a teal screen. */
export function ComputerIcon({ className }: RetroIconProps): JSX.Element {
  return (
    <svg
      {...DEFAULT_SVG_ATTRIBUTES}
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      shapeRendering="crispEdges"
    >
      <rect x="0.5" y="2.5" width="15" height="9.5" fill="#c0c0c0" stroke="#000000" />
      <rect x="2" y="4" width="12" height="6.5" fill="#008080" />
      <rect x="6" y="12" width="4" height="1.5" fill="#808080" stroke="#000000" />
      <rect x="3.5" y="13.5" width="9" height="1.5" fill="#c0c0c0" stroke="#000000" />
    </svg>
  );
}

/** Loudspeaker with two sound waves, for the system tray. */
export function SpeakerIcon({ className }: RetroIconProps): JSX.Element {
  return (
    <svg {...DEFAULT_SVG_ATTRIBUTES} viewBox="0 0 16 16" className={className} fill="none">
      <path d="M1 6 H4 L8 2.5 V13.5 L4 10 H1 Z" fill="#000000" />
      <path d="M10 5.5 A4 4 0 0 1 10 10.5" stroke="#000000" strokeWidth="1.3" fill="none" />
      <path d="M12 3.5 A6.5 6.5 0 0 1 12 12.5" stroke="#000000" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

/** Red and white eraser, for the "Effacer" toolbar button. */
export function EraserIcon({ className }: RetroIconProps): JSX.Element {
  return (
    <svg
      {...DEFAULT_SVG_ATTRIBUTES}
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      shapeRendering="crispEdges"
    >
      <g transform="rotate(-28 8 8)">
        <rect x="1.5" y="6.5" width="13" height="6" fill="#ffffff" stroke="#000000" />
        <rect x="1.5" y="6.5" width="5" height="6" fill="#e04040" stroke="#000000" />
        <rect x="6.5" y="6.5" width="1" height="6" fill="#808080" />
      </g>
    </svg>
  );
}

/** Yellow warning triangle with an exclamation mark. */
export function WarningIcon({ className }: RetroIconProps): JSX.Element {
  return (
    <svg
      {...DEFAULT_SVG_ATTRIBUTES}
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      shapeRendering="crispEdges"
    >
      <path d="M8 1 L15.5 14.5 L0.5 14.5 Z" fill="#ffe000" stroke="#000000" />
      <rect x="7" y="6" width="2" height="5" fill="#000000" />
      <rect x="7" y="11.5" width="2" height="2" fill="#000000" />
    </svg>
  );
}

/**
 * Red "critical stop" disc with a white cross — the classic fatal error
 * symbol used by the crash popup. Drawn on a 32×32 grid so it stays crisp
 * when displayed at 48–56 px.
 */
export function CriticalStopIcon({ className }: RetroIconProps): JSX.Element {
  return (
    <svg {...DEFAULT_SVG_ATTRIBUTES} viewBox="0 0 32 32" className={className} fill="none">
      <circle cx="16" cy="16" r="15" fill="#c00000" stroke="#800000" />
      <circle cx="16" cy="16" r="12" fill="none" fillOpacity="0.35" stroke="#ff6b6b" />
      <path
        d="M10 10 L22 22 M22 10 L10 22"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}



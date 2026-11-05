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

/** The waving four-colour Windows flag used by the Start button. */
export function WindowsFlagIcon({ className }: RetroIconProps): JSX.Element {
  return (
    <svg
      {...DEFAULT_SVG_ATTRIBUTES}
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      shapeRendering="crispEdges"
    >
      <path d="M1 3.2 L6.8 1.8 L6.8 7 L1 7.6 Z" fill="#ff2222" />
      <path d="M7.6 1.6 L15 0.6 L15 6.4 L7.6 7 Z" fill="#22a022" />
      <path d="M1 8.4 L6.8 7.8 L6.8 13.4 L1 14.6 Z" fill="#2222d0" />
      <path d="M7.6 7.8 L15 6.9 L15 13.2 L7.6 14.2 Z" fill="#f0d000" />
    </svg>
  );
}

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

/** Manila folder, for the "Programmes" start menu entry. */
export function FolderIcon({ className }: RetroIconProps): JSX.Element {
  return (
    <svg
      {...DEFAULT_SVG_ATTRIBUTES}
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      shapeRendering="crispEdges"
    >
      <path d="M1 3.5 H6.2 L7.6 5.3 H15 V8 H1 Z" fill="#e8c840" stroke="#000000" />
      <rect x="1" y="6.5" width="14" height="7.5" fill="#ffe870" stroke="#000000" />
    </svg>
  );
}

/** Mini application window, used for the CrashMyEgo start menu entry. */
export function AppWindowIcon({ className }: RetroIconProps): JSX.Element {
  return (
    <svg
      {...DEFAULT_SVG_ATTRIBUTES}
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      shapeRendering="crispEdges"
    >
      <rect x="1.5" y="2.5" width="13" height="11" fill="#c0c0c0" stroke="#000000" />
      <rect x="2.5" y="3.5" width="11" height="2.5" fill="#000080" />
      <rect x="3.5" y="7.5" width="9" height="1.5" fill="#808080" />
      <rect x="3.5" y="10" width="6" height="1.5" fill="#808080" />
    </svg>
  );
}

/** Control panel sliders, for the "Paramètres" start menu entry. */
export function SettingsIcon({ className }: RetroIconProps): JSX.Element {
  return (
    <svg
      {...DEFAULT_SVG_ATTRIBUTES}
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      shapeRendering="crispEdges"
    >
      <rect x="1.5" y="3.5" width="13" height="9" fill="#c0c0c0" stroke="#000000" />
      <rect x="3" y="5.5" width="10" height="1.5" fill="#808080" />
      <rect x="3" y="9.5" width="10" height="1.5" fill="#808080" />
      <rect x="5" y="4.7" width="2.5" height="3.1" fill="#ffffff" stroke="#000000" />
      <rect x="9.5" y="8.7" width="2.5" height="3.1" fill="#ffffff" stroke="#000000" />
    </svg>
  );
}

/** Navy help badge with a white question mark. */
export function HelpIcon({ className }: RetroIconProps): JSX.Element {
  return (
    <svg {...DEFAULT_SVG_ATTRIBUTES} viewBox="0 0 16 16" className={className} fill="none">
      <rect x="1.5" y="1.5" width="13" height="13" fill="#000080" stroke="#000000" />
      <text
        x="8"
        y="12"
        fill="#ffffff"
        fontFamily="Tahoma, Verdana, sans-serif"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
      >
        ?
      </text>
    </svg>
  );
}

/** Red power button, for the shutdown start menu entry. */
export function PowerIcon({ className }: RetroIconProps): JSX.Element {
  return (
    <svg {...DEFAULT_SVG_ATTRIBUTES} viewBox="0 0 16 16" className={className} fill="none">
      <circle cx="8" cy="8" r="6.5" fill="#c00000" stroke="#000000" />
      <path d="M8 3.8 V8" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M5.2 6.2 A3.6 3.6 0 1 0 10.8 6.2"
        stroke="#ffffff"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

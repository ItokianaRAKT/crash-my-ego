import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

const TRACK_BORDER_WIDTH_PX = 2;
const TRACK_CONTENT_HEIGHT_PX = 112;
const HANDLE_HEIGHT_PX = 16;
const HANDLE_TRAVEL_PX = TRACK_CONTENT_HEIGHT_PX - HANDLE_HEIGHT_PX;
const KEYBOARD_STEP = 0.05;
const PAGE_STEP = 0.2;

export interface VolumeSliderProps {
  volume: number;
  onVolumeChange: (nextVolume: number) => void;
  onClose: () => void;
}

function clampVolume(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function roundToStep(value: number): number {
  return Math.round(value * 100) / 100;
}

export function VolumeSlider({
  volume,
  onVolumeChange,
  onClose,
}: VolumeSliderProps): JSX.Element {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const updateFromClientY = useCallback(
    (clientY: number): void => {
      const track = trackRef.current;

      if (track === null) {
        return;
      }

      const trackRect = track.getBoundingClientRect();
      const paddingBoxTop = trackRect.top + TRACK_BORDER_WIDTH_PX;
      const handleTop = clientY - paddingBoxTop - HANDLE_HEIGHT_PX / 2;
      const nextVolume = 1 - handleTop / HANDLE_TRAVEL_PX;

      onVolumeChange(roundToStep(clampVolume(nextVolume)));
    },
    [onVolumeChange],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>): void => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDragging(true);
      updateFromClientY(event.clientY);
    },
    [updateFromClientY],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>): void => {
      if (isDragging) {
        updateFromClientY(event.clientY);
      }
    },
    [isDragging, updateFromClientY],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>): void => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setIsDragging(false);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      let nextVolume: number | null = null;

      if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
        nextVolume = volume + KEYBOARD_STEP;
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
        nextVolume = volume - KEYBOARD_STEP;
      } else if (event.key === 'PageUp') {
        nextVolume = volume + PAGE_STEP;
      } else if (event.key === 'PageDown') {
        nextVolume = volume - PAGE_STEP;
      } else if (event.key === 'Home') {
        nextVolume = 0;
      } else if (event.key === 'End') {
        nextVolume = 1;
      }

      if (nextVolume !== null) {
        event.preventDefault();
        onVolumeChange(roundToStep(clampVolume(nextVolume)));
      }
    },
    [onVolumeChange, volume],
  );

  const handleBottomOffsetPx = Math.round(volume * HANDLE_TRAVEL_PX);
  const volumePercent = Math.round(volume * 100);

  return (
    <div
      role="group"
      aria-label="Réglage du volume"
      onClick={(event) => event.stopPropagation()}
      className="win95-raised absolute right-0 bottom-[100%] mb-[4px] flex flex-col items-center gap-[6px] bg-[#c0c0c0] px-[10px] py-[7px]"
    >
      <p className="text-[11px] tabular-nums text-black">{volumePercent}%</p>

      <div className="flex h-[116px] items-stretch gap-[4px]">
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Volume"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={volumePercent}
          aria-valuetext={`${volumePercent} pour cent`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          className={`win95-sunken relative h-full w-[26px] cursor-ns-resize touch-none bg-[#dfdfdf] ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
        >
          <span
            aria-hidden="true"
            className="win95-raised absolute left-[2px] w-[22px] bg-[#c0c0c0]"
            style={{
              height: `${HANDLE_HEIGHT_PX}px`,
              bottom: `${handleBottomOffsetPx}px`,
            }}
          />
        </div>

        <div
          aria-hidden="true"
          className="flex flex-col justify-between py-[3px] pr-[2px]"
        >
          <span className="h-[1px] w-[6px] bg-black" />
          <span className="h-[1px] w-[6px] bg-black" />
          <span className="h-[1px] w-[6px] bg-black" />
        </div>
      </div>
    </div>
  );
}

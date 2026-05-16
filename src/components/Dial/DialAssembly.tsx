import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { config } from '../../config';
import { isValidDialDate, randomDate } from '../../lib/dates';

// The DialAssembly is the central tactile control. Three concentric brass
// rings — year / month / day — engraved with their values. A center hub
// renders the selected date as phosphor on a small CRT readout. A pointer
// rivet at 12 o'clock anchors the "selection" position visually.
//
// V1 interaction: +/- pills below the dial commit changes. Drag-to-rotate
// is on the roadmap (v2) — the rings carry inertia in spec, but the visual
// is the focus of this pass.

const MIN_YEAR = parseInt(config.MIN_DATE.slice(0, 4), 10);
const TODAY = new Date();
const MAX_YEAR = TODAY.getFullYear();

const Frame = styled.div`
  position: relative;
  width: min(420px, 88vw);
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    width: min(320px, 90vw);
  }
`;

const Ring = styled.div<{ $size: number; $depth: number }>`
  position: absolute;
  inset: ${(p) => p.$depth}%;
  border-radius: ${theme.radius.knob};
  background:
    radial-gradient(circle at 30% 25%, #E8C66A 0%, transparent 35%),
    radial-gradient(circle at 50% 50%, #B08D57 0%, #8A6A2E 60%, #5C4519 100%);
  box-shadow:
    inset 0 4px 8px rgba(0, 0, 0, 0.55),
    inset 0 -3px 4px rgba(212, 175, 55, 0.25),
    0 2px 4px rgba(0, 0, 0, 0.4);
`;

// Engraved text rendered radially via SVG textPath on a hidden arc.
const Glyphs = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Hub = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 30%;
  height: 30%;
  transform: translate(-50%, -50%);
  border-radius: ${theme.radius.knob};
  background:
    radial-gradient(circle, ${theme.color.crt.screen} 0%, #02080A 100%);
  box-shadow:
    inset 0 4px 10px rgba(0, 0, 0, 0.85),
    inset 0 0 28px rgba(0, 0, 0, 0.7),
    0 0 0 4px ${theme.color.chassis.brassDark},
    0 0 0 5px ${theme.color.chassis.brassBase};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: ${theme.font.mono};
  color: ${theme.color.crt.phosphor};
  text-shadow: ${theme.glow.phosphorHot};
  letter-spacing: 0.04em;
  padding: 4px;
  text-align: center;
  user-select: none;
`;

const HubDate = styled.div`
  font-size: clamp(15px, 3.2vw, 22px);
  line-height: 1.1;
`;

const HubMode = styled.div`
  font-family: ${theme.font.display};
  font-size: 10px;
  letter-spacing: 0.18em;
  color: ${theme.color.crt.phosphorDim};
  margin-top: 4px;
  text-transform: uppercase;
`;

// Pointer rivet at 12 o'clock — purely visual reference.
const Pointer = styled.div`
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-top: 16px solid ${theme.color.chassis.brass};
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.6));
  z-index: 5;

  &::after {
    content: '';
    position: absolute;
    top: -18px;
    left: -3px;
    width: 6px;
    height: 6px;
    border-radius: ${theme.radius.rivet};
    background: radial-gradient(circle at 35% 30%, #FBE3A2 0%, #D4AF37 50%, #4A3A1A 100%);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.6);
  }
`;

// Knob "knurl" overlay — radial pattern to suggest grippable edge.
const Knurl = styled.div`
  position: absolute;
  inset: 0;
  border-radius: ${theme.radius.knob};
  background: conic-gradient(
    from 0deg,
    rgba(0, 0, 0, 0.08) 0deg,
    transparent 4deg,
    transparent 8deg,
    rgba(255, 220, 140, 0.1) 12deg
  );
  background-size: 24deg 24deg;
  mix-blend-mode: overlay;
  pointer-events: none;
`;

// Sub-controls row (Random / specific year jump).
const Controls = styled.div`
  display: flex;
  gap: ${theme.space.snug};
  justify-content: center;
  margin-top: ${theme.space.snug};
  flex-wrap: wrap;
`;

const Pill = styled.button`
  padding: 6px ${theme.space.base};
  border-radius: ${theme.radius.button};
  font-family: ${theme.font.display};
  font-size: 12px;
  letter-spacing: ${theme.tracking.display};
  text-transform: uppercase;
  background: ${theme.texture.brass};
  background-blend-mode: overlay, normal;
  color: ${theme.color.text.onChassis};
  box-shadow: ${theme.shadow.buttonResting};
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
  cursor: pointer;
  min-height: 36px;
  transition:
    transform 60ms ease-out,
    box-shadow 60ms ease-out;

  &:hover:not(:disabled) {
    box-shadow: ${theme.shadow.buttonResting}, ${theme.glow.brassWarm};
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: ${theme.shadow.buttonPressed};
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const MONTH_NAMES = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

function clampDay(year: number, month: number, day: number) {
  const last = new Date(year, month, 0).getDate();
  return Math.min(Math.max(1, day), last);
}

function toIso(year: number, month: number, day: number) {
  const m = String(month).padStart(2, '0');
  const d = String(clampDay(year, month, day)).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function parseIso(iso: string) {
  const [y, m, d] = iso.split('-').map((n) => parseInt(n, 10));
  return { year: y, month: m, day: d };
}

type Props = {
  date: string;
  disabled?: boolean;
  onDateChange: (iso: string) => void;
};

export function DialAssembly({ date, disabled, onDateChange }: Props) {
  const { year, month, day } = useMemo(() => parseIso(date), [date]);

  const commit = useCallback(
    (next: { year?: number; month?: number; day?: number }) => {
      if (disabled) return;
      const y = next.year ?? year;
      const m = next.month ?? month;
      const d = next.day ?? day;
      const yearClamped = Math.min(Math.max(MIN_YEAR, y), MAX_YEAR);
      const iso = toIso(yearClamped, m, d);
      if (!isValidDialDate(iso)) return;
      if (iso === date) return;
      onDateChange(iso);
    },
    [date, day, disabled, month, onDateChange, year]
  );

  const adjustYear = (delta: number) => commit({ year: year + delta });
  const adjustMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    while (m < 1) {
      m += 12;
      y -= 1;
    }
    while (m > 12) {
      m -= 12;
      y += 1;
    }
    commit({ year: y, month: m });
  };
  const adjustDay = (delta: number) => commit({ day: day + delta });

  // Tick marks every 25 years on the outer ring.
  const yearTicks = useMemo(() => {
    const arr: { angle: number; label?: string }[] = [];
    // Show ~25 ticks evenly. Label every 100 years.
    const ticks = 24;
    for (let i = 0; i < ticks; i++) {
      const yearAt = MIN_YEAR + Math.round(((MAX_YEAR - MIN_YEAR) / ticks) * i);
      arr.push({
        angle: (i / ticks) * 360,
        label: yearAt % 100 === 0 || i === 0 ? String(yearAt) : undefined,
      });
    }
    return arr;
  }, []);

  const monthLabels = MONTH_NAMES;
  const dayLabels = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  return (
    <div>
      <Frame role="group" aria-label="Time dial: year, month, day">
        <Pointer aria-hidden />

        {/* Outer ring — YEAR */}
        <Ring $size={100} $depth={0}>
          <Knurl />
          <Glyphs viewBox="-100 -100 200 200" aria-hidden>
            <defs>
              <path id="year-arc" d="M0,-86 a86,86 0 1,1 -0.01,0" fill="none" />
            </defs>
            <text
              fontFamily={theme.font.display}
              fontSize="7"
              letterSpacing="0.6"
              fill={theme.color.text.onChassis}
              style={{ filter: 'drop-shadow(0 0.5px 0 rgba(0,0,0,0.55))' }}
            >
              {yearTicks
                .filter((t) => t.label)
                .map((t, i, arr) => {
                  // Distribute labels evenly around the arc — at fractional offsets.
                  const offset = (i / arr.length) * 100;
                  return (
                    <textPath
                      key={`y${i}`}
                      href="#year-arc"
                      startOffset={`${offset}%`}
                    >
                      {t.label}
                    </textPath>
                  );
                })}
            </text>
          </Glyphs>
        </Ring>

        {/* Middle ring — MONTH */}
        <Ring $size={66} $depth={20}>
          <Knurl />
          <Glyphs viewBox="-100 -100 200 200" aria-hidden>
            <defs>
              <path id="month-arc" d="M0,-62 a62,62 0 1,1 -0.01,0" fill="none" />
            </defs>
            <text
              fontFamily={theme.font.display}
              fontSize="7"
              letterSpacing="1.2"
              fill={theme.color.text.onChassis}
              style={{ filter: 'drop-shadow(0 0.5px 0 rgba(0,0,0,0.55))' }}
            >
              {monthLabels.map((m, i) => (
                <textPath
                  key={`m${i}`}
                  href="#month-arc"
                  startOffset={`${(i / 12) * 100}%`}
                >
                  {m}
                </textPath>
              ))}
            </text>
          </Glyphs>
        </Ring>

        {/* Inner ring — DAY */}
        <Ring $size={42} $depth={36}>
          <Knurl />
          <Glyphs viewBox="-100 -100 200 200" aria-hidden>
            <defs>
              <path id="day-arc" d="M0,-44 a44,44 0 1,1 -0.01,0" fill="none" />
            </defs>
            <text
              fontFamily={theme.font.display}
              fontSize="5.5"
              letterSpacing="0.8"
              fill={theme.color.text.onChassis}
              style={{ filter: 'drop-shadow(0 0.5px 0 rgba(0,0,0,0.55))' }}
            >
              {dayLabels.map((d, i) => (
                <textPath
                  key={`d${i}`}
                  href="#day-arc"
                  startOffset={`${(i / 31) * 100}%`}
                >
                  {d}
                </textPath>
              ))}
            </text>
          </Glyphs>
        </Ring>

        <Hub aria-live="polite">
          <HubDate>
            {String(year).padStart(4, '0')}-{String(month).padStart(2, '0')}-
            {String(day).padStart(2, '0')}
          </HubDate>
          <HubMode>{MONTH_NAMES[month - 1]} {day}, {year}</HubMode>
        </Hub>
      </Frame>

      <Controls>
        <Pill type="button" disabled={disabled} onClick={() => adjustYear(-1)} aria-label="Year minus one">
          − YR
        </Pill>
        <Pill type="button" disabled={disabled} onClick={() => adjustYear(1)} aria-label="Year plus one">
          + YR
        </Pill>
        <Pill type="button" disabled={disabled} onClick={() => adjustMonth(-1)} aria-label="Month minus one">
          − MO
        </Pill>
        <Pill type="button" disabled={disabled} onClick={() => adjustMonth(1)} aria-label="Month plus one">
          + MO
        </Pill>
        <Pill type="button" disabled={disabled} onClick={() => adjustDay(-1)} aria-label="Day minus one">
          − DY
        </Pill>
        <Pill type="button" disabled={disabled} onClick={() => adjustDay(1)} aria-label="Day plus one">
          + DY
        </Pill>
        <Pill type="button" disabled={disabled} onClick={() => onDateChange(randomDate())}>
          Random
        </Pill>
      </Controls>
    </div>
  );
}

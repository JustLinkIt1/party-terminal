import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { config } from '../../config';
import { isValidDialDate, randomDate } from '../../lib/dates';

// The DialAssembly is the central tactile control. The three-ring engraved
// brass disc is rendered from /assets/dial-disc.png; on top of it we render a
// phosphor center readout showing the *pending* date and a brass pointer rivet
// at 12 o'clock.
//
// Critically, the dial maintains a *pendingDate* internally and only emits
// onDateChange when the user explicitly presses TUNE IN. +/-1 year scrolling,
// typing into the date field, and picking a decade all mutate pendingDate
// only — they never load the bot automatically. Random and the preset chips
// (parent component) remain one-shot: they commit immediately.

const MIN_YEAR = parseInt(config.MIN_DATE.slice(0, 4), 10);
const TODAY = new Date();
const MAX_YEAR = TODAY.getFullYear();
const TODAY_ISO = TODAY.toISOString().slice(0, 10);

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.base};
`;

const DiscWrap = styled.div`
  position: relative;
  width: min(420px, 88vw);
  aspect-ratio: 1 / 1;
  background: url('/assets/dial-disc.png') no-repeat center / contain;
  filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.55));

  @media (max-width: ${theme.breakpoints.md}) {
    width: min(320px, 90vw);
  }
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

// Phosphor readout overlaid in the dial's center. Sits on top of the PNG's
// baked-in center disc.
const Hub = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 26%;
  height: 26%;
  border-radius: 999px;
  background: radial-gradient(circle, ${theme.color.crt.screen} 0%, #02080A 100%);
  box-shadow:
    inset 0 4px 10px rgba(0, 0, 0, 0.85),
    inset 0 0 28px rgba(0, 0, 0, 0.7);
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
  font-size: clamp(13px, 2.8vw, 18px);
  line-height: 1.1;
`;

const HubMode = styled.div<{ $pending: boolean }>`
  font-family: ${theme.font.display};
  font-size: 9px;
  letter-spacing: 0.18em;
  color: ${(p) =>
    p.$pending ? theme.color.crt.amberWarn : theme.color.crt.phosphorDim};
  margin-top: 4px;
  text-transform: uppercase;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${theme.space.snug};
  width: min(480px, 92vw);

  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.space.tight};
  }
`;

const ControlBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ControlLabel = styled.label`
  font-family: ${theme.font.display};
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${theme.color.text.onChassisMuted};
  text-align: center;
`;

const StepRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
`;

const StepValue = styled.div`
  flex: 1;
  text-align: center;
  font-family: ${theme.font.mono};
  font-size: 14px;
  color: ${theme.color.crt.phosphor};
  text-shadow: ${theme.glow.phosphorSoft};
  background: ${theme.color.crt.screen};
  border: 1px solid rgba(212, 175, 55, 0.35);
  border-radius: 4px;
  padding: 6px;
  min-width: 0;
`;

const Pill = styled.button`
  padding: 9px 12px;
  border-radius: ${theme.radius.button};
  font-family: ${theme.font.display};
  font-size: 13px;
  letter-spacing: ${theme.tracking.display};
  text-transform: uppercase;
  background: ${theme.texture.brass};
  background-blend-mode: overlay, normal;
  color: ${theme.color.text.onChassis};
  box-shadow: ${theme.shadow.buttonResting};
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
  border: none;
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
  transition:
    transform 60ms ease-out,
    box-shadow 60ms ease-out;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 10px 12px;
    font-size: 14px;
  }

  &:hover:not(:disabled) {
    box-shadow: ${theme.shadow.buttonResting}, ${theme.glow.brassWarm};
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: ${theme.shadow.buttonPressed};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DropDown = styled.select`
  font-family: ${theme.font.mono};
  font-size: 14px;
  color: ${theme.color.crt.phosphor};
  background: ${theme.color.crt.screen};
  border: 1px solid rgba(212, 175, 55, 0.35);
  border-radius: 4px;
  padding: 6px 8px;
  min-height: 36px;
  cursor: pointer;
  text-shadow: ${theme.glow.phosphorSoft};

  &:focus {
    outline: 1px solid ${theme.color.chassis.brassBright};
  }
`;

const TypedInput = styled.input<{ $invalid: boolean }>`
  font-family: ${theme.font.mono};
  font-size: 16px;
  text-align: center;
  color: ${(p) =>
    p.$invalid ? theme.color.crt.amberWarn : theme.color.crt.phosphor};
  background: ${theme.color.crt.screen};
  border: 1px solid
    ${(p) =>
      p.$invalid
        ? theme.color.crt.amberWarn
        : 'rgba(212, 175, 55, 0.35)'};
  border-radius: 4px;
  padding: 8px 12px;
  min-height: 40px;
  text-shadow: ${(p) =>
    p.$invalid ? theme.glow.indicatorAmber : theme.glow.phosphorSoft};
  letter-spacing: 0.06em;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: 1px solid ${theme.color.chassis.brassBright};
  }
`;

const CommitRow = styled.div`
  display: flex;
  gap: ${theme.space.snug};
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const TuneInButton = styled.button<{ $armed: boolean }>`
  width: 180px;
  height: 56px;
  padding: 0;
  border: none;
  background: url('/assets/button-cap.png') no-repeat center / 100% 100%;
  font-family: ${theme.font.display};
  letter-spacing: ${theme.tracking.display};
  font-size: 15px;
  text-transform: uppercase;
  color: ${(p) =>
    p.$armed ? theme.color.chassis.brassBright : theme.color.text.onChassisMuted};
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.65),
    ${(p) => (p.$armed ? '0 0 8px rgba(91, 255, 138, 0.45)' : 'none')};
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.45));
  cursor: ${(p) => (p.$armed ? 'pointer' : 'not-allowed')};
  transition:
    transform 60ms ease-out,
    filter 120ms ease,
    color 200ms ease;
  opacity: ${(p) => (p.$armed ? 1 : 0.55)};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.5))
      drop-shadow(0 0 8px rgba(212, 175, 55, 0.45));
  }
  &:active:not(:disabled) {
    transform: translateY(2px);
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.6));
  }
`;

const RandomPill = styled(Pill)`
  min-width: 100px;
`;

const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
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

// Decade options: 1500s, 1600s, …, current decade.
function decadeOptions(): { value: number; label: string }[] {
  const opts: { value: number; label: string }[] = [];
  for (let decade = 1500; decade <= MAX_YEAR; decade += decade < 1900 ? 100 : 10) {
    opts.push({ value: decade, label: `${decade}s` });
  }
  // Always include the current decade.
  const curDecade = Math.floor(MAX_YEAR / 10) * 10;
  if (!opts.find((o) => o.value === curDecade)) {
    opts.push({ value: curDecade, label: `${curDecade}s` });
  }
  return opts;
}

type Props = {
  /** Committed date — what the chat is currently tuned to. */
  date: string;
  disabled?: boolean;
  /** Fired only on explicit commit (TUNE IN, Random, or external preset). */
  onDateChange: (iso: string) => void;
};

export function DialAssembly({ date, disabled, onDateChange }: Props) {
  // Pending state is detached from the committed date prop. The chat only
  // reacts to commits via onDateChange.
  const [pending, setPending] = useState(date);
  const [typed, setTyped] = useState(date);
  const [typedInvalid, setTypedInvalid] = useState(false);

  // When the parent commits a different date externally (preset chip, etc.),
  // sync our pending so the dial reflects the truth.
  useEffect(() => {
    setPending(date);
    setTyped(date);
    setTypedInvalid(false);
  }, [date]);

  const { year, month, day } = useMemo(() => parseIso(pending), [pending]);
  const isDirty = pending !== date;

  const mutatePending = useCallback(
    (next: { year?: number; month?: number; day?: number }) => {
      const y = Math.min(Math.max(MIN_YEAR, next.year ?? year), MAX_YEAR);
      const m = next.month ?? month;
      const d = next.day ?? day;
      const iso = toIso(y, m, d);
      if (!isValidDialDate(iso)) return;
      setPending(iso);
      setTyped(iso);
      setTypedInvalid(false);
    },
    [year, month, day]
  );

  const adjustYear = (delta: number) => mutatePending({ year: year + delta });
  const adjustMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    while (m < 1) { m += 12; y -= 1; }
    while (m > 12) { m -= 12; y += 1; }
    mutatePending({ year: y, month: m });
  };
  const adjustDay = (delta: number) => mutatePending({ day: day + delta });

  const onDecade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const decade = parseInt(e.target.value, 10);
    if (Number.isNaN(decade)) return;
    // Snap to the middle-ish of that decade — or to today if user picked the
    // current decade and we'd otherwise overshoot.
    const mid = decade < 1900 ? decade + 50 : decade + 5;
    const yClamped = Math.min(mid, MAX_YEAR);
    mutatePending({ year: yClamped });
  };

  const onTyped = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTyped(v);
    if (/^\d{4}-\d{2}-\d{2}$/.test(v) && isValidDialDate(v)) {
      setPending(v);
      setTypedInvalid(false);
    } else {
      setTypedInvalid(true);
    }
  };

  const onTypedBlur = () => {
    // On blur, snap back to pending if user left something invalid.
    if (typedInvalid) {
      setTyped(pending);
      setTypedInvalid(false);
    }
  };

  const onTypedKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !typedInvalid && isDirty) {
      onDateChange(pending);
    }
  };

  const tuneIn = () => {
    if (!isDirty || disabled) return;
    onDateChange(pending);
  };

  const fireRandom = () => {
    if (disabled) return;
    onDateChange(randomDate());
  };

  const decades = useMemo(() => decadeOptions(), []);
  const currentDecade = Math.floor(year / (year < 1900 ? 100 : 10)) * (year < 1900 ? 100 : 10);

  return (
    <Outer>
      <DiscWrap role="group" aria-label="Time dial">
        <Pointer aria-hidden />
        <Hub>
          <HubDate>
            {String(year).padStart(4, '0')}-{String(month).padStart(2, '0')}-
            {String(clampDay(year, month, day)).padStart(2, '0')}
          </HubDate>
          <HubMode $pending={isDirty}>
            {isDirty ? '◆ PENDING' : 'TUNED'}
          </HubMode>
        </Hub>
      </DiscWrap>

      <Controls>
        <ControlBlock>
          <ControlLabel>Year</ControlLabel>
          <StepRow>
            <Pill type="button" disabled={disabled} onClick={() => adjustYear(-1)} aria-label="Year minus one">−</Pill>
            <StepValue>{year}</StepValue>
            <Pill type="button" disabled={disabled} onClick={() => adjustYear(1)} aria-label="Year plus one">+</Pill>
          </StepRow>
        </ControlBlock>
        <ControlBlock>
          <ControlLabel>Month</ControlLabel>
          <StepRow>
            <Pill type="button" disabled={disabled} onClick={() => adjustMonth(-1)} aria-label="Month minus one">−</Pill>
            <StepValue>{MONTH_NAMES[month - 1]}</StepValue>
            <Pill type="button" disabled={disabled} onClick={() => adjustMonth(1)} aria-label="Month plus one">+</Pill>
          </StepRow>
        </ControlBlock>
        <ControlBlock>
          <ControlLabel>Day</ControlLabel>
          <StepRow>
            <Pill type="button" disabled={disabled} onClick={() => adjustDay(-1)} aria-label="Day minus one">−</Pill>
            <StepValue>{String(clampDay(year, month, day)).padStart(2, '0')}</StepValue>
            <Pill type="button" disabled={disabled} onClick={() => adjustDay(1)} aria-label="Day plus one">+</Pill>
          </StepRow>
        </ControlBlock>
      </Controls>

      <Controls>
        <ControlBlock>
          <ControlLabel htmlFor="decade-jump">Decade jump</ControlLabel>
          <DropDown
            id="decade-jump"
            value={currentDecade}
            onChange={onDecade}
            disabled={disabled}
            aria-label="Jump to a decade"
          >
            {decades.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </DropDown>
        </ControlBlock>
        <ControlBlock style={{ gridColumn: 'span 2' }}>
          <ControlLabel htmlFor="typed-date">
            Type a date (YYYY-MM-DD, {config.MIN_DATE} → {TODAY_ISO})
          </ControlLabel>
          <TypedInput
            id="typed-date"
            type="text"
            inputMode="numeric"
            value={typed}
            onChange={onTyped}
            onBlur={onTypedBlur}
            onKeyDown={onTypedKey}
            disabled={disabled}
            $invalid={typedInvalid}
            placeholder="YYYY-MM-DD"
            spellCheck={false}
            aria-invalid={typedInvalid}
            aria-describedby={typedInvalid ? 'typed-date-error' : undefined}
          />
        </ControlBlock>
      </Controls>

      <CommitRow>
        <TuneInButton
          type="button"
          onClick={tuneIn}
          disabled={disabled || !isDirty}
          $armed={isDirty && !disabled}
          aria-label={isDirty ? 'Tune in to the pending date' : 'No pending change'}
        >
          {isDirty ? 'Tune In' : 'Tuned In'}
        </TuneInButton>
        <RandomPill type="button" disabled={disabled} onClick={fireRandom}>
          Random
        </RandomPill>
      </CommitRow>
    </Outer>
  );
}

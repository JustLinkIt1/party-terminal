import styled, { css } from 'styled-components';
import { theme } from '../../theme';
import { config } from '../../config';

const Row = styled.div`
  display: flex;
  gap: ${theme.space.snug};
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: ${theme.space.tight};

    /* Edge fade mask */
    mask-image: linear-gradient(
      to right,
      transparent 0,
      black 16px,
      black calc(100% - 16px),
      transparent 100%
    );

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

// Brass button cap rendered via button-cap.png. Label sits engraved on top.
const Cap = styled.button<{ $active: boolean }>`
  position: relative;
  flex-shrink: 0;
  scroll-snap-align: start;
  width: 110px;
  height: 56px;
  padding: 0;
  border: none;
  background: url('/assets/button-cap.png') no-repeat center / 100% 100%;
  font-family: ${theme.font.display};
  letter-spacing: ${theme.tracking.display};
  font-size: 13px;
  text-transform: uppercase;
  color: ${(p) =>
    p.$active ? theme.color.chassis.brassBright : theme.color.text.onChassis};
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.65),
    0 -1px 0 rgba(212, 175, 55, 0.18);
  transform: translateY(${(p) => (p.$active ? '1px' : '0')});
  transition:
    transform 60ms ease-out,
    filter 120ms ease,
    color 200ms ease;
  cursor: pointer;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.45));

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.5))
      drop-shadow(0 0 6px rgba(212, 175, 55, 0.35));
  }

  &:active:not(:disabled) {
    transform: translateY(2px);
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.6));
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  ${(p) =>
    p.$active &&
    css`
      color: ${theme.color.chassis.brassBright};
    `}

  @media (max-width: ${theme.breakpoints.md}) {
    width: 96px;
    height: 48px;
    font-size: 12px;
  }
`;

type Props = {
  date: string;
  disabled?: boolean;
  onPick: (iso: string) => void;
};

export function PresetChipRow({ date, disabled, onPick }: Props) {
  return (
    <Row role="group" aria-label="Famous date presets">
      {config.PRESET_DATES.map((p) => (
        <Cap
          key={p.date}
          type="button"
          $active={p.date === date}
          disabled={disabled}
          onClick={() => onPick(p.date)}
          aria-pressed={p.date === date}
          aria-label={`Jump to ${p.label.replace(/\+1$/, 'day after')}`}
        >
          {p.label}
        </Cap>
      ))}
    </Row>
  );
}

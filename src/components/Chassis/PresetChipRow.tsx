import styled, { css } from 'styled-components';
import { theme } from '../../theme';
import { config } from '../../config';

const Row = styled.div`
  display: flex;
  gap: ${theme.space.snug};
  flex-wrap: wrap;
  align-items: center;

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

const Cap = styled.button<{ $active: boolean }>`
  position: relative;
  flex-shrink: 0;
  scroll-snap-align: start;
  padding: ${theme.space.tight} ${theme.space.base};
  border-radius: ${theme.radius.button};
  font-family: ${theme.font.display};
  letter-spacing: ${theme.tracking.display};
  font-size: 13px;
  text-transform: uppercase;
  background: ${theme.texture.brass};
  background-blend-mode: overlay, normal;
  color: ${(p) =>
    p.$active ? theme.color.chassis.brassBright : theme.color.text.onChassis};
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  box-shadow: ${(p) =>
    p.$active ? theme.shadow.buttonPressed : theme.shadow.buttonResting};
  transform: translateY(${(p) => (p.$active ? '1px' : '0')});
  transition:
    transform 60ms ease-out,
    box-shadow 60ms ease-out,
    color 200ms ease;
  cursor: pointer;
  min-height: 44px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      ${theme.shadow.buttonResting},
      ${theme.glow.brassWarm};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: ${theme.shadow.buttonPressed};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  ${(p) =>
    p.$active &&
    css`
      &::after {
        content: '';
        position: absolute;
        inset: 3px;
        border: 1px solid rgba(212, 175, 55, 0.45);
        border-radius: 4px;
        pointer-events: none;
      }
    `}
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

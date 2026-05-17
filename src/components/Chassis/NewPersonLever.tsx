import { useState } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../theme';
import { leverThrow } from '../../styles/keyframes';

const Frame = styled.div`
  position: relative;
  width: 64px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    width: min(220px, 70vw);
    margin: 0 auto;
    height: auto;
    flex-direction: column;
    gap: ${theme.space.tight};
    justify-content: center;
    padding: ${theme.space.tight} 0;
    background: ${theme.texture.brassDarker};
    background-blend-mode: multiply;
    border-radius: ${theme.radius.panel};
    box-shadow: ${theme.shadow.panelInset};

    &::before {
      content: '';
      position: absolute;
      inset: 4px;
      border: 1px solid rgba(212, 175, 55, 0.22);
      border-radius: 5px;
      pointer-events: none;
    }
  }
`;

const LeverButton = styled.button<{ $throwing: boolean }>`
  position: relative;
  width: 64px;
  height: 160px;
  padding: 0;
  border: none;
  background: url('/assets/lever.png') no-repeat center / contain;
  cursor: pointer;
  transform-origin: 50% 90%;
  transition: filter 200ms ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55));

  ${(p) =>
    p.$throwing &&
    css`
      animation: ${leverThrow} 720ms ${theme.motion.overshoot};
    `}

  &:hover:not(:disabled) {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55))
      drop-shadow(0 0 8px rgba(212, 175, 55, 0.45));
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    width: 56px;
    height: 132px;
  }
`;

const Caption = styled.span`
  font-family: ${theme.font.display};
  font-size: 10px;
  letter-spacing: ${theme.tracking.display};
  text-transform: uppercase;
  color: ${theme.color.text.onChassisMuted};
  margin-top: ${theme.space.tight};
  text-align: center;
  line-height: 1.2;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 11px;
    margin-top: 0;
  }
`;

type Props = {
  disabled?: boolean;
  onPull: () => void;
};

export function NewPersonLever({ disabled, onPull }: Props) {
  const [throwing, setThrowing] = useState(false);

  const fire = () => {
    if (disabled || throwing) return;
    setThrowing(true);
    onPull();
    setTimeout(() => setThrowing(false), 720);
  };

  return (
    <Frame>
      <LeverButton
        $throwing={throwing}
        type="button"
        onClick={fire}
        disabled={disabled}
        aria-label="Pull lever to meet a new person from this date"
      />
      <Caption>Pull — New Person</Caption>
    </Frame>
  );
}

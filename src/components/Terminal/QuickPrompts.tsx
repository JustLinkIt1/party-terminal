import styled from 'styled-components';
import { theme } from '../../theme';
import { quickPromptsFor } from '../../lib/quickPrompts';

// Three era-flavored opener chips that sit beneath the prompt after the
// persona arrives. They tap-to-fill-and-send so the visitor never faces a
// blank line. After the first message they fade off — they're a starter,
// not a permanent menu.

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.space.tight};
  padding: ${theme.space.tight} 0 0;
  font-family: ${theme.font.mono};
  opacity: 0.85;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding-top: 6px;
    gap: 6px;
  }
`;

const Chip = styled.button`
  appearance: none;
  background: rgba(91, 255, 138, 0.06);
  border: 1px solid rgba(91, 255, 138, 0.22);
  border-radius: 999px;
  padding: 10px 14px;
  min-height: 44px;
  color: ${theme.color.crt.phosphorDim};
  font-family: inherit;
  font-size: 15px;
  letter-spacing: 0.01em;
  text-shadow: ${theme.glow.phosphorSoft};
  cursor: pointer;
  transition:
    background 200ms ${theme.motion.overshoot},
    color 200ms ${theme.motion.overshoot},
    border-color 200ms ${theme.motion.overshoot},
    transform 80ms ease-out;

  &::before {
    content: '› ';
    color: ${theme.color.crt.phosphor};
    opacity: 0.7;
    margin-right: 2px;
  }

  &:hover:not(:disabled) {
    background: rgba(91, 255, 138, 0.12);
    border-color: rgba(91, 255, 138, 0.45);
    color: ${theme.color.text.onScreen};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
    padding: 9px 12px;
  }
`;

type Props = {
  date: string;
  disabled: boolean;
  onPick: (text: string) => void;
};

export function QuickPrompts({ date, disabled, onPick }: Props) {
  const prompts = quickPromptsFor(date);
  return (
    <Row role="group" aria-label="Suggested opening questions">
      {prompts.map((p) => (
        <Chip
          key={p}
          type="button"
          disabled={disabled}
          onClick={() => onPick(p)}
        >
          {p}
        </Chip>
      ))}
    </Row>
  );
}

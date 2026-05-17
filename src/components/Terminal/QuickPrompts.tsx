import styled from 'styled-components';
import { theme } from '../../theme';
import { quickPromptsFor } from '../../lib/quickPrompts';

// Era-flavored opener suggestions that sit beneath the prompt after the
// persona arrives. Styled as faint phosphor menu entries — they read as
// "things you could ask," not as primary buttons. Tap area is 44px even
// though the visible weight is light.

const List = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${theme.space.tight} 0 4px;
  font-family: ${theme.font.mono};
  border-top: 1px dashed rgba(91, 255, 138, 0.18);
  margin-top: ${theme.space.tight};
`;

const Heading = styled.div`
  font-family: ${theme.font.mono};
  font-size: 12px;
  letter-spacing: 0.22em;
  color: ${theme.color.crt.phosphorGhost};
  text-transform: uppercase;
  margin-bottom: 4px;
  opacity: 0.7;
`;

const Line = styled.button`
  appearance: none;
  background: transparent;
  border: none;
  text-align: left;
  width: 100%;
  padding: 8px 0;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.color.crt.phosphorDim};
  font-family: inherit;
  font-size: 17px;
  letter-spacing: 0.01em;
  text-shadow: ${theme.glow.phosphorSoft};
  cursor: pointer;
  transition: color 200ms ${theme.motion.overshoot};

  &::before {
    content: '›';
    color: ${theme.color.crt.phosphor};
    opacity: 0.55;
    flex-shrink: 0;
  }

  &:hover:not(:disabled) {
    color: ${theme.color.text.onScreen};
  }

  &:hover:not(:disabled)::before {
    opacity: 1;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
    padding: 9px 0;
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
    <List role="group" aria-label="Suggested opening questions">
      <Heading aria-hidden>· try asking ·</Heading>
      {prompts.map((p) => (
        <Line
          key={p}
          type="button"
          disabled={disabled}
          onClick={() => onPick(p)}
        >
          {p}
        </Line>
      ))}
    </List>
  );
}

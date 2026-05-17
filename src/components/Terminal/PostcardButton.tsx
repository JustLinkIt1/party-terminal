import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { sharePostcard } from '../../lib/postcard';
import type { ChatMessage } from './useChat';

const Button = styled.button`
  appearance: none;
  background: rgba(91, 255, 138, 0.06);
  border: 1px solid rgba(91, 255, 138, 0.32);
  border-radius: 4px;
  padding: 10px 14px;
  min-height: 44px;
  color: ${theme.color.crt.phosphor};
  font-family: ${theme.font.display};
  font-size: 12px;
  letter-spacing: ${theme.tracking.display};
  text-transform: uppercase;
  text-shadow: ${theme.glow.phosphorSoft};
  cursor: pointer;
  transition:
    background 200ms ${theme.motion.overshoot},
    border-color 200ms ${theme.motion.overshoot},
    transform 80ms ease-out;

  &::before {
    content: '◢◣ ';
    color: ${theme.color.chassis.brassBright};
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.55);
    opacity: 0.85;
  }

  &:hover:not(:disabled) {
    background: rgba(91, 255, 138, 0.12);
    border-color: rgba(91, 255, 138, 0.55);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

type Props = {
  date: string;
  persona: string;
  messages: ChatMessage[];
  onToast?: (msg: string) => void;
};

export function PostcardButton({ date, persona, messages, onToast }: Props) {
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await sharePostcard(date, persona, messages);
      onToast?.(result === 'shared' ? 'POSTCARD SHARED' : 'POSTCARD DOWNLOADED');
    } catch (e) {
      onToast?.('POSTCARD FAILED');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handle}
      disabled={busy}
      aria-label="Save this exchange as a postcard image"
    >
      {busy ? 'developing…' : 'Postcard'}
    </Button>
  );
}

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

const ToastWrap = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: calc(${theme.space(6)} + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%) translateY(${(p) => (p.$visible ? '0' : '20px')});
  background: ${theme.colors.bgRaised};
  border: 1px solid ${theme.colors.phosphor};
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.soft};
  padding: ${theme.space(2)} ${theme.space(4)};
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
  z-index: 1000;
`;

type Props = { message: string | null; onClear: () => void; ms?: number };

export function Toast({ message, onClear, ms = 1500 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t1 = setTimeout(() => setVisible(false), ms);
    const t2 = setTimeout(onClear, ms + 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [message, ms, onClear]);

  return <ToastWrap $visible={visible}>{message ?? ''}</ToastWrap>;
}

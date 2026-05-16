import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

const ToastWrap = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: calc(${theme.space.loose} + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%) translateY(${(p) => (p.$visible ? '0' : '20px')});
  background: ${theme.texture.brassDarker};
  background-blend-mode: multiply;
  border-radius: ${theme.radius.panel};
  border: 1px solid rgba(212, 175, 55, 0.35);
  box-shadow:
    ${theme.shadow.panelInset},
    0 6px 18px rgba(0, 0, 0, 0.55);
  color: ${theme.color.text.onChassis};
  font-family: ${theme.font.display};
  letter-spacing: ${theme.tracking.display};
  padding: ${theme.space.snug} ${theme.space.loose};
  font-size: 13px;
  text-transform: uppercase;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.25s ease, transform 0.25s ${theme.motion.overshoot};
  pointer-events: none;
  z-index: ${theme.z.modal};
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

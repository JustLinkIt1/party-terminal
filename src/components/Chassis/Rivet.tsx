import styled from 'styled-components';
import { theme } from '../../theme';

// A polished brass rivet. Pure decoration — aria-hidden by default.
// Built from layered radial gradients to fake spherical lighting from above.
export const Rivet = styled.span<{ $size?: number }>`
  --rivet-size: ${(p) => p.$size ?? 8}px;
  width: var(--rivet-size);
  height: var(--rivet-size);
  border-radius: ${theme.radius.rivet};
  display: inline-block;
  flex-shrink: 0;
  background:
    radial-gradient(circle at 35% 30%, #FBE3A2 0%, #D4AF37 28%, #8A6A2E 62%, #4A3A1A 100%);
  box-shadow: ${theme.shadow.rivet};
  z-index: ${theme.z.rivets};
  pointer-events: none;
`;
Rivet.defaultProps = { 'aria-hidden': true } as never;

// Row of rivets along a horizontal edge — used inside chassis sub-panels.
export const RivetRow = styled.div<{ $count?: number }>`
  display: flex;
  justify-content: space-between;
  padding: 0 ${theme.space.tight};
  pointer-events: none;
`;

import { ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { Rivet } from './Rivet';

// Outer brass body. Centered in the void. Visible rivets at every corner +
// along the long edges. Everything interactive sits on top of this.
const Body = styled.div`
  position: relative;
  width: min(1200px, calc(100vw - 24px));
  margin: 24px auto;
  border-radius: ${theme.radius.panel};
  padding: ${theme.space.panel} ${theme.space.panel} ${theme.space.loose};
  background: ${theme.texture.brass};
  background-blend-mode: overlay, normal;
  box-shadow:
    ${theme.shadow.panelInset},
    0 20px 60px rgba(0, 0, 0, 0.55),
    0 2px 0 ${theme.color.chassis.brassDark};
  z-index: ${theme.z.chassis};
  isolation: isolate;

  /* Faint inner engraved border, like a panel cartouche. */
  &::before {
    content: '';
    position: absolute;
    inset: 14px;
    border: 1px solid rgba(212, 175, 55, 0.18);
    border-radius: ${theme.radius.panel};
    pointer-events: none;
    z-index: 0;
  }

  /* Subtle warm light from upper left (workshop lamp). */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 22% -10%,
      rgba(255, 220, 140, 0.18) 0%,
      transparent 45%
    );
    pointer-events: none;
    z-index: 0;
    border-radius: ${theme.radius.panel};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.space.loose} ${theme.space.snug} ${theme.space.base};
    margin: 12px auto;
    width: calc(100vw - 12px);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.space.base} ${theme.space.tight} ${theme.space.snug};
    margin: 8px auto;
  }
`;

// Position rivets at the four corners + spaced along the top/bottom.
const Corners = styled.div`
  position: absolute;
  inset: 8px;
  pointer-events: none;
  z-index: ${theme.z.rivets};
`;

const Corner = styled(Rivet).attrs<{ $pos: 'tl' | 'tr' | 'bl' | 'br' }>(
  () => ({})
)<{ $pos: 'tl' | 'tr' | 'bl' | 'br' }>`
  position: absolute;
  ${(p) => (p.$pos === 'tl' ? 'top: 0; left: 0;' : '')}
  ${(p) => (p.$pos === 'tr' ? 'top: 0; right: 0;' : '')}
  ${(p) => (p.$pos === 'bl' ? 'bottom: 0; left: 0;' : '')}
  ${(p) => (p.$pos === 'br' ? 'bottom: 0; right: 0;' : '')}
`;

const EdgeRow = styled.div<{ $edge: 'top' | 'bottom' }>`
  position: absolute;
  ${(p) => (p.$edge === 'top' ? 'top: 8px;' : 'bottom: 8px;')}
  left: 40px;
  right: 40px;
  display: flex;
  justify-content: space-between;
  z-index: ${theme.z.rivets};

  @media (max-width: ${theme.breakpoints.md}) {
    left: 24px;
    right: 24px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    left: 16px;
    right: 16px;
  }
`;

// Reusable inner brass sub-panel (concave / engraved face).
export const ChassisPanel = styled.div`
  position: relative;
  background: ${theme.texture.brassDarker};
  background-blend-mode: multiply;
  border-radius: ${theme.radius.panel};
  box-shadow: ${theme.shadow.panelInset};
  padding: ${theme.space.base};

  /* Hairline engraved inset border. */
  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(0, 0, 0, 0.35);
    border-radius: 4px;
    pointer-events: none;
  }
`;

// Engraved display-font label sitting on a brass surface.
export const EngravedLabel = styled.span`
  font-family: ${theme.font.display};
  font-weight: 400;
  letter-spacing: ${theme.tracking.display};
  color: ${theme.color.text.onChassis};
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.5),
    0 -1px 0 rgba(212, 175, 55, 0.25);
`;

type Props = { children: ReactNode };

export function ChassisFrame({ children }: Props) {
  // Edge rivets — spaced every ~120px via flex justify-between on a fixed-width row.
  // Count tuned so they read as "every ~120px" on desktop.
  const edgeRivets = Array.from({ length: 9 });

  return (
    <Body>
      <Corners>
        <Corner $pos="tl" $size={10} />
        <Corner $pos="tr" $size={10} />
        <Corner $pos="bl" $size={10} />
        <Corner $pos="br" $size={10} />
      </Corners>
      <EdgeRow $edge="top">
        {edgeRivets.map((_, i) => (
          <Rivet key={`t${i}`} $size={6} />
        ))}
      </EdgeRow>
      <EdgeRow $edge="bottom">
        {edgeRivets.map((_, i) => (
          <Rivet key={`b${i}`} $size={6} />
        ))}
      </EdgeRow>
      {children}
    </Body>
  );
}

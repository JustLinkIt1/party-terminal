import styled from 'styled-components';
import { theme } from '../../theme';

// Engraved brass rule with a small central diamond — same visual vocabulary as
// the hero Filigree. Used between dark <Section> blocks to keep the page from
// reading as one continuous void.

const Wrap = styled.div`
  position: relative;
  width: min(720px, 80vw);
  height: 16px;
  margin: ${theme.space.loose} auto;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: 7px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(212, 175, 55, 0.45) 18%,
      rgba(212, 175, 55, 0.45) 82%,
      transparent 100%
    );
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.55);
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10px;
    height: 10px;
    transform: translate(-50%, -50%) rotate(45deg);
    background: linear-gradient(
      135deg,
      ${theme.color.chassis.brassBright} 0%,
      ${theme.color.chassis.brassBase} 60%,
      ${theme.color.chassis.brassDark} 100%
    );
    box-shadow:
      inset 0 1px 0 rgba(255, 220, 140, 0.5),
      0 1px 2px rgba(0, 0, 0, 0.55);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    width: min(320px, 70vw);
    margin: ${theme.space.base} auto;
  }
`;

export function SectionDivider() {
  return <Wrap aria-hidden />;
}

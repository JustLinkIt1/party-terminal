import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0px,
      rgba(0, 0, 0, 0) 2px,
      rgba(0, 0, 0, 0.18) 3px,
      rgba(0, 0, 0, 0) 4px
    );
  mix-blend-mode: multiply;

  @media (prefers-reduced-motion: reduce) {
    background:
      repeating-linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0px,
        rgba(0, 0, 0, 0) 3px,
        rgba(0, 0, 0, 0.08) 4px,
        rgba(0, 0, 0, 0) 5px
      );
  }
`;

const Vignette = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 49;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0) 40%,
    rgba(0, 0, 0, 0.65) 100%
  );
`;

export function ScanlineOverlay() {
  return (
    <>
      <Vignette />
      <Overlay />
    </>
  );
}

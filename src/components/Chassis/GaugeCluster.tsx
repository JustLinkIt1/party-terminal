import styled from 'styled-components';
import { theme } from '../../theme';

// Decorative brass gauge strip rendered from gauge-cluster.png. The previous
// implementation drew three live gauges in CSS+SVG; with the photographic
// reference now baked into the PNG, the realism is much higher but the
// needles are static. We keep the same props signature so the parent can
// still pass drift/signal/epoch — they're currently unused but reserved for
// a future SVG-needle overlay aligned to the PNG.

const Cluster = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.base};
  flex-shrink: 0;
  align-items: center;

  /* Hidden on mobile — free real estate is too valuable on small screens. */
  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const Plate = styled.div`
  width: 130px;
  aspect-ratio: 3 / 2;
  background: url('/assets/gauge-cluster.png') no-repeat center / contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
`;

type Props = {
  drift: number;
  signal: number;
  epoch: number;
};

export function GaugeCluster(_props: Props) {
  return (
    <Cluster aria-hidden>
      <Plate role="img" aria-label="Drift / Signal / Epoch gauges" />
    </Cluster>
  );
}

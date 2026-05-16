import styled from 'styled-components';
import { Section, SectionTitle, SectionLead } from '../ui/Section';
import { theme } from '../../theme';
import { config } from '../../config';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.space.snug};
  margin-top: ${theme.space.base};

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Stat = styled.div`
  position: relative;
  padding: ${theme.space.base};
  border-radius: ${theme.radius.panel};
  background: ${theme.texture.brassDarker};
  background-blend-mode: multiply;
  box-shadow: ${theme.shadow.panelInset};

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(212, 175, 55, 0.18);
    border-radius: 5px;
    pointer-events: none;
  }
`;

const Label = styled.div`
  color: ${theme.color.text.onChassisMuted};
  font-family: ${theme.font.display};
  font-size: 12px;
  letter-spacing: ${theme.tracking.display};
  text-transform: uppercase;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
`;

const Value = styled.div`
  color: ${theme.color.text.onChassis};
  font-family: ${theme.font.display};
  font-size: 24px;
  margin-top: ${theme.space.tight};
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.55);
  letter-spacing: 0.04em;
`;

const DexFrame = styled.div`
  margin-top: ${theme.space.loose};
  border-radius: ${theme.radius.panel};
  overflow: hidden;
  border: 2px solid ${theme.color.chassis.brassDark};
  background: ${theme.color.chassis.void};
  height: 400px;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }
`;

const Note = styled.p`
  margin-top: ${theme.space.loose};
  color: ${theme.color.text.onChassisMuted};
  font-size: 14px;
  line-height: 1.5;
`;

export function Tokenomics() {
  return (
    <Section>
      <SectionTitle>Tokenomics</SectionTitle>
      <SectionLead>Fair launch on pump.fun. No tax. No team allocation.</SectionLead>
      <Grid>
        <Stat>
          <Label>Supply</Label>
          <Value>1,000,000,000</Value>
        </Stat>
        <Stat>
          <Label>Buy / Sell tax</Label>
          <Value>0 / 0</Value>
        </Stat>
        <Stat>
          <Label>Liquidity</Label>
          <Value>Burned</Value>
        </Stat>
        <Stat>
          <Label>Team / VC</Label>
          <Value>None</Value>
        </Stat>
      </Grid>
      {config.liveOnDex && config.DEXSCREENER_PAIR && (
        <DexFrame>
          <iframe
            title="Dexscreener chart"
            src={`https://dexscreener.com/solana/${config.DEXSCREENER_PAIR}?embed=1&info=0&theme=dark`}
          />
        </DexFrame>
      )}
      <Note>
        Memecoins are gambling. Buy at your own risk. Nothing on this page is
        financial advice.
      </Note>
    </Section>
  );
}

import styled from 'styled-components';
import { Section, SectionTitle, SectionLead } from '../ui/Section';
import { theme } from '../../theme';
import { config } from '../../config';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.space(3)};
  margin-top: ${theme.space(4)};
  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Stat = styled.div`
  border: 1px solid ${theme.colors.border};
  padding: ${theme.space(4)};
  background: rgba(0, 12, 0, 0.4);
`;

const Label = styled.div`
  color: ${theme.colors.phosphorDim};
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Value = styled.div`
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.soft};
  font-size: 28px;
  margin-top: ${theme.space(2)};
`;

const DexFrame = styled.div`
  margin-top: ${theme.space(6)};
  border: 1px solid ${theme.colors.phosphorMuted};
  height: 400px;
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const Note = styled.p`
  margin-top: ${theme.space(4)};
  color: ${theme.colors.phosphorDim};
  font-size: 14px;
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

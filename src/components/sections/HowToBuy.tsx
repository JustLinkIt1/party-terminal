import styled from 'styled-components';
import { Section, SectionTitle } from '../ui/Section';
import { theme } from '../../theme';
import { config, isCaPlaceholder, pumpFunUrl } from '../../config';
import { BuyButton } from '../Chassis/BuyButton';

const Steps = styled.ol`
  list-style: none;
  padding: 0;
  margin: ${theme.space.base} 0 0 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.space.snug};
  counter-reset: step;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Step = styled.li`
  position: relative;
  padding: ${theme.space.base};
  background: ${theme.texture.brassDarker};
  background-blend-mode: multiply;
  border-radius: ${theme.radius.panel};
  box-shadow: ${theme.shadow.panelInset};
  counter-increment: step;

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(212, 175, 55, 0.18);
    border-radius: 5px;
    pointer-events: none;
  }
`;

const Num = styled.div`
  font-family: ${theme.font.display};
  font-size: 28px;
  color: ${theme.color.chassis.brassBright};
  letter-spacing: 0.06em;
  margin-bottom: ${theme.space.tight};
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.55);

  &::before {
    content: counter(step, decimal-leading-zero);
  }
`;

const StepTitle = styled.div`
  font-family: ${theme.font.display};
  font-size: 16px;
  letter-spacing: ${theme.tracking.display};
  text-transform: uppercase;
  color: ${theme.color.text.onChassis};
  margin-bottom: ${theme.space.tight};
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
`;

const StepBody = styled.div`
  color: ${theme.color.text.onChassis};
  font-size: 15px;
  line-height: 1.55;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${theme.space.loose};
`;

export function HowToBuy() {
  // We could re-skin the giant CTA with the chassis BuyButton; for the booklet
  // section we just reuse it inline so the bolted / armed treatment is
  // consistent across the page.
  void isCaPlaceholder;
  void pumpFunUrl;
  void config;

  return (
    <Section>
      <SectionTitle>How to buy</SectionTitle>
      <Steps>
        <Step>
          <Num />
          <StepTitle>Get a Solana wallet</StepTitle>
          <StepBody>
            Install <a href="https://phantom.com" target="_blank" rel="noopener noreferrer">Phantom</a>{' '}
            or any other Solana wallet you trust.
          </StepBody>
        </Step>
        <Step>
          <Num />
          <StepTitle>Fund it with SOL</StepTitle>
          <StepBody>
            Buy SOL on Coinbase, Binance, MEXC — anywhere, really — and send it
            to your wallet.
          </StepBody>
        </Step>
        <Step>
          <Num />
          <StepTitle>Open pump.fun</StepTitle>
          <StepBody>
            Use the button below or paste the contract address into pump.fun
            yourself. Always verify the CA — impostors are a problem.
          </StepBody>
        </Step>
        <Step>
          <Num />
          <StepTitle>Swap and hold</StepTitle>
          <StepBody>
            Decide your size. Slippage is automatic on pump.fun. The chart will
            do what charts do.
          </StepBody>
        </Step>
      </Steps>
      <Footer>
        <BuyButton />
      </Footer>
    </Section>
  );
}

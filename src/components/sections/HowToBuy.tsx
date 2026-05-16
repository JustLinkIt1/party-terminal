import styled from 'styled-components';
import { Section, SectionTitle } from '../ui/Section';
import { theme } from '../../theme';
import { config, isCaPlaceholder, pumpFunUrl } from '../../config';

const Steps = styled.ol`
  list-style: none;
  padding: 0;
  margin: ${theme.space(4)} 0 0 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.space(3)};
  counter-reset: step;

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Step = styled.li`
  border: 1px solid ${theme.colors.border};
  padding: ${theme.space(4)};
  background: rgba(0, 12, 0, 0.4);
  position: relative;
  counter-increment: step;

  &::before {
    content: counter(step, decimal-leading-zero);
    color: ${theme.colors.phosphor};
    text-shadow: ${theme.glow.soft};
    font-size: 28px;
    display: block;
    margin-bottom: ${theme.space(2)};
    font-family: ${theme.font.mono};
  }
`;

const StepTitle = styled.div`
  font-size: 18px;
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.soft};
  margin-bottom: ${theme.space(2)};
`;

const StepBody = styled.div`
  color: ${theme.colors.text};
  font-size: 16px;
  line-height: 1.4;
`;

const BuyCta = styled.a<{ $disabled?: boolean }>`
  display: inline-block;
  margin-top: ${theme.space(6)};
  padding: ${theme.space(3)} ${theme.space(5)};
  border: 1px solid ${theme.colors.phosphor};
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.soft};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 18px;
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
  &:hover {
    background: rgba(0, 255, 0, 0.1);
  }
`;

export function HowToBuy() {
  const placeholder = isCaPlaceholder(config.CA);
  return (
    <Section>
      <SectionTitle>How to buy</SectionTitle>
      <Steps>
        <Step>
          <StepTitle>Get a Solana wallet</StepTitle>
          <StepBody>
            Install <a href="https://phantom.com" target="_blank" rel="noopener noreferrer">Phantom</a>{' '}
            or any other Solana wallet you trust.
          </StepBody>
        </Step>
        <Step>
          <StepTitle>Fund it with SOL</StepTitle>
          <StepBody>
            Buy SOL on Coinbase, Binance, MEXC &mdash; anywhere, really &mdash;
            and send it to your wallet.
          </StepBody>
        </Step>
        <Step>
          <StepTitle>Open pump.fun</StepTitle>
          <StepBody>
            Use the button below or paste the contract address into pump.fun
            yourself. Always verify the CA &mdash; impostors are a problem.
          </StepBody>
        </Step>
        <Step>
          <StepTitle>Swap and hold</StepTitle>
          <StepBody>
            Decide your size. Slippage is automatic on pump.fun. The chart will
            do what charts do.
          </StepBody>
        </Step>
      </Steps>
      <BuyCta
        href={placeholder ? '#' : pumpFunUrl(config.CA)}
        target="_blank"
        rel="noopener noreferrer"
        $disabled={placeholder}
        aria-disabled={placeholder}
        onClick={(e) => {
          if (placeholder) e.preventDefault();
        }}
      >
        {placeholder ? 'Awaiting Deploy' : `Buy ${config.NAME} on pump.fun`}
      </BuyCta>
    </Section>
  );
}

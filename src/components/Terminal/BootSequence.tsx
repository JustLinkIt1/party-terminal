import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { screenBoot } from '../../styles/keyframes';

const Wrap = styled.div`
  font-family: ${theme.font.mono};
  color: ${theme.color.crt.phosphor};
  text-shadow: ${theme.glow.phosphorHot};
  padding: ${theme.space.loose} 0;
  animation: ${screenBoot} ${theme.motion.screenBoot.duration}
    ${theme.motion.screenBoot.easing};
  transform-origin: 50% 50%;
  font-size: 19px;
`;

const Line = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const STEPS = [
  '> POWERING ON THE TIME-RADIO...',
  '> WARMING THE CATHODE...',
  '> TUNING THE CARRIER...',
  '> SIGNAL ACQUIRED.',
];
const STEP_MS = 220;

type Props = { onDone: () => void };

export function BootSequence({ onDone }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STEPS.length) {
      const t = setTimeout(onDone, 200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [step, onDone]);

  return (
    <Wrap aria-hidden>
      {STEPS.slice(0, step).map((line, i) => (
        <Line key={i}>{line}</Line>
      ))}
    </Wrap>
  );
}

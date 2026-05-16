import { useState } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './theme';
import { config } from './config';
import { TopBar } from './components/TopBar';
import { Terminal } from './components/Terminal/Terminal';
import { useChat } from './components/Terminal/useChat';
import { ScanlineOverlay } from './components/ScanlineOverlay';
import { Toast } from './components/Toast';
import { Lore } from './components/sections/Lore';
import { SampleDispatches } from './components/sections/SampleDispatches';
import { Tokenomics } from './components/sections/Tokenomics';
import { HowToBuy } from './components/sections/HowToBuy';
import { Roadmap } from './components/sections/Roadmap';
import { Footer } from './components/sections/Footer';

const Hero = styled.div`
  padding: ${theme.space(8)} ${theme.space(4)} ${theme.space(4)};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${theme.space(4)};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.space(6)} ${theme.space(2)} ${theme.space(2)};
  }
`;

const Tagline = styled.h1`
  margin: 0;
  font-size: clamp(28px, 5vw, 48px);
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.strong};
  letter-spacing: 0.05em;
  font-weight: normal;
  max-width: 24ch;
  line-height: 1.2;
  text-transform: uppercase;
`;

const Sub = styled.p`
  margin: 0;
  color: ${theme.colors.phosphorDim};
  font-size: 18px;
  max-width: 50ch;
  line-height: 1.5;
`;

function App() {
  const chat = useChat(config.DEFAULT_DATE);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <>
      <GlobalStyle />
      <ScanlineOverlay />
      <TopBar onCopy={setToast} />
      <Hero>
        <Tagline>{config.TAGLINE}</Tagline>
        <Sub>
          A terminal that calls people in the past. Turn the dial. Pick a day.
          See who picks up.
        </Sub>
      </Hero>
      <Terminal
        date={chat.state.date}
        persona={chat.state.persona}
        messages={chat.state.messages}
        status={chat.state.status}
        error={chat.state.error}
        onDateChange={chat.setDate}
        onReroll={chat.reroll}
        onSend={chat.send}
      />
      <Lore />
      <SampleDispatches onPickDate={chat.setDate} />
      <Tokenomics />
      <HowToBuy />
      <Roadmap />
      <Footer onCopy={setToast} />
      <Toast message={toast} onClear={() => setToast(null)} />
    </>
  );
}

export default App;

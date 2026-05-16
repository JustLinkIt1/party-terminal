import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './theme';
import { config } from './config';
import { ChassisFrame } from './components/Chassis/ChassisFrame';
import { NameplatePanel } from './components/Chassis/NameplatePanel';
import { PresetChipRow } from './components/Chassis/PresetChipRow';
import { NewPersonLever } from './components/Chassis/NewPersonLever';
import { GaugeCluster } from './components/Chassis/GaugeCluster';
import { IndicatorLamp, LampRow } from './components/Chassis/IndicatorLamp';
import { DialAssembly } from './components/Dial/DialAssembly';
import { Terminal } from './components/Terminal/Terminal';
import { useChat } from './components/Terminal/useChat';
import { Toast } from './components/Toast';
import { Lore } from './components/sections/Lore';
import { SampleDispatches } from './components/sections/SampleDispatches';
import { Tokenomics } from './components/sections/Tokenomics';
import { HowToBuy } from './components/sections/HowToBuy';
import { Roadmap } from './components/sections/Roadmap';
import { Footer } from './components/sections/Footer';

const Hero = styled.div`
  padding: ${theme.space.loose} 0 ${theme.space.base};
  text-align: center;
`;

const Tagline = styled.h2`
  font-family: ${theme.font.display};
  font-weight: 400;
  letter-spacing: ${theme.tracking.display};
  font-size: clamp(22px, 4vw, 36px);
  color: ${theme.color.text.onChassis};
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.6),
    0 -1px 0 rgba(212, 175, 55, 0.3);
  text-transform: uppercase;
  margin: 0 auto;
  max-width: 24ch;
  line-height: 1.25;
`;

const HeroLead = styled.p`
  font-family: ${theme.font.body};
  color: ${theme.color.text.onChassisMuted};
  font-size: 16px;
  line-height: 1.55;
  max-width: 56ch;
  margin: ${theme.space.snug} auto 0;
`;

// MachineBlock: dial up top, then a row with [gauges | screen | lever], then lamps.
const MachineBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.base};
  padding: ${theme.space.base} 0;
`;

const DialRail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.space.base};
`;

const ScreenRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${theme.space.base};
  align-items: stretch;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ScreenColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const LampStrip = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.space.snug} ${theme.space.base};
  border-radius: ${theme.radius.panel};
  background: ${theme.texture.brassDarker};
  background-blend-mode: multiply;
  box-shadow: ${theme.shadow.panelInset};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(212, 175, 55, 0.18);
    border-radius: 5px;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    flex-wrap: wrap;
    gap: ${theme.space.snug};
    padding: ${theme.space.snug};
  }
`;

const MIN_YEAR = parseInt(config.MIN_DATE.slice(0, 4), 10);
const MAX_YEAR = new Date().getFullYear();

function App() {
  const chat = useChat(config.DEFAULT_DATE);
  const [toast, setToast] = useState<string | null>(null);

  const gauges = useMemo(() => {
    const drift = Math.min(1, chat.state.messages.length / 40);
    const signal =
      chat.state.status === 'idle'
        ? 0.95
        : chat.state.status === 'sending'
          ? 0.6
          : chat.state.status === 'booting'
            ? 0.2
            : 0.05;
    const year = parseInt(chat.state.date.slice(0, 4), 10);
    const epoch = Math.min(1, Math.max(0, (year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)));
    return { drift, signal, epoch };
  }, [chat.state.messages.length, chat.state.status, chat.state.date]);

  const lamps = useMemo(() => {
    return {
      power: true,
      transmit: chat.state.status === 'sending' || chat.state.status === 'booting',
      fault: chat.state.status === 'error',
    };
  }, [chat.state.status]);

  return (
    <>
      <GlobalStyle />
      <ChassisFrame>
        <NameplatePanel onCopy={setToast} />
        <Hero>
          <Tagline>{config.TAGLINE}</Tagline>
          <HeroLead>
            A Victorian chronograph wired to a phosphor CRT. Turn the dial. Pick
            a day. See who picks up.
          </HeroLead>
        </Hero>

        <MachineBlock aria-label="Time-dial machine">
          <DialRail>
            <DialAssembly
              date={chat.state.date}
              disabled={chat.state.status === 'sending'}
              onDateChange={chat.setDate}
            />
            <PresetChipRow
              date={chat.state.date}
              disabled={chat.state.status === 'sending'}
              onPick={chat.setDate}
            />
          </DialRail>

          <ScreenRow>
            <GaugeCluster
              drift={gauges.drift}
              signal={gauges.signal}
              epoch={gauges.epoch}
            />
            <ScreenColumn>
              <Terminal
                key={chat.state.sessionId}
                persona={chat.state.persona}
                messages={chat.state.messages}
                status={chat.state.status}
                error={chat.state.error}
                onSend={chat.send}
              />
            </ScreenColumn>
            <NewPersonLever
              disabled={chat.state.status === 'sending' || chat.state.status === 'booting'}
              onPull={chat.reroll}
            />
          </ScreenRow>

          <LampStrip aria-label="Machine status">
            <LampRow>
              <IndicatorLamp color="power" lit={lamps.power} label="Power" />
              <IndicatorLamp color="transmit" lit={lamps.transmit} label="Transmit" />
              <IndicatorLamp color="fault" lit={lamps.fault} label="Fault" />
            </LampRow>
          </LampStrip>
        </MachineBlock>
      </ChassisFrame>

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

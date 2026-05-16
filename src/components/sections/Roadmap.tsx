import styled from 'styled-components';
import { Section, SectionTitle } from '../ui/Section';
import { theme } from '../../theme';

const List = styled.ol`
  list-style: none;
  padding: 0;
  margin: ${theme.space(4)} 0 0 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.space(3)};
`;

const Phase = styled.li`
  border-left: 2px solid ${theme.colors.phosphorMuted};
  padding: ${theme.space(2)} ${theme.space(4)};
`;

const Tag = styled.div`
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.soft};
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;

const Desc = styled.div`
  color: ${theme.colors.text};
  font-size: 18px;
  margin-top: ${theme.space(1)};
  line-height: 1.5;
`;

const PHASES = [
  { tag: 'Phase 01 — Tune In', desc: 'Launch on pump.fun. Open the line. Watch who picks up.' },
  { tag: 'Phase 02 — Broadcast', desc: 'Listings, partnerships with other AI-character coins, viral dispatches from notable dates.' },
  { tag: 'Phase 03 — Rewire History', desc: 'Multiplayer rooms. Group calls. Two dial settings at once.' },
];

export function Roadmap() {
  return (
    <Section>
      <SectionTitle>Roadmap</SectionTitle>
      <List>
        {PHASES.map((p) => (
          <Phase key={p.tag}>
            <Tag>{p.tag}</Tag>
            <Desc>{p.desc}</Desc>
          </Phase>
        ))}
      </List>
    </Section>
  );
}

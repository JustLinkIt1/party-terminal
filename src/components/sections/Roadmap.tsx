import styled from 'styled-components';
import { Section, SectionTitle } from '../ui/Section';
import { theme } from '../../theme';
import { Rivet } from '../Chassis/Rivet';

const List = styled.ol`
  list-style: none;
  padding: 0;
  margin: ${theme.space.base} 0 0 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.space.snug};
`;

const Phase = styled.li<{ $future?: boolean }>`
  position: relative;
  padding: ${theme.space.base} ${theme.space.loose};
  background: ${theme.texture.brassDarker};
  background-blend-mode: multiply;
  border-radius: ${theme.radius.panel};
  box-shadow: ${theme.shadow.panelInset};
  opacity: ${(p) => (p.$future ? 0.85 : 1)};

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(212, 175, 55, 0.18);
    border-radius: 5px;
    pointer-events: none;
  }
`;

const RivetCorner = styled(Rivet)<{ $corner: 'tl' | 'tr' }>`
  position: absolute;
  top: 6px;
  ${(p) => (p.$corner === 'tl' ? 'left: 6px;' : 'right: 6px;')}
`;

const Tag = styled.div<{ $future?: boolean }>`
  font-family: ${theme.font.display};
  font-size: 13px;
  letter-spacing: ${theme.tracking.display};
  text-transform: uppercase;
  color: ${(p) =>
    p.$future ? theme.color.chassis.brassBright : theme.color.text.onChassis};
  text-shadow: ${(p) =>
    p.$future ? theme.glow.brassWarm : '0 1px 0 rgba(0, 0, 0, 0.55)'};
`;

const Desc = styled.div`
  color: ${theme.color.text.onChassis};
  font-size: 16px;
  margin-top: ${theme.space.tight};
  line-height: 1.55;
`;

const PHASES = [
  {
    tag: 'Phase 01 — Tune In',
    desc: 'Launch on pump.fun. Open the line. Watch who picks up.',
  },
  {
    tag: 'Phase 02 — Broadcast',
    desc: 'Listings, partnerships with other AI-character coins, viral dispatches from notable dates.',
  },
  {
    tag: 'Phase 03 — Rewire History',
    desc: 'Multiplayer rooms. Group calls. Two dial settings at once.',
    future: true,
  },
];

export function Roadmap() {
  return (
    <Section>
      <SectionTitle>Roadmap</SectionTitle>
      <List>
        {PHASES.map((p) => (
          <Phase key={p.tag} $future={p.future}>
            <RivetCorner $corner="tl" $size={5} />
            <RivetCorner $corner="tr" $size={5} />
            <Tag $future={p.future}>{p.tag}</Tag>
            <Desc>{p.desc}</Desc>
          </Phase>
        ))}
      </List>
    </Section>
  );
}

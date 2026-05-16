import styled from 'styled-components';
import { Section, SectionTitle, SectionLead } from '../ui/Section';
import { theme } from '../../theme';
import { formatDateForDisplay } from '../../lib/format';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.space.snug};
  margin-top: ${theme.space.base};

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.button`
  position: relative;
  text-align: left;
  padding: ${theme.space.loose} ${theme.space.base} ${theme.space.base};
  border-radius: ${theme.radius.panel};
  background: ${theme.texture.brassDarker};
  background-blend-mode: multiply;
  box-shadow: ${theme.shadow.panelInset};
  display: flex;
  flex-direction: column;
  gap: ${theme.space.snug};
  cursor: pointer;
  font-family: ${theme.font.body};
  color: ${theme.color.text.onChassis};
  transition: transform 220ms ${theme.motion.overshoot},
    box-shadow 220ms ${theme.motion.overshoot},
    filter 220ms ease;

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(212, 175, 55, 0.22);
    border-radius: 5px;
    pointer-events: none;
  }

  /* Engraved top-rule with central diamond — same language as Hero filigree. */
  &::after {
    content: '';
    position: absolute;
    top: 14px;
    left: ${theme.space.base};
    right: ${theme.space.base};
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(212, 175, 55, 0.45) 20%,
      rgba(212, 175, 55, 0.45) 80%,
      transparent 100%
    );
  }

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.08);
    box-shadow:
      ${theme.shadow.panelInset},
      0 6px 18px rgba(0, 0, 0, 0.55),
      ${theme.glow.brassWarm};
  }

  &:focus-visible {
    outline: 1px solid ${theme.color.chassis.brassBright};
    outline-offset: 3px;
  }
`;

// A small phosphor "dateline" tag pulled up over the top rule. Reads like the
// stencil station-ident on the persona plate — same family, different scale.
const DateTag = styled.div`
  position: absolute;
  top: 7px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px ${theme.space.tight};
  background: ${theme.color.crt.screen};
  font-family: ${theme.font.mono};
  font-size: 11px;
  letter-spacing: 0.22em;
  color: ${theme.color.crt.phosphor};
  text-shadow: ${theme.glow.phosphorSoft};
  text-transform: uppercase;
  white-space: nowrap;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
`;

const Headline = styled.div`
  font-family: ${theme.font.display};
  font-size: 18px;
  line-height: 1.3;
  letter-spacing: 0.04em;
  color: ${theme.color.text.onChassis};
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.55),
    0 -1px 0 rgba(212, 175, 55, 0.12);
`;

const Quote = styled.div`
  color: ${theme.color.text.onChassisMuted};
  font-style: italic;
  font-size: 14px;
  line-height: 1.55;
  border-left: 2px solid ${theme.color.chassis.brassBase};
  padding-left: ${theme.space.snug};
  position: relative;

  &::before {
    content: '"';
    position: absolute;
    left: ${theme.space.snug};
    top: -10px;
    font-family: ${theme.font.display};
    font-size: 38px;
    line-height: 1;
    color: ${theme.color.chassis.brassBright};
    opacity: 0.55;
    pointer-events: none;
  }
`;

const DISPATCHES = [
  {
    date: '1969-07-21',
    headline: 'The morning after the moon landing',
    quote: '"We sat up till four watching the static. My boy says he wants to be one."',
  },
  {
    date: '2001-09-12',
    headline: 'The day after',
    quote: '"They told us to stay home. The sky is empty. There are no planes."',
  },
  {
    date: '1963-11-23',
    headline: 'The day after Dallas',
    quote: '"Every flag on this block is half-mast. Nobody knows what to say."',
  },
  {
    date: '1989-11-10',
    headline: 'The morning after the Wall',
    quote: '"My brother walked across last night. He keeps laughing about it like a kid."',
  },
  {
    date: '1912-04-16',
    headline: 'The morning the wires brought the news',
    quote: '"The papers say twelve hundred souls. My aunt is on the manifest."',
  },
  {
    date: '1929-10-25',
    headline: 'The Friday after Black Thursday',
    quote: '"My boss told us to come in like normal. Half the office didn\'t."',
  },
];

type Props = {
  onPickDate: (iso: string) => void;
};

export function SampleDispatches({ onPickDate }: Props) {
  return (
    <Section>
      <SectionTitle>Try a famous day</SectionTitle>
      <SectionLead>Or turn the dial yourself. Any day, 1500 to now.</SectionLead>
      <Grid>
        {DISPATCHES.map((d) => (
          <Card
            key={d.date}
            type="button"
            onClick={() => {
              onPickDate(d.date);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label={`Talk to someone on ${formatDateForDisplay(d.date)} — ${d.headline}`}
          >
            <DateTag aria-hidden>{formatDateForDisplay(d.date)}</DateTag>
            <Headline>{d.headline}</Headline>
            <Quote>{d.quote}</Quote>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}

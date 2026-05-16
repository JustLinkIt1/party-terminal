import styled from 'styled-components';
import { Section, SectionTitle, SectionLead } from '../ui/Section';
import { theme } from '../../theme';
import { formatDateForDisplay } from '../../lib/format';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.space(3)};
  margin-top: ${theme.space(4)};

  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.button`
  text-align: left;
  padding: ${theme.space(4)};
  border: 1px solid ${theme.colors.border};
  background: rgba(0, 12, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: ${theme.space(2)};
  cursor: pointer;
  font-size: 16px;
  text-transform: none;
  letter-spacing: normal;
  transition: border-color 0.15s ease, background 0.15s ease;
  &:hover {
    border-color: ${theme.colors.phosphor};
    background: rgba(0, 30, 0, 0.5);
  }
`;

const Date_ = styled.div`
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.soft};
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Headline = styled.div`
  color: ${theme.colors.text};
  font-size: 18px;
  line-height: 1.4;
`;

const Quote = styled.div`
  color: ${theme.colors.phosphorDim};
  font-style: italic;
  font-size: 15px;
  line-height: 1.4;
  border-left: 2px solid ${theme.colors.border};
  padding-left: ${theme.space(2)};
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
      <SectionLead>
        Or turn the dial yourself. Any day, 1500 to now.
      </SectionLead>
      <Grid>
        {DISPATCHES.map((d) => (
          <Card
            key={d.date}
            type="button"
            onClick={() => {
              onPickDate(d.date);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Date_>{formatDateForDisplay(d.date)}</Date_>
            <Headline>{d.headline}</Headline>
            <Quote>{d.quote}</Quote>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}

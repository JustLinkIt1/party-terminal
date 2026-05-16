import styled from 'styled-components';
import { Section, SectionTitle } from '../ui/Section';
import { theme } from '../../theme';

const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.space(6)};
  margin-top: ${theme.space(4)};

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const P = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin: 0;
  color: ${theme.colors.text};
`;

const Em = styled.span`
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.soft};
`;

export function Lore() {
  return (
    <Section>
      <SectionTitle>What this is</SectionTitle>
      <Body>
        <P>
          A terminal that calls people in the past. Turn the dial to any date.
          On the other end of the line is a stranger from that day &mdash;{' '}
          <Em>not a famous one</Em>, not a chatbot pretending to be one. A baker
          in Vienna on the morning of June 29, 1914. A clerk in Brooklyn on
          October 25, 1929. A teacher in Dallas on November 23, 1963. Whoever
          picks up.
        </P>
        <P>
          They know what their world knows. Yesterday's headlines, today's
          weather, the song on the radio, what their cousin said at supper.
          They do not know what comes next. They are not&nbsp;sure who you are.
          Ask them anything you'd ask a stranger on the phone. They might tell
          you the truth, or change the subject, or hang up. They are a person.
        </P>
      </Body>
    </Section>
  );
}

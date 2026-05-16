import styled from 'styled-components';
import { theme } from '../../theme';

export const Section = styled.section`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: ${theme.space(12)} ${theme.space(4)};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.space(8)} ${theme.space(4)};
  }
`;

export const SectionTitle = styled.h2`
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.text};
  font-size: 32px;
  margin: 0 0 ${theme.space(4)} 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: normal;
  border-left: 3px solid ${theme.colors.phosphor};
  padding-left: ${theme.space(3)};
`;

export const SectionLead = styled.p`
  color: ${theme.colors.text};
  font-size: 20px;
  line-height: 1.5;
  max-width: 60ch;
  margin: 0 0 ${theme.space(4)} 0;
`;

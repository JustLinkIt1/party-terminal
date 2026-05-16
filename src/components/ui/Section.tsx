import styled from 'styled-components';
import { theme } from '../../theme';

// Sections live below the chassis. They feel like the instruction booklet
// shipped with the machine — printed paper, not part of the apparatus.

export const Section = styled.section`
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: ${theme.space.panel} ${theme.space.loose};
  color: ${theme.color.text.onChassis};
  font-family: ${theme.font.body};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.space.loose} ${theme.space.base};
  }
`;

export const SectionTitle = styled.h2`
  color: ${theme.color.text.onChassis};
  font-family: ${theme.font.display};
  font-weight: 400;
  letter-spacing: ${theme.tracking.display};
  font-size: 28px;
  margin: 0 0 ${theme.space.base} 0;
  text-transform: uppercase;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  position: relative;
  padding-left: ${theme.space.base};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 3px;
    background: linear-gradient(180deg, ${theme.color.chassis.brassBright} 0%, ${theme.color.chassis.brassBase} 100%);
    border-radius: 2px;
    box-shadow: 0 0 6px rgba(212, 175, 55, 0.35);
  }
`;

export const SectionLead = styled.p`
  color: ${theme.color.text.onChassisMuted};
  font-size: 18px;
  line-height: 1.6;
  max-width: 60ch;
  margin: 0 0 ${theme.space.loose} 0;
`;

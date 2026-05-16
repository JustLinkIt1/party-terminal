import styled from 'styled-components';
import { theme } from '../../theme';

const Chip = styled.div`
  padding: ${theme.space(1)} ${theme.space(2)};
  font-size: 14px;
  color: ${theme.colors.phosphorDim};
  border-bottom: 1px solid ${theme.colors.border};
  text-shadow: none;
  display: flex;
  gap: ${theme.space(2)};
  align-items: center;
`;

const Tag = styled.span`
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.soft};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 12px;
`;

const Body = styled.span`
  color: ${theme.colors.text};
  text-shadow: ${theme.glow.soft};
`;

type Props = { persona: string | null };

export function PersonaChip({ persona }: Props) {
  return (
    <Chip>
      <Tag>Now talking to</Tag>
      <Body>{persona ?? '…'}</Body>
    </Chip>
  );
}

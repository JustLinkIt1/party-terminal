import styled from 'styled-components';
import { theme } from '../../theme';

const Chip = styled.div`
  padding: ${theme.space.tight} 0 ${theme.space.snug};
  border-bottom: 1px dashed rgba(91, 255, 138, 0.18);
  display: flex;
  gap: ${theme.space.snug};
  align-items: baseline;
  font-family: ${theme.font.mono};
  margin-bottom: ${theme.space.snug};
`;

const Tag = styled.span`
  color: ${theme.color.crt.phosphorDim};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 12px;
  text-shadow: ${theme.glow.phosphorSoft};
`;

const Body = styled.span`
  color: ${theme.color.text.onScreen};
  text-shadow: ${theme.glow.phosphorHot};
  font-size: 17px;
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

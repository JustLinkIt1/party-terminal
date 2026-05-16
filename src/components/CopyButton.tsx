import styled from 'styled-components';
import { theme } from '../theme';
import { copyToClipboard } from '../lib/copy';

const Btn = styled.button`
  font-family: ${theme.font.display};
  letter-spacing: ${theme.tracking.display};
  font-size: 11px;
  text-transform: uppercase;
  padding: 4px ${theme.space.snug};
  border-radius: ${theme.radius.button};
  background: ${theme.texture.brass};
  background-blend-mode: overlay, normal;
  color: ${theme.color.text.onChassis};
  box-shadow: ${theme.shadow.buttonResting};
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  cursor: pointer;
  min-height: 26px;
  transition:
    transform 60ms ease-out,
    box-shadow 60ms ease-out;

  &:hover {
    box-shadow: ${theme.shadow.buttonResting}, ${theme.glow.brassWarm};
  }
  &:active {
    transform: translateY(1px);
    box-shadow: ${theme.shadow.buttonPressed};
  }
`;

type Props = {
  value: string;
  label?: string;
  onCopied?: (ok: boolean) => void;
};

export function CopyButton({ value, label = 'Copy', onCopied }: Props) {
  return (
    <Btn
      type="button"
      onClick={async () => {
        const ok = await copyToClipboard(value);
        onCopied?.(ok);
      }}
      aria-label={`Copy ${value}`}
    >
      {label}
    </Btn>
  );
}

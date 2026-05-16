import styled from 'styled-components';
import { theme } from '../theme';
import { copyToClipboard } from '../lib/copy';

const Btn = styled.button`
  font-size: 12px;
  padding: 2px ${theme.space(2)};
  text-transform: uppercase;
  letter-spacing: 0.1em;
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
    >
      {label}
    </Btn>
  );
}

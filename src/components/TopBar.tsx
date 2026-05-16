import styled from 'styled-components';
import { theme } from '../theme';
import { config, isCaPlaceholder, pumpFunUrl } from '../config';
import { truncateCa } from '../lib/format';
import { CopyButton } from './CopyButton';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: ${theme.space(3)};
  padding: ${theme.space(2)} ${theme.space(4)};
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  border-bottom: 1px solid ${theme.colors.phosphorMuted};
  font-size: 14px;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.space(2)};
    gap: ${theme.space(2)};
    flex-wrap: wrap;
  }
`;

const Brand = styled.div`
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.text};
  font-size: 18px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const CaBlock = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space(2)};
  margin-left: auto;
  color: ${theme.colors.phosphorDim};

  @media (max-width: ${theme.breakpoints.sm}) {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
    order: 3;
  }
`;

const Mono = styled.span`
  font-family: ${theme.font.mono};
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.soft};
`;

const BuyBtn = styled.a<{ $disabled?: boolean }>`
  text-decoration: none;
  display: inline-block;
  padding: ${theme.space(1)} ${theme.space(3)};
  border: 1px solid ${theme.colors.phosphor};
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.soft};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 13px;
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
  transition: background 0.15s ease;
  &:hover {
    background: rgba(0, 255, 0, 0.1);
  }
`;

type Props = {
  onCopy?: (msg: string) => void;
};

export function TopBar({ onCopy }: Props) {
  const placeholder = isCaPlaceholder(config.CA);
  return (
    <Bar>
      <Brand>{config.NAME}</Brand>
      <CaBlock>
        <span>CA:</span>
        <Mono>{placeholder ? 'AWAITING DEPLOY' : truncateCa(config.CA)}</Mono>
        {!placeholder && (
          <CopyButton
            value={config.CA}
            onCopied={(ok) => onCopy?.(ok ? 'CONTRACT COPIED' : 'COPY FAILED')}
          />
        )}
        <BuyBtn
          href={placeholder ? '#' : pumpFunUrl(config.CA)}
          target="_blank"
          rel="noopener noreferrer"
          $disabled={placeholder}
          aria-disabled={placeholder}
          onClick={(e) => {
            if (placeholder) e.preventDefault();
          }}
        >
          {placeholder ? 'Awaiting Deploy' : 'Buy on pump.fun'}
        </BuyBtn>
      </CaBlock>
    </Bar>
  );
}

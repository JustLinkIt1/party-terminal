import styled from 'styled-components';
import { theme } from '../../theme';
import { config, isCaPlaceholder } from '../../config';
import { truncateCa } from '../../lib/format';
import { CopyButton } from '../CopyButton';
import { BuyButton } from './BuyButton';
import { Rivet } from './Rivet';

const Plate = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${theme.space.base};
  padding: ${theme.space.base} ${theme.space.loose};
  border-radius: ${theme.radius.panel};
  background: ${theme.texture.brassDarker};
  background-blend-mode: multiply;
  box-shadow: ${theme.shadow.panelInset};
  margin-bottom: ${theme.space.base};

  &::before {
    content: '';
    position: absolute;
    inset: 6px;
    border: 1px solid rgba(212, 175, 55, 0.22);
    border-radius: 6px;
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
    padding: ${theme.space.snug} ${theme.space.base};
    gap: ${theme.space.snug};
  }
`;

const Corner = styled(Rivet)<{ $pos: 'tl' | 'tr' | 'bl' | 'br' }>`
  position: absolute;
  ${(p) => (p.$pos === 'tl' ? 'top: 4px; left: 4px;' : '')}
  ${(p) => (p.$pos === 'tr' ? 'top: 4px; right: 4px;' : '')}
  ${(p) => (p.$pos === 'bl' ? 'bottom: 4px; left: 4px;' : '')}
  ${(p) => (p.$pos === 'br' ? 'bottom: 4px; right: 4px;' : '')}
`;

const Wordmark = styled.h1`
  font-family: ${theme.font.display};
  font-weight: 400;
  letter-spacing: 0.14em;
  font-size: 30px;
  margin: 0;
  color: ${theme.color.text.onChassis};
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.65),
    0 -1px 0 rgba(212, 175, 55, 0.35);
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 22px;
    text-align: center;
  }
`;

const Spacer = styled.div`
  flex: 1;
  min-width: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const CaBlock = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.snug};
  font-family: ${theme.font.display};
  letter-spacing: ${theme.tracking.display};
  font-size: 13px;
  color: ${theme.color.text.onChassisMuted};
  text-transform: uppercase;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);

  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    gap: ${theme.space.tight};
    font-size: 12px;

    & > a {
      flex: 1 1 100%;
      justify-content: center;
      margin-top: ${theme.space.tight};
    }
  }
`;

const Ca = styled.span`
  font-family: ${theme.font.mono};
  font-size: 15px;
  color: ${theme.color.crt.phosphor};
  text-shadow: ${theme.glow.phosphorSoft};
  background: ${theme.color.crt.screen};
  padding: 2px ${theme.space.tight};
  border-radius: 3px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.7);
  letter-spacing: 0;
`;

type Props = {
  onCopy?: (msg: string) => void;
};

export function NameplatePanel({ onCopy }: Props) {
  const placeholder = isCaPlaceholder(config.CA);
  return (
    <Plate>
      <Corner $pos="tl" $size={7} />
      <Corner $pos="tr" $size={7} />
      <Corner $pos="bl" $size={7} />
      <Corner $pos="br" $size={7} />
      <Wordmark>{config.NAME}</Wordmark>
      <Spacer />
      <CaBlock>
        <span>CA</span>
        <Ca>{placeholder ? 'AWAITING DEPLOY' : truncateCa(config.CA)}</Ca>
        {!placeholder && (
          <CopyButton
            value={config.CA}
            onCopied={(ok) => onCopy?.(ok ? 'CONTRACT COPIED' : 'COPY FAILED')}
          />
        )}
        <BuyButton />
      </CaBlock>
    </Plate>
  );
}

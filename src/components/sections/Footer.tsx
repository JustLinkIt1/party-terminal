import styled from 'styled-components';
import { theme } from '../../theme';
import { config, isCaPlaceholder } from '../../config';
import { truncateCa } from '../../lib/format';
import { CopyButton } from '../CopyButton';

const FooterWrap = styled.footer`
  border-top: 1px solid ${theme.colors.phosphorMuted};
  margin-top: ${theme.space(8)};
  padding: ${theme.space(8)} ${theme.space(4)};
  display: flex;
  flex-direction: column;
  gap: ${theme.space(4)};
  align-items: center;
  text-align: center;
  color: ${theme.colors.phosphorDim};
  font-size: 14px;
`;

const Brand = styled.div`
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.text};
  font-size: 22px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
`;

const Links = styled.div`
  display: flex;
  gap: ${theme.space(5)};
  flex-wrap: wrap;
  justify-content: center;
`;

const Link = styled.a`
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.soft};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 14px;
`;

const CaRow = styled.div`
  display: flex;
  gap: ${theme.space(2)};
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
`;

const Mono = styled.span`
  font-family: ${theme.font.mono};
  color: ${theme.colors.phosphor};
  text-shadow: ${theme.glow.soft};
`;

const Disclaimer = styled.div`
  max-width: 60ch;
  line-height: 1.5;
`;

type Props = { onCopy?: (msg: string) => void };

export function Footer({ onCopy }: Props) {
  const placeholder = isCaPlaceholder(config.CA);
  return (
    <FooterWrap>
      <Brand>{config.NAME}</Brand>
      <Links>
        <Link href={config.X_URL} target="_blank" rel="noopener noreferrer">X / Twitter</Link>
        <Link href={config.TG_URL} target="_blank" rel="noopener noreferrer">Telegram</Link>
        <Link href="https://pump.fun" target="_blank" rel="noopener noreferrer">pump.fun</Link>
      </Links>
      <CaRow>
        <span>CA:</span>
        <Mono>{placeholder ? 'AWAITING DEPLOY' : truncateCa(config.CA)}</Mono>
        {!placeholder && (
          <CopyButton
            value={config.CA}
            onCopied={(ok) => onCopy?.(ok ? 'CONTRACT COPIED' : 'COPY FAILED')}
          />
        )}
      </CaRow>
      <Disclaimer>
        Not financial advice. Memecoins are gambling. The people on the other
        end of the line are imagined &mdash; large language models acting as
        ordinary historical persons &mdash; not historical record. Do your own
        research, and ride at your own risk.
      </Disclaimer>
    </FooterWrap>
  );
}

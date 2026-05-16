import styled from 'styled-components';
import { theme } from '../../theme';
import { config, isCaPlaceholder } from '../../config';
import { truncateCa } from '../../lib/format';
import { CopyButton } from '../CopyButton';

const FooterWrap = styled.footer`
  border-top: 1px solid rgba(212, 175, 55, 0.18);
  margin-top: ${theme.space.loose};
  padding: ${theme.space.panel} ${theme.space.base};
  display: flex;
  flex-direction: column;
  gap: ${theme.space.base};
  align-items: center;
  text-align: center;
  font-family: ${theme.font.body};
  color: ${theme.color.text.onChassisMuted};
  font-size: 14px;
  line-height: 1.6;
`;

const Brand = styled.div`
  font-family: ${theme.font.display};
  font-size: 22px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${theme.color.text.onChassis};
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.55);
`;

const Links = styled.div`
  display: flex;
  gap: ${theme.space.loose};
  flex-wrap: wrap;
  justify-content: center;
`;

const Link = styled.a`
  font-family: ${theme.font.display};
  letter-spacing: ${theme.tracking.display};
  text-transform: uppercase;
  font-size: 13px;
  color: ${theme.color.chassis.brassBright};
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  padding: 12px 14px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  border-bottom: 1px solid rgba(212, 175, 55, 0);
  transition: border-color 160ms ease, color 160ms ease;

  &:hover {
    border-bottom-color: rgba(212, 175, 55, 0.55);
    color: ${theme.color.chassis.brassBright};
  }
`;

const CaRow = styled.div`
  display: flex;
  gap: ${theme.space.tight};
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  font-family: ${theme.font.display};
  letter-spacing: ${theme.tracking.display};
  text-transform: uppercase;
  font-size: 12px;
`;

const Mono = styled.span`
  font-family: ${theme.font.mono};
  color: ${theme.color.crt.phosphor};
  text-shadow: ${theme.glow.phosphorSoft};
  background: ${theme.color.crt.screen};
  padding: 2px ${theme.space.tight};
  border-radius: 3px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.7);
  letter-spacing: 0;
`;

const Disclaimer = styled.div`
  max-width: 60ch;
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
        <span>CA</span>
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
        end of the line are imagined — large language models acting as ordinary
        historical persons — not historical record. Do your own research, and
        ride at your own risk.
      </Disclaimer>
    </FooterWrap>
  );
}

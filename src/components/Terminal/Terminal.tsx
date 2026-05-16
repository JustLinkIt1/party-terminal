import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { TimeDial } from './TimeDial';
import { PersonaChip } from './PersonaChip';
import { MessageLog } from './MessageLog';
import { PromptInput } from './Prompt';
import { BootSequence } from './BootSequence';
import type { ChatMessage } from './useChat';

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  min-height: 80dvh;
  max-height: 760px;
  padding: ${theme.space(4)};
  border: 1px solid ${theme.colors.phosphorMuted};
  background: rgba(0, 12, 0, 0.4);
  box-shadow: ${theme.glow.soft};
  font-size: 18px;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.space(3)};
    min-height: 85dvh;
    max-height: none;
    border-left: none;
    border-right: none;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding-bottom: env(safe-area-inset-bottom, 0px);
`;

const BOOT_KEY = 'dialBooted';

type Props = {
  date: string;
  persona: string | null;
  messages: ChatMessage[];
  status: 'booting' | 'idle' | 'sending' | 'error';
  error: string | null;
  onDateChange: (iso: string) => void;
  onReroll: () => void;
  onSend: (text: string) => void;
};

export function Terminal({
  date,
  persona,
  messages,
  status,
  error,
  onDateChange,
  onReroll,
  onSend,
}: Props) {
  const [booted, setBooted] = useState(
    () =>
      typeof window !== 'undefined' && sessionStorage.getItem(BOOT_KEY) === '1'
  );

  useEffect(() => {
    if (booted && typeof window !== 'undefined') {
      sessionStorage.setItem(BOOT_KEY, '1');
    }
  }, [booted]);

  const inputDisabled = status !== 'idle';

  return (
    <Shell>
      {!booted ? (
        <BootSequence onDone={() => setBooted(true)} />
      ) : (
        <Body>
          <TimeDial
            date={date}
            disabled={status === 'sending'}
            onDateChange={onDateChange}
            onReroll={onReroll}
          />
          <PersonaChip persona={persona} />
          <MessageLog messages={messages} status={status} error={error} />
          <PromptInput
            disabled={inputDisabled}
            placeholder={
              status === 'booting'
                ? 'connecting…'
                : status === 'sending'
                  ? 'wait for reply…'
                  : 'say something'
            }
            onSubmit={onSend}
          />
        </Body>
      )}
    </Shell>
  );
}

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScreenWell } from '../Screen/ScreenWell';
import { PersonaChip } from './PersonaChip';
import { MessageLog } from './MessageLog';
import { PromptInput } from './Prompt';
import { BootSequence } from './BootSequence';
import type { ChatMessage } from './useChat';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const BOOT_KEY = 'dialBooted';

type Props = {
  persona: string | null;
  messages: ChatMessage[];
  status: 'booting' | 'idle' | 'sending' | 'error';
  error: string | null;
  onSend: (text: string) => void;
};

export function Terminal({ persona, messages, status, error, onSend }: Props) {
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
    <ScreenWell booting={!booted}>
      {!booted ? (
        <BootSequence onDone={() => setBooted(true)} />
      ) : (
        <Body>
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
    </ScreenWell>
  );
}

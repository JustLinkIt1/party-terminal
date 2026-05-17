import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScreenWell } from '../Screen/ScreenWell';
import { PersonaChip } from './PersonaChip';
import { MessageLog } from './MessageLog';
import { PromptInput } from './Prompt';
import { BootSequence } from './BootSequence';
import { QuickPrompts } from './QuickPrompts';
import { PostcardButton } from './PostcardButton';
import type { ChatMessage } from './useChat';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 4px 0 0;
`;

const BOOT_KEY = 'dialBooted';

type Props = {
  date: string;
  persona: string | null;
  messages: ChatMessage[];
  status: 'booting' | 'idle' | 'sending' | 'error';
  error: string | null;
  onSend: (text: string) => void;
  onToast?: (msg: string) => void;
};

export function Terminal({ date, persona, messages, status, error, onSend, onToast }: Props) {
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

  // Show quick prompts only until the visitor has actually said something.
  // We count user-role messages in the log; >0 means they've started, so the
  // chips retire.
  const hasUserSpoken = messages.some((m) => m.role === 'user');
  const showQuickPrompts = persona && !hasUserSpoken;

  // Postcard becomes available once there's something worth saving: at least
  // one user message + one reply on top of the opening.
  const userMsgs = messages.filter((m) => m.role === 'user').length;
  const showPostcard = persona && userMsgs >= 1 && status !== 'booting';

  return (
    <ScreenWell booting={!booted}>
      {!booted ? (
        <BootSequence onDone={() => setBooted(true)} />
      ) : (
        <Body>
          <PersonaChip key={persona ?? 'no-signal'} persona={persona} />
          <MessageLog messages={messages} status={status} error={error} />
          {showQuickPrompts && (
            <QuickPrompts
              date={date}
              disabled={inputDisabled}
              onPick={onSend}
            />
          )}
          {showPostcard && (
            <ActionRow>
              <PostcardButton
                date={date}
                persona={persona!}
                messages={messages}
                onToast={onToast}
              />
            </ActionRow>
          )}
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

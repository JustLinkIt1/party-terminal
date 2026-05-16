import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import type { ChatMessage } from './useChat';

const LogContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.space(2)} 0;
  min-height: 200px;
`;

const Line = styled.p<{ $role: 'user' | 'assistant' | 'system' }>`
  margin: 0 0 ${theme.space(2)} 0;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: ${(p) => (p.$role === 'system' ? theme.colors.phosphorDim : theme.colors.phosphor)};
  opacity: ${(p) => (p.$role === 'system' ? 0.7 : 1)};
`;

const Prefix = styled.span`
  color: ${theme.colors.phosphorDim};
  margin-right: ${theme.space(1)};
`;

const Typing = styled.p`
  margin: 0 0 ${theme.space(2)} 0;
  color: ${theme.colors.phosphorDim};
  font-style: italic;
  &::after {
    content: '_';
    animation: blink 1s steps(1) infinite;
    margin-left: 2px;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
`;

type Props = {
  messages: ChatMessage[];
  status: 'booting' | 'idle' | 'sending' | 'error';
  error: string | null;
};

export function MessageLog({ messages, status, error }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, status, error]);

  return (
    <LogContainer>
      {messages.map((m, i) => (
        <Line key={i} $role={m.role}>
          <Prefix>{m.role === 'user' ? '&gt;' : '·'}</Prefix>
          {m.text}
        </Line>
      ))}
      {status === 'booting' && <Typing>connecting</Typing>}
      {status === 'sending' && <Typing>they're thinking</Typing>}
      {status === 'error' && error && (
        <Line $role="system">[ {error} ]</Line>
      )}
      <div ref={endRef} />
    </LogContainer>
  );
}

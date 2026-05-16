import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import type { ChatMessage } from './useChat';

const LogContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.space.snug} 0;
  min-height: 200px;
  font-family: ${theme.font.mono};
  font-size: 19px;
  line-height: 1.45;
  filter: blur(0.35px);
`;

const Line = styled.p<{ $role: 'user' | 'assistant' | 'system' }>`
  margin: 0 0 ${theme.space.snug} 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: ${(p) =>
    p.$role === 'system'
      ? theme.color.crt.amberWarn
      : p.$role === 'user'
        ? theme.color.text.onScreenUser
        : theme.color.text.onScreen};
  text-shadow: ${(p) =>
    p.$role === 'user' ? theme.glow.phosphorHot : theme.glow.phosphorSoft};
`;

const Prefix = styled.span`
  color: ${theme.color.crt.phosphorDim};
  margin-right: ${theme.space.tight};
  text-shadow: ${theme.glow.phosphorSoft};
`;

const Typing = styled.p`
  margin: 0 0 ${theme.space.snug} 0;
  color: ${theme.color.crt.phosphorDim};
  font-style: italic;
  text-shadow: ${theme.glow.phosphorSoft};

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
    <LogContainer role="log" aria-live="polite">
      {messages.map((m, i) => (
        <Line key={i} $role={m.role}>
          <Prefix>{m.role === 'user' ? '>' : '·'}</Prefix>
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

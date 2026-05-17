import { KeyboardEvent, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { caretBlink } from '../../styles/keyframes';

const Row = styled.label`
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(91, 255, 138, 0.12);
  padding: ${theme.space.snug} 0 env(safe-area-inset-bottom, 0px) 0;
  gap: ${theme.space.snug};
  font-family: ${theme.font.mono};
  min-height: 44px;
  cursor: text;
`;

const Caret = styled.span`
  color: ${theme.color.crt.phosphor};
  text-shadow: ${theme.glow.phosphorHot};
  flex-shrink: 0;
  font-size: 20px;

  &::after {
    content: '';
    display: inline-block;
    width: 9px;
    height: 1em;
    margin-left: 2px;
    vertical-align: text-bottom;
    background: ${theme.color.crt.phosphor};
    box-shadow: ${theme.glow.phosphorHot};
    animation: ${caretBlink} 1100ms steps(1) infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${theme.color.text.onScreenUser};
  font-family: inherit;
  font-size: 19px;
  line-height: 1.6;
  min-height: 32px;
  text-shadow: ${theme.glow.phosphorSoft};
  caret-color: ${theme.color.crt.phosphor};
  letter-spacing: ${theme.tracking.mono};
  padding: 4px 0;

  &::placeholder {
    color: ${theme.color.crt.phosphorDim};
    opacity: 0.7;
    text-shadow: none;
    font-style: italic;
  }

  &:disabled {
    opacity: 0.55;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px; /* avoid iOS auto-zoom */
    min-height: 36px;
  }
`;

type Props = {
  disabled: boolean;
  placeholder?: string;
  onSubmit: (text: string) => void;
  maxLength?: number;
};

export function PromptInput({ disabled, placeholder, onSubmit, maxLength = 500 }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = value.trim();
      if (!text || disabled) return;
      setValue('');
      onSubmit(text);
    }
  };

  return (
    <Row>
      <Caret>&gt;</Caret>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder ?? 'say something'}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        aria-label="Terminal prompt"
      />
    </Row>
  );
}

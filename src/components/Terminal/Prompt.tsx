import { KeyboardEvent, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';

const Row = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${theme.colors.border};
  padding-top: ${theme.space(2)};
  gap: ${theme.space(2)};
`;

const Caret = styled.span`
  color: ${theme.colors.phosphor};
  flex-shrink: 0;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${theme.colors.phosphor};
  font-family: inherit;
  font-size: 18px;
  text-shadow: ${theme.glow.text};
  caret-color: ${theme.colors.phosphor};
  &::placeholder {
    color: ${theme.colors.phosphorDim};
    opacity: 0.6;
  }
  &:disabled {
    opacity: 0.4;
  }
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px; /* prevent iOS auto-zoom */
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
      />
    </Row>
  );
}

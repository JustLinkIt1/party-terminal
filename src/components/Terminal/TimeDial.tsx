import styled from 'styled-components';
import { theme } from '../../theme';
import { config } from '../../config';
import { isValidDialDate, randomDate } from '../../lib/dates';
import { formatDateForDisplay } from '../../lib/format';

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space(2)};
  padding-bottom: ${theme.space(2)};
  border-bottom: 1px solid ${theme.colors.border};
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.space(2)};
`;

const Label = styled.span`
  color: ${theme.colors.phosphorDim};
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.1em;
`;

const DateInput = styled.input`
  background: transparent;
  border: 1px solid ${theme.colors.phosphorDim};
  color: ${theme.colors.phosphor};
  font-family: inherit;
  font-size: 18px;
  padding: ${theme.space(1)} ${theme.space(2)};
  text-shadow: ${theme.glow.text};
  outline: none;
  color-scheme: dark;
  min-width: 160px;
  &:focus {
    border-color: ${theme.colors.phosphor};
  }
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

const Chip = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${(p) => (p.$active ? theme.colors.phosphor : theme.colors.border)};
  padding: ${theme.space(1)} ${theme.space(2)};
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${(p) =>
    p.$active ? 'rgba(0, 255, 0, 0.1)' : 'transparent'};
  text-shadow: ${(p) => (p.$active ? theme.glow.soft : 'none')};
`;

const Actions = styled.div`
  display: flex;
  gap: ${theme.space(2)};
  margin-left: auto;
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-left: 0;
    width: 100%;
  }
`;

const ActionBtn = styled.button`
  font-size: 14px;
  padding: ${theme.space(1)} ${theme.space(3)};
  flex: 1;
`;

const today = new Date().toISOString().slice(0, 10);

type Props = {
  date: string;
  disabled?: boolean;
  onDateChange: (iso: string) => void;
  onReroll: () => void;
};

export function TimeDial({ date, disabled, onDateChange, onReroll }: Props) {
  const commit = (iso: string) => {
    if (!isValidDialDate(iso)) return;
    if (iso === date) return;
    onDateChange(iso);
  };

  return (
    <Bar>
      <Row>
        <Label>Time Dial</Label>
        <DateInput
          type="date"
          value={date}
          min={config.MIN_DATE}
          max={today}
          disabled={disabled}
          onChange={(e) => commit(e.target.value)}
        />
        <Label>{formatDateForDisplay(date)}</Label>
        <Actions>
          <ActionBtn
            type="button"
            disabled={disabled}
            onClick={() => commit(randomDate())}
          >
            Random
          </ActionBtn>
          <ActionBtn type="button" disabled={disabled} onClick={onReroll}>
            New Person
          </ActionBtn>
        </Actions>
      </Row>
      <Row>
        {config.PRESET_DATES.map((p) => (
          <Chip
            key={p.date}
            type="button"
            $active={p.date === date}
            disabled={disabled}
            onClick={() => commit(p.date)}
          >
            {p.label}
          </Chip>
        ))}
      </Row>
    </Bar>
  );
}

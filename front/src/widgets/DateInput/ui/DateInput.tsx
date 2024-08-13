import { classNames } from 'shared/lib/classNames/classNames';
import {
  useCallback, useEffect, useMemo, useRef,
  useState,
} from 'react';
import { RangePickerSelectedDays } from 'react-trip-date/dist/rangePicker/rangePicker.type';
import { Calendar } from 'shared/ui/Calendar/Calendar';
import { Input, InputThemes } from 'shared/ui/Input/Input';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { getDateString } from 'shared/lib/getDateString/getDateString';
import cls from './DateInput.module.scss';

interface DateInputProps {
  className?: string;
  onChange?: (dates: RangePickerSelectedDays) => void;
  selectedDays?: RangePickerSelectedDays;
  onClear?: () => void;
  inputTheme?: InputThemes;
  isFocused?: boolean;
  onCloseCalendar?: () => void;
  onFocusHandler?: () => void;
  onBlur?: () => void;
  theme?: CalendarThemes;
  placeholder: string;
  isError?: boolean;
  startDay?: boolean;
  isRangePicker?: boolean;
}

export enum CalendarThemes {
  CENTER = 'center',
  DOWN = 'down',
}

export const DateInput: React.FC<DateInputProps> = (props) => {
  const {
    className,
    onChange,
    onClear,
    selectedDays,
    inputTheme,
    isFocused,
    onCloseCalendar,
    onFocusHandler,
    theme = CalendarThemes.CENTER,
    placeholder,
    onBlur,
    isError,
    startDay = true,
    isRangePicker = true,
    ...otherProps
  } = props;

  const [inputSelectedDays, setInputSelectedDays] = useState(selectedDays || { to: '', from: '' });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeCalendar = (e: any) => {
      if (e.target instanceof Node && isFocused && !ref.current?.contains(e.target)) {
        onCloseCalendar?.();
        onBlur?.();
      }
    };

    window.addEventListener('click', closeCalendar);
    return () => {
      window.removeEventListener('click', closeCalendar);
    };
  }, [isFocused, onCloseCalendar, onBlur]);

  const changeDateHandler = useCallback((days: RangePickerSelectedDays) => {
    setInputSelectedDays(days);
    if (days.from && days.to) {
      onChange?.({ from: days.from, to: days.to });
    } else {
      onChange?.({ from: days.from, to: days.to });
    }
  }, [onChange]);

  const value = useMemo(
    () => ((selectedDays?.from || selectedDays?.to)
      ? `С  ${getDateString(new Date(selectedDays?.from ?? ''))}  до  ${getDateString(new Date(selectedDays?.to ?? ''))}`
      : ''),
    [selectedDays?.from, selectedDays?.to],
  );

  const onClearCalendar = useCallback(() => {
    onClear?.();
    setInputSelectedDays({ to: '', from: '' });
    onCloseCalendar?.();
    onBlur?.();
  }, [onClear, onCloseCalendar, onBlur]);

  const onSaveCalendar = useCallback(() => {
    onCloseCalendar?.();
    onBlur?.();
  }, [onCloseCalendar, onBlur]);

  return (
    <div className={classNames(cls.dateInput, {}, [className])} ref={ref}>
      <Input placeholder={placeholder} value={value ?? ''} onFocus={onFocusHandler} theme={inputTheme} isError={isError} {...otherProps} />
      <div className={classNames(cls.calendarForm, { [cls.isFocused]: isFocused }, [cls[theme]])}>
        <Calendar
          selectedDays={inputSelectedDays}
          startDay={startDay}
          className={cls.calendar}
          onChange={changeDateHandler}
          isRangePicker={isRangePicker}
        />
        <div className={cls.buttons}>
          <Button className={cls.button} theme={ButtonThemes.CLEAR} onClick={onClearCalendar}>Очистить</Button>
          <Button className={cls.button} theme={ButtonThemes.BLUE_SOLID} onClick={onSaveCalendar}>Сохранить</Button>
        </div>
      </div>
    </div>
  );
};

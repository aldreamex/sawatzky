import { classNames } from 'shared/lib/classNames/classNames';
import {
  useCallback, useEffect, useMemo, useRef,
  useState,
} from 'react';
import { Calendar } from 'shared/ui/Calendar/Calendar';
import { Input, InputThemes } from 'shared/ui/Input/Input';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { getDateString } from 'shared/lib/getDateString/getDateString';
import cls from './DateInput.module.scss';

interface DateInputProps {
  className?: string;
  onChange?: (days: string[]) => void; // (dates: RangePickerSelectedDays) => void;
  selectedDays?: string[]; // RangePickerSelectedDays;
  onClear?: () => void;
  inputTheme?: InputThemes;
  isFocused?: boolean;
  onCloseCalendar?: () => void;
  onFocusHandler?: () => void;
  onBlur?: () => void;
  theme?: CalendarThemes;
  placeholder: string;
  isError?: boolean;
  // startDay?: boolean;
}

export enum CalendarThemes {
  CENTER = 'center',
  DOWN = 'down',
}
const isRangePicker = false;

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
    // startDay = true,
    ...otherProps
  } = props;

  const [inputSelectedDays, setInputSelectedDays] = useState<string[]|undefined>(selectedDays);

  useEffect(() => {
    setInputSelectedDays(selectedDays);
  }, [selectedDays && selectedDays[0]]);

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

  const changeDateHandler = useCallback((days: string[]) => {
    setInputSelectedDays(days);
    onChange?.(days);
  }, [onChange]);

  const value = useMemo(
    () => ((inputSelectedDays && inputSelectedDays[0])
      ? `${getDateString(new Date(inputSelectedDays[0]))}`
      : ''),
    [inputSelectedDays],
  );
  const onClearCalendar = useCallback(() => {
    onClear?.();
    setInputSelectedDays([]);
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
          isRangePicker={isRangePicker}
          selectedDay={inputSelectedDays}
          onChangeSingleDate={(dates) => {
            changeDateHandler(dates);
          }}
        />
        <div className={cls.buttons}>
          <Button className={cls.button} theme={ButtonThemes.CLEAR} onClick={onClearCalendar}>Очистить</Button>
          <Button className={cls.button} theme={ButtonThemes.BLUE_SOLID} onClick={onSaveCalendar}>Сохранить</Button>
        </div>
      </div>
    </div>
  );
};

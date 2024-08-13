import { classNames } from 'shared/lib/classNames/classNames';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
// import { ReactComponent as CloseIcon } from 'shared/assets/icons/close-icon.svg';
import cls from './Select.module.scss';
// import { Button, ButtonThemes } from '../Button/Button';
import { MultiselectItem } from './MultiselectItem/MultiselectItem';

interface SelectProps {
  className?: string;
  options?: SelectOptionType[];
  placeholder?: string;
  onChange?: (value: SelectOptionType) => void;
  onMultiChange?: (selected: SelectOptionType[]) => void;
  value?: SelectOptionType;
  multi?: boolean;
  selected?: SelectOptionType[];
  theme?: SelectThemes;
  onBlur?: () => void;
  isError?: boolean;
  size?: SelectSize;
}

export enum SelectThemes {
  USUAL = '',
  BORDER = 'border',
  ACTIVE = 'active',
}

export enum SelectSize {
  S = 's',
  M = 'm',
  A = 'a',
}

export interface SelectOptionType {
  value: string | number;
  text: string;
}

export const Select: React.FC<SelectProps> = (props) => {
  const {
    className,
    placeholder,
    options,
    onChange,
    onMultiChange,
    multi,
    selected = [],
    value,
    theme = SelectThemes.USUAL,
    onBlur,
    isError,
    size = SelectSize.M,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [, setIsFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const closeSelect = (e: any) => {
      if (e.target instanceof Node && isOpen && !ref.current?.contains(e.target)) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    window.addEventListener('click', closeSelect);
    return () => {
      window.removeEventListener('click', closeSelect);
    };
  }, [isOpen, onBlur]);

  const toggleHandler = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      onBlur?.();
    }
  }, [setIsOpen, isOpen, onBlur]);

  const onFocusHandler = useCallback((e: React.FocusEvent) => {
    e.stopPropagation();
    setIsFocused(true);
  }, [setIsFocused]);

  const onBlurhandler = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleOptionClick = useCallback((event: React.MouseEvent, option: SelectOptionType) => {
    event.stopPropagation();
    onChange?.(option);
    setIsOpen(false);
    setSearchVal('');
  }, [onChange]);

  const addTag = useCallback((item: SelectOptionType) => {
    onMultiChange?.([...selected, item]);
  }, [selected, onMultiChange]);

  const removeTag = useCallback((item: any) => {
    const filtered = selected.filter((e) => e !== item);
    onMultiChange?.(filtered);
  }, [selected, onMultiChange]);

  const onMultiChangeHandler = useCallback((item: any) => {
    const changedOption = options?.find((option) => option.value.toString() === item.id.toString());
    if (item.value && changedOption) {
      addTag(changedOption);
      setSearchVal('');
    } else {
      removeTag(changedOption);
    }
  }, [addTag, removeTag, options]);

  const handleSearchClick = (e: any) => {
    const searchItem = e.target.value;
    setSearchVal(searchItem);
  };

  const filteredOptions = useMemo(() => {
    if (searchVal) {
      return options?.filter((item: any) => item.text.toLowerCase().includes(searchVal.toLowerCase()));
    }
    return options;
  }, [options, searchVal]);

  const multiOptions = useMemo(() => {
    filteredOptions?.sort((a: any, b: any) => {
      if (selected.includes(a) && !selected.includes(b)) {
        return -1;
      } if (!selected.includes(a) && selected.includes(b)) {
        return 1;
      }
      return 0;
    });
    return filteredOptions;
  }, [filteredOptions, selected]);

  return (
    <div
      className={classNames(cls.select, {
        [cls.open]: isOpen, [cls.error]: isError,
      }, [className, cls[theme], cls[size]])}
      onClick={toggleHandler}
      ref={ref}
    >
      {multi ? (
        <div>
          <input
            className={cls.input}
            onChange={handleSearchClick}
            placeholder={selected.length === 0 ? placeholder : ''}
            value={searchVal}
          />

          {
            !isOpen && (
              <div className={cls.selectedList}>
                {selected?.slice(0, 3).map((item) => (
                  <span
                    className={cls.selected}
                    key={item.value}
                  >
                    {item.text}

                    {/* <Button
                    <Button
                      theme={ButtonThemes.CLEAR}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(item);
                      }}
                    ><CloseIcon />
                    </Button> */}
                  </span>
                ))}
                {/* указать при какой именно длине массива выводить этот спан */}
                {
                  selected.length > 3 && <span className={cls.more}>ещё</span>
                }
              </div>
            )
          }

          <ul className={cls.optionsList}>
            {
              multiOptions?.map((option) => (
                <MultiselectItem
                  key={option.value}
                  id={option.value.toString()}
                  text={option.text}
                  onChange={onMultiChangeHandler}
                  checked={Boolean(selected.find((item) => item.value === option.value))}
                />
              ))
            }
          </ul>
        </div>
      ) : (
        <div className={cls.singleSelect}>
          <input
            className={cls.input}
            onChange={handleSearchClick}
            onFocus={(e) => onFocusHandler(e)}
            onBlur={onBlurhandler}
            placeholder={value?.text ?? placeholder}
            value={searchVal}
          />
          {/* <span className={cls.selectedItem}>{value?.text ?? placeholder}</span> */}
          <ul className={cls.optionsList}>
            {
              filteredOptions && filteredOptions.length > 0
                ? filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={cls.option}
                    onClick={(e) => handleOptionClick(e, option)}
                  >
                    {option.text}

                  </li>
                ))
                : (
                  <li className={cls.option}>
                    Варианты не найдены
                  </li>
                )
            }
          </ul>
        </div>
      )}
    </div>
  );
};

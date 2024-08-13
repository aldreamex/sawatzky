import { classNames } from 'shared/lib/classNames/classNames';
import { InputHTMLAttributes, useCallback } from 'react';
import cls from './Checkbox.module.scss';

type HTMLCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>

interface CheckboxProps extends HTMLCheckboxProps {
  className?: string;
  label?: string
  id: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  onBlur?: () => void;
  theme?: CheckboxThemes;
  isError?: boolean;
}

export enum CheckboxThemes {
  USUAL = 'label',
  BLUE = 'blue',
}

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const {
    className, label, id, onChange, onBlur, checked = false, theme = CheckboxThemes.USUAL, isError, ...otherProps
  } = props;

  const onChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  }, [onChange]);

  return (
    <div className={classNames(cls.checkboxContainer, {}, [className])} onClick={(e) => e.stopPropagation()}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChangeHandler}
        className={classNames(cls.checkbox, {}, [className])}
        {...otherProps}
      />
      <label htmlFor={id} className={classNames(cls.label, { [cls.error]: isError }, [cls[theme]])}>{label && label}</label>
    </div>
  );
};

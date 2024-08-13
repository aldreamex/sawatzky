import { classNames } from 'shared/lib/classNames/classNames';
import { InputHTMLAttributes, memo } from 'react';
import cls from './Input.module.scss';

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>

interface InputProps extends HTMLInputProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  id?: string;
  theme?: InputThemes;
  isError?: boolean;
  isSuccess?: boolean;
}

export enum InputThemes {
  GRAY = 'gray',
  WHITE = 'white',
}

export const Input: React.FC<InputProps> = memo((props) => {
  const {
    className,
    value,
    onChange,
    placeholder,
    type = 'text',
    label,
    id,
    theme = InputThemes.GRAY,
    isError,
    isSuccess,
    ...otherProps
  } = props;

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={classNames(cls.inputWrapper, {}, [className])}>
      {label && <label className={cls.label} htmlFor={id}>{label}</label>}
      <div className={classNames(cls.inputContainer, { [cls.error]: isError, [cls.success]: isSuccess }, [className, cls[theme]])}>
        <input
          id={id}
          className={cls.input}
          type={type}
          value={value}
          onChange={onChangeHandler}
          placeholder={placeholder}
          {...otherProps}
        />
      </div>
    </div>
  );
});

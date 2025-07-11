import { classNames } from 'shared/lib/classNames/classNames';
import { useCallback } from 'react';
import cls from './Switch.module.scss';

interface SwitchProps{
	className?: string;
	label?: string;
	id?: string;
	checked?: boolean;
	onChange?: (value: boolean) => void;
  required?: boolean;
  onBlur?: () => void;
}

export const Switch: React.FC<SwitchProps> = (props) => {
  const {
    className,
    checked,
    id,
    label,
    required = false,
    onChange,
    onBlur,
    ...otherProps
  } = props;

  const changeHandler = useCallback((value: boolean) => {
    onChange?.(value);
  }, [onChange]);

  return (
    <div className={classNames(cls.switch, {}, [className])}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        className={cls.input}
        required={required}
        onChange={(e) => changeHandler(e.target.checked)}
        {...otherProps}
      />
      <label
        htmlFor={id}
        className={cls.label}
      >
        {label}
      </label>
    </div>
  );
};

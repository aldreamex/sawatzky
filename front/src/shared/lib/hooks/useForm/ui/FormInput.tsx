import { Checkbox } from 'shared/ui/Checkbox/Checkbox';
import { FileInput } from 'shared/ui/FileInput/FileInput';
import { Input } from 'shared/ui/Input/Input';
import { Select } from 'shared/ui/Select/Select';
import { Switch } from 'shared/ui/Switch/Switch';
import { Textarea } from 'shared/ui/Textarea/Textarea';
import { DateInput } from 'widgets/DateInput';
import {
  FC, useCallback, useEffect, useState,
} from 'react';
import { FormField, FormType } from '../useForm';
import { useValidation } from '../useValidation';
import cls from './FormInput.module.scss';

interface FormInputProps {
  field: FormField;
  setIsValid: (id: string, isValid: boolean) => void;
  isDirty?: boolean;
  onBlur?: (field: FormField) => void;
}

export const FormInput: FC<FormInputProps> = ({
  field, setIsValid, isDirty, onBlur,
}) => {
  const {
    type, defaultValue, options, placeholder, value, id, label, otherProps, mask,
  } = field;

  const {
    messages,
    checkValidation,
    validateField,
    isValid: inputIsValid,
  } = useValidation(field);

  const [isInit, setIsInit] = useState(false);
  const [fieldIsValid, setFieldIsValid] = useState(false);

  useEffect(() => {
    const { isValid } = validateField(field);
    setFieldIsValid(isValid);
  }, [isInit, setIsValid, setIsInit, id, checkValidation, field.value, validateField]);

  useEffect(() => {
    setIsValid(field.id, fieldIsValid);
  }, [fieldIsValid, setIsValid, field.id]);

  const onBlurHandler = useCallback(() => {
    const { isValid } = validateField(field);
    setIsValid(id, isValid);
    onBlur?.(field);
  }, [id, setIsValid, field, onBlur, validateField]);

  const onChangeHandler = useCallback((value: any) => {
    field.onChange(value);
    const isValid = typeof value === 'boolean' ? value : validateField(field).isValid;
    setIsValid(id, isValid);

    if (typeof value === 'boolean') {
      validateField({ ...field, value }); // Передаем обновленное значение в validateField
    }
  }, [field, id, setIsValid, validateField]);

  if (!field.isHidden) {
    switch (type) {
    case FormType.TEXT:

      return (
        <div className={cls.inputRow}>
          <Input
            key={`${id}_${type}_input`}
            value={value ?? defaultValue ?? ''}
            placeholder={placeholder}
            onBlur={onBlurHandler}
            label={label}
            mask={mask}
            onChange={onChangeHandler}
            isError={isDirty && !checkValidation()}
            {...otherProps}
          />
          <div className={cls.errors}>
            {
              isDirty && Object.entries(messages).map(([rule, message]) => (
                message
                  ? (
                    <span key={`${id}_${type}_${rule}_error`} className={cls.error}>
                      {message}
                    </span>
                  )
                  : null
              ))
            }
          </div>
        </div>
      );
    case FormType.BIG_TEXT:
      return (
        <div className={cls.inputRow}>
          <Textarea
            key={`${id}_${type}_input`}
            value={value ?? defaultValue ?? ''}
            placeholder={placeholder}
            onBlur={onBlurHandler}
            label={label}
            onChange={onChangeHandler}
            isError={isDirty && !checkValidation()}
            {...otherProps}
          />
          <div className={cls.errors}>
            {
              isDirty && Object.entries(messages).map(([rule, message]) => (
                message
                  ? (
                    <span key={`${id}_${type}_${rule}_error`} className={cls.error}>
                      {message}
                    </span>
                  )
                  : null
              ))
            }
          </div>
        </div>
      );
    case FormType.CHECKBOX:
      return (
        <div className={cls.inputRow}>
          <Checkbox
            key={`${id}_${type}_input`}
            checked={value ?? defaultValue ?? false}
            onBlur={onBlurHandler}
            id={id}
            label={label}
            onChange={onChangeHandler}
            isError={isDirty && !inputIsValid}
            {...otherProps}
          />
          <div className={cls.errors}>
            {
              Boolean(isDirty && !inputIsValid) && Object.entries(messages).map(([rule, message]) => (
                message
                  ? (
                    <span key={`${id}_${type}_${rule}_error`} className={cls.error}>
                      {message}
                    </span>
                  )
                  : null
              ))
            }
          </div>
        </div>

      );
    case FormType.SWITCH:
      return (

        <div className={cls.inputRow}>
          <Switch
            key={`${id}_${type}_input`}
            checked={value ?? defaultValue ?? false}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            id={id}
            label={label}
            {...otherProps}
          />
          <div className={cls.errors}>
            {
              isDirty && Object.entries(messages).map(([rule, message]) => (
                message
                  ? (
                    <span key={`${id}_${type}_${rule}_error`} className={cls.error}>
                      {message}
                    </span>
                  )
                  : null
              ))
            }
          </div>
        </div>
      );
    case FormType.DATE:
      return (

        <div className={cls.inputRow}>
          <DateInput
            key={`${id}_${type}_input`}
            selectedDays={value ?? defaultValue ?? undefined}
            onBlur={onBlurHandler}
            placeholder={placeholder}
            onChange={onChangeHandler}
            isError={isDirty && !checkValidation()}
            {...otherProps}
          />
          <div className={cls.errors}>
            {
              isDirty && Object.entries(messages).map(([rule, message]) => (
                message
                  ? (
                    <span key={`${id}_${type}_${rule}_error`} className={cls.error}>
                      {message}
                    </span>
                  )
                  : null
              ))
            }
          </div>
        </div>
      );
    case FormType.FILE:
      return (

        <div className={cls.inputRow}>
          <FileInput
            key={`${id}_${type}_input`}
            value={value ?? defaultValue ?? undefined}
            id={id}
            label={label}
            onBlur={onBlurHandler}
            onFileChange={onChangeHandler}
            isError={isDirty && !checkValidation()}
            {...otherProps}
          />
          <div className={cls.errors}>
            {
              isDirty && Object.entries(messages).map(([rule, message]) => (
                message
                  ? (
                    <span key={`${id}_${type}_${rule}_error`} className={cls.error}>
                      {message}
                    </span>
                  )
                  : null
              ))
            }
          </div>
        </div>
      );
    case FormType.PASSWORD:
      return (

        <div className={cls.inputRow}>
          <Input
            key={`${id}_${type}_input`}
            value={value ?? defaultValue ?? ''}
            placeholder={placeholder}
            onBlur={onBlurHandler}
            label={label}
            onChange={onChangeHandler}
            isError={isDirty && !checkValidation()}
            type="password"
            {...otherProps}
          />
          <div className={cls.errors}>
            {
              isDirty && Object.entries(messages).map(([rule, message]) => (
                message
                  ? (
                    <span key={`${id}_${type}_${rule}_error`} className={cls.error}>
                      {message}
                    </span>
                  )
                  : null
              ))
            }
          </div>
        </div>
      );
    case FormType.SELECT:
      return (

        <div className={cls.inputRow}>
          <Select
            key={`${id}_${type}_input`}
            value={value ?? defaultValue ?? undefined}
            options={options}
            onBlur={onBlurHandler}
            placeholder={field.placeholder}
            onChange={onChangeHandler}
            isError={isDirty && !checkValidation()}
            {...otherProps}
          />
          <div className={cls.errors}>
            {
              isDirty && Object.entries(messages).map(([rule, message]) => (
                message
                  ? (
                    <span key={`${id}_${type}_${rule}_error`} className={cls.error}>
                      {message}
                    </span>
                  )
                  : null
              ))
            }
          </div>
        </div>
      );
    case FormType.MULTIPLE_SELECT:
      return (

        <div className={cls.inputRow}>
          <Select
            key={`${id}_${type}_input`}
            multi
            options={options}
            placeholder={placeholder}
            onBlur={onBlurHandler}
            selected={value ?? defaultValue ?? undefined}
            onMultiChange={onChangeHandler}
            isError={isDirty && !checkValidation()}
            {...otherProps}
          />
          <div className={cls.errors}>
            {
              isDirty && Object.entries(messages).map(([rule, message]) => (
                message
                  ? (
                    <span key={`${id}_${type}_${rule}_error`} className={cls.error}>
                      {message}
                    </span>
                  )
                  : null
              ))
            }
          </div>
        </div>
      );
    default:
      return (

        <div className={cls.inputRow}>
          <Input
            value={value ?? defaultValue ?? undefined}
            placeholder={placeholder}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            isError={isDirty && !checkValidation()}
            {...otherProps}
          />
          <div className={cls.errors}>
            {
              isDirty && Object.entries(messages).map(([rule, message]) => (
                message
                  ? (
                    <span key={`${id}_${type}_${rule}_error`} className={cls.error}>
                      {message}
                    </span>
                  )
                  : null
              ))
            }
          </div>
        </div>
      );
    }
  } else {
    return null;
  }
};

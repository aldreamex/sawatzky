import {
  FormEvent,
  ReactElement, useCallback, useEffect, useMemo, useRef,
  useState,
} from 'react';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { SelectOptionType } from 'shared/ui/Select/Select';
import { FormInput } from './ui/FormInput';

export enum FormType {
  TEXT = 'text',
  BIG_TEXT = 'big_text',
  PASSWORD = 'password',
  DATE = 'date',
  SELECT = 'select',
  MULTIPLE_SELECT = 'multiple_select',
  CHECKBOX = 'checkbox',
  SWITCH = 'switch',
  FILE = 'file',
  DATEPICKER = 'datepicker',
}

type FromFieldValue = any;

interface PatternRule {
  template: RegExp;
  message?: string;
}

export interface FormRules {
  required?: boolean,
  pattern?: PatternRule,
}

export interface FormField {
  id: string;
  type: FormType;
  onChange: (value?: any) => void;
  label?: string;
  options?: SelectOptionType[];
  placeholder?: string;
  defaultValue?: FromFieldValue;
  value?: FromFieldValue;
  rules?: FormRules;
  otherProps?: any;
  isHidden?: boolean;
}

interface FromProps {
  fields: FormField[];
  onSubmit?: () => void;
  onCancel?: () => void;
  submitTitle?: string;
  cancelTitle?: string;
  submitBtnTheme?: ButtonThemes;
  cancelBtnTheme?: ButtonThemes;
}

interface FormResult {
  Form: ReactElement;
  resetForm: () => void;
}

export const useForm = (props: FromProps): FormResult => {
  const {
    fields, onSubmit, onCancel, submitTitle = 'Сохранить', cancelTitle = 'Отмена', submitBtnTheme = ButtonThemes.BLUE_SOLID, cancelBtnTheme = ButtonThemes.BLUE_BORDER,
  } = props;
  const [isValidFields, setIsValidFields] = useState({});
  const [dirtyFields, setDirtyFields] = useState<FormField[]>([]);
  const [formIsInit, setFormIsInit] = useState<boolean>(false);
  const formRef = useRef<any>(null);

  useEffect(() => {
    if (!formIsInit) {
      setFormIsInit(true);
    }
    if (fields.length !== Object.keys(isValidFields).length) {
      setIsValidFields({});
      fields.forEach((field) => setIsValidFields((prev) => ({ ...prev, [field.id]: !(field.rules && Boolean(Object.keys(field.rules).length)) })));
    }
  }, [formIsInit, setFormIsInit, fields, isValidFields]);

  const resetForm = useCallback(() => {
    setDirtyFields([]);
    setIsValidFields({});
  }, [setDirtyFields]);

  const submitHandler = useCallback((e: FormEvent) => {
    e.preventDefault();
    const allIsValid = (Object.values(isValidFields).every((value) => value === true) && Object.values(isValidFields).length === fields.length);
    if (allIsValid) {
      onSubmit?.();
      resetForm();
    } else {
      setDirtyFields(fields);
    }
  }, [isValidFields, onSubmit, resetForm, fields]);

  const cancelHandler = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsValidFields({});
    resetForm();
    onCancel?.();
  }, [onCancel, resetForm]);

  const setIsValidHandler = useCallback((id: string, value: boolean) => {
    setIsValidFields((prev) => ({ ...prev, [id]: value }));
  }, []);

  const onBlurHandler = useCallback((field: FormField) => {
    setDirtyFields((prev) => [...prev, field]);
  }, []);

  const Form = useMemo(() => (
    <form
      onSubmit={(e) => submitHandler(e)}
      ref={formRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'stretch',
      }}
    >
      {
        fields.map((field) => (
          <div key={`${field.id}_${field.type}_input`}>
            <FormInput
              field={field}
              setIsValid={setIsValidHandler}
              onBlur={() => onBlurHandler(field)}
              isDirty={Boolean(dirtyFields.find((dirtyField) => field.id === dirtyField.id))}
            />
          </div>
        ))
      }
      <div style={{ display: 'flex', gap: '20px' }}>
        {onSubmit
          && <Button onClick={submitHandler} theme={submitBtnTheme} style={{ flex: '0 1 50%' }}>{submitTitle}</Button>}
        {
          onCancel && <Button onClick={(e) => cancelHandler(e)} theme={cancelBtnTheme} style={{ flex: '0 1 50%' }}>{cancelTitle}</Button>
        }
      </div>
    </form>
  ), [fields, onSubmit, submitHandler, submitBtnTheme, submitTitle, onCancel, cancelBtnTheme, cancelTitle, setIsValidHandler, dirtyFields, onBlurHandler, cancelHandler]);

  return {
    Form,
    resetForm,
  };
};

import { useCallback, useState } from 'react';
import { FormField } from './useForm';

interface ErrorMessaages {
  pattern?: any;
  required?: any;
  booleanTrue?: any;
}

export const useValidation = (field: FormField) => {
  const [isValid, setIsValid] = useState(false);
  const [isPatternError, setIsPatternError] = useState(false);
  const [patternErrorText, setPatternErrorText] = useState('');

  const [isRequiredError, setIsRequiredError] = useState(false);
  const [requiredErrorText, setRequiredErrorText] = useState('');
  const [booleanTrueErrorText, setBooleanTrueErrorText] = useState('');

  const validateField = useCallback((field: FormField) => {
    let isValid = true;
    let isEmpty = true;
    let errors: ErrorMessaages = {};

    switch (typeof field.value) {
    case 'string':
      isEmpty = !field.value;
      break;
    case 'boolean':
      isEmpty = false;
      // isEmpty = field.value; если булево задано, то уже непустое
      break;
    case 'object':
      if (field.value instanceof File) {
        isEmpty = field.value.size === 0;
      } else {
        isEmpty = Boolean(Object.values(field.value).every((value) => value === ''));
      }
      break;
    }

    field.rules && Object.keys(field.rules).forEach((validation) => {
      switch (validation) {
      case 'pattern':
        if (!field.rules?.[validation]?.template.test(field.value) && (field.rules?.required || field.value?.length)) {
          isValid = false;
          errors = {
            ...errors,
            pattern: field.rules?.[validation]?.message || 'Ошибка! Данные не соответствуют шаблону',
          };
        }
        break;
      case 'required':
        if (isEmpty && field.rules?.[validation]) {
          isValid = false;
          errors = {
            ...errors,
            required:
                typeof field.rules[validation] === 'boolean'
                  ? 'Это поле обязательно для заполнения'
                  : field.rules[validation] ?? '',
          };
        }
        break;
      case 'booleanTrue':
        if (typeof field.value === 'boolean' && !field.value) {
          isValid = false;
          errors.booleanTrue = 'Поле должно быть выбрано';
        }
        break;
      default:
        isValid = true;
        errors = {
          ...errors,
        };
      }
    });

    setPatternErrorText(errors.pattern || ''); // Сбрасываем в пустую строку

    setIsPatternError(Boolean(errors.pattern));

    setRequiredErrorText(errors.required || ''); // Сбрасываем в пустую строку
    setIsRequiredError(Boolean(errors.required));

    setBooleanTrueErrorText(errors.booleanTrue || '');

    setIsValid(!errors.pattern && !errors.required && !errors.booleanTrue); // Устанавливаем isValid только если обе ошибки равны f

    return {
      isValid,
      errors,
    };
  }, []);
  const checkValidation = useCallback(() => (!isPatternError && !isRequiredError), [isPatternError, isRequiredError]);

  return {
    errors: {
      pattern: isPatternError,
      required: isRequiredError,
      booleanTrue: Boolean(booleanTrueErrorText),
    },
    messages: {
      pattern: requiredErrorText,
      required: patternErrorText,
      booleanTrue: booleanTrueErrorText,
    },
    checkValidation,
    validateField,
    isValid,
  };
};

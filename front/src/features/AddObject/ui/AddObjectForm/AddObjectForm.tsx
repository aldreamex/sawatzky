import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { editWorkObject } from 'features/AddObject/model/services/services/editObject';
import { addWorkObjectFormActions } from '../../model/slice/addObjectSlice';
import {
  getWorkObjectFormAddress,
  getWorkObjectFormCode,
  getWorkObjectFormContractNumber,
  getWorkObjectFormData,
  getWorkObjectFormId,
  getWorkObjectFormIsEdit,
  getWorkObjectFormName,
  getWorkObjectGroupId,
} from '../../model/selectors/addObjectSelectors';
import { createWorkObject } from '../../model/services/services/createObject';
import cls from './AddObjectForm.module.scss';

interface AddObjectFormProps {
  className?: string;
}

export const AddObjectForm: React.FC<AddObjectFormProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  const name = useSelector(getWorkObjectFormName);
  const contractNumber = useSelector(getWorkObjectFormContractNumber);
  const code = useSelector(getWorkObjectFormCode);
  const address = useSelector(getWorkObjectFormAddress);
  const groupId = useSelector(getWorkObjectGroupId);
  const isEdit = useSelector(getWorkObjectFormIsEdit);
  const workObjectId = useSelector(getWorkObjectFormId);
  const formData = useSelector(getWorkObjectFormData);

  const onChangeNameHandler = useCallback((value: string) => {
    dispatch(addWorkObjectFormActions.setName(value));
  }, [dispatch]);

  const onChangeCodeHandler = useCallback((value: string) => {
    dispatch(addWorkObjectFormActions.setCode(value));
  }, [dispatch]);

  const onChangeAddressHandler = useCallback((value: string) => {
    dispatch(addWorkObjectFormActions.setAddress(value));
  }, [dispatch]);

  const onChangeContractNumberHandler = useCallback((value: string) => {
    dispatch(addWorkObjectFormActions.setContractNumber(value));
  }, [dispatch]);

  const onSaveHandler = useCallback(() => {
    if (isEdit && workObjectId) {
      dispatch(editWorkObject({
        ...formData,
        formData: {
          name: name ?? '',
          code: code ?? '',
          address: address ?? '',
          contractNumber: contractNumber ?? '',
        },
        workObjectId,
      }));
    } else if (formData) {
      dispatch(createWorkObject({
        workObjectGroup: +groupId!!,
        name,
        code,
        address,
        contractNumber,
      }));
    }
  }, [isEdit, workObjectId, formData, dispatch, name, code, address, contractNumber, groupId]);

  const { Form } = useForm({
    fields: [
      {
        id: 'name',
        type: FormType.TEXT,
        defaultValue: name ?? '',
        value: name ?? '',
        placeholder: 'Наименование объекта',
        onChange: onChangeNameHandler,
        rules: {
          required: true,
        },
      },
      {
        id: 'code',
        type: FormType.TEXT,
        defaultValue: code ?? '',
        value: code ?? '',
        placeholder: 'Код объекта',
        onChange: onChangeCodeHandler,
        rules: {
          required: true,
        },
      },
      {
        id: 'address',
        type: FormType.TEXT,
        defaultValue: address ?? '',
        value: address ?? '',
        placeholder: 'Адрес объекта',
        onChange: onChangeAddressHandler,
        rules: {
          required: true,
        },
      },
      {
        id: 'contractNumber',
        type: FormType.TEXT,
        defaultValue: contractNumber ?? '',
        value: contractNumber ?? '',
        placeholder: 'Номер контракта',
        onChange: onChangeContractNumberHandler,
        rules: {
          required: true,
        },
      },
    ].filter((field) => field !== null),
    onSubmit: onSaveHandler,
    submitTitle: !isEdit ? 'Создать' : 'Сохранить',
  });

  return (
    <div className={classNames(cls.addObjectForm, {}, [className])}>
      <Text title={`${isEdit ? 'Изменить' : 'Создать'} объект`} textAlign={TextAlign.CENTER} className={cls.title} />
      {Form}
    </div>
  );
};

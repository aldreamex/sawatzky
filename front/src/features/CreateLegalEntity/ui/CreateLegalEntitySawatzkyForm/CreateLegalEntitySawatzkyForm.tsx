import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { SelectOptionType } from 'shared/ui/Select/Select';
import { useSelector } from 'react-redux';
import { getWorkObjectGroup } from 'entities/WorkObjectGroup';
import { useCallback, useMemo } from 'react';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { validationPatterns } from 'shared/patterns/validationPatterns';
import {
  getCreateLegalEntityFormActualAddress,
  getCreateLegalEntityFormBank,
  getCreateLegalEntityFormBik,
  getCreateLegalEntityFormCorrespondentAccount,
  getCreateLegalEntityFormData,
  getCreateLegalEntityFormHead,
  getCreateLegalEntityFormINN,
  getCreateLegalEntityFormLegalAddress,
  getCreateLegalEntityFormMail,
  getCreateLegalEntityFormName,
  getCreateLegalEntityFormPhone,
  getCreateLegalEntityFormSettlementAccount,
  getCreateLegalEntityFormWorkObject,
  getCreateLegalEntityFormWorkObjectGroup,
  getCreateLegalEntityId,
  getCreateLegalEntityIsEdit,
} from '../../model/selectors/createLegalEntitySelectors';
import { createLegalEntityActions } from '../../model/slice/createLegalEntitySlice';
import { addLegalEntity } from '../../model/services/addLegalEntity';
import cls from './CreateLegalEntitySawatzkyForm.module.scss';
import { editLegalEntity } from '../../model/services/editLegalEntity';

interface CreateLegalEntitySawatzkyFormProps {
	className?: string;
  onClose?: () => void;
}

export const CreateLegalEntitySawatzkyForm: React.FC<CreateLegalEntitySawatzkyFormProps> = (props) => {
  const { className, onClose } = props;

  const dispatch = useAppDispatch();
  const formData = useSelector(getCreateLegalEntityFormData);

  const workObjectsGroup = useSelector(getCreateLegalEntityFormWorkObjectGroup);
  const workObject = useSelector(getCreateLegalEntityFormWorkObject);
  const isEdit = useSelector(getCreateLegalEntityIsEdit);
  const legalEntityId = useSelector(getCreateLegalEntityId);

  const name = useSelector(getCreateLegalEntityFormName);
  const head = useSelector(getCreateLegalEntityFormHead);
  const legalAddress = useSelector(getCreateLegalEntityFormLegalAddress);
  const actualAddress = useSelector(getCreateLegalEntityFormActualAddress);
  const phone = useSelector(getCreateLegalEntityFormPhone);
  const mail = useSelector(getCreateLegalEntityFormMail);
  const INN = useSelector(getCreateLegalEntityFormINN);
  const settlementAccount = useSelector(getCreateLegalEntityFormSettlementAccount);
  const correspondentAccount = useSelector(getCreateLegalEntityFormCorrespondentAccount);
  const bank = useSelector(getCreateLegalEntityFormBank);
  const bik = useSelector(getCreateLegalEntityFormBik);

  const workObjectsGroups = useSelector(getWorkObjectGroup.selectAll);

  const onChangeWorkObjectGroup = useCallback((item: SelectOptionType) => {
    dispatch(createLegalEntityActions.setWorkObjectsGroup(+item.value));
  }, [dispatch]);

  const onChangeWorkObject = useCallback((item: SelectOptionType) => {
    dispatch(createLegalEntityActions.setWorkObject(+item.value));
  }, [dispatch]);

  const onSubmitHandler = useCallback(() => {
    if (isEdit && legalEntityId) {
      dispatch(editLegalEntity({
        formData: {
          ...formData,
        },
        legalEntityId,
      }));
    } else if (formData) {
      dispatch(addLegalEntity(formData));
    }
  }, [dispatch, formData, isEdit, legalEntityId]);

  const onCloseHandler = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const workObjectOptions = useMemo(() => {
    const workObjects = workObjectsGroups.find((item) => item.id === workObjectsGroup)?.workObjects;
    if (workObjects) {
      return workObjects?.map((item) => ({
        value: item.id,
        text: item.name,
      }));
    }
    return undefined;
  }, [workObjectsGroups, workObjectsGroup]);

  const workObjectGroupOptions: SelectOptionType[] = workObjectsGroups.map((item) => ({ value: item.id, text: item.name }));

  const workObjectOption = useMemo(() => {
    if (workObject) {
      return workObjectOptions?.find((item) => item.value === workObject);
    }
    return undefined;
  }, [workObject, workObjectOptions]);

  const workObjectGroupOption = useMemo(() => {
    if (workObjectsGroup) {
      return workObjectGroupOptions?.find((item) => item.value === workObjectsGroup);
    }
    return undefined;
  }, [workObjectGroupOptions, workObjectsGroup]);

  const { Form } = useForm({
    fields: [
      {
        id: 'workObjectsGroup',
        type: FormType.SELECT,
        placeholder: 'Группа объектов',
        options: workObjectGroupOptions,
        value: workObjectGroupOption,
        rules: {
          required: true,
        },
        onChange: onChangeWorkObjectGroup,
      },
      {
        id: 'workObject',
        type: FormType.SELECT,
        placeholder: 'Объект',
        options: workObjectOptions,
        value: workObjectOption,
        isHidden: Boolean(!workObjectGroupOption),
        onChange: onChangeWorkObject,
        rules: {
          required: true,
        },
      },
      {
        id: 'name',
        type: FormType.TEXT,
        placeholder: 'Название',
        defaultValue: name,
        value: name,
        onChange: (value: string) => dispatch(createLegalEntityActions.setName(value)),
        rules: {
          required: true,
        },
      },
      {
        id: 'head',
        type: FormType.TEXT,
        placeholder: 'Руководитель',
        defaultValue: head,
        value: head,
        onChange: (value: string) => dispatch(createLegalEntityActions.setHead(value)),
        rules: {
          required: true,
        },
      },
      {
        id: 'legalAddress',
        type: FormType.TEXT,
        placeholder: 'Юридический адрес',
        defaultValue: legalAddress,
        value: legalAddress,
        onChange: (value: string) => dispatch(createLegalEntityActions.setLegalAddress(value)),
        rules: {
          required: true,
        },
      },
      {
        id: 'actualAddress',
        type: FormType.TEXT,
        placeholder: 'Фактический адрес',
        defaultValue: actualAddress,
        value: actualAddress,
        onChange: (value: string) => dispatch(createLegalEntityActions.setActualAddress(value)),
        rules: {
          required: true,
        },
      },
      {
        id: 'phone',
        type: FormType.TEXT,
        placeholder: 'Телефон',
        defaultValue: phone,
        value: phone,
        onChange: (value: string) => dispatch(createLegalEntityActions.setPhone(value)),
        rules: {
          required: true,
          pattern: validationPatterns.PHONE,
        },
      },
      {
        id: 'mail',
        type: FormType.TEXT,
        placeholder: 'E-mail',
        defaultValue: mail,
        value: mail,
        onChange: (value: string) => dispatch(createLegalEntityActions.setMail(value)),
        rules: {
          required: true,
          pattern: validationPatterns.EMAIL,
        },
      },
      {
        id: 'INN',
        type: FormType.TEXT,
        placeholder: 'ИНН/КПП',
        defaultValue: INN,
        value: INN,
        onChange: (value: string) => dispatch(createLegalEntityActions.setINN(value)),
        rules: {
          required: true,
        },
      },
      {
        id: 'settlementAccount',
        type: FormType.TEXT,
        placeholder: 'Расчётный счёт',
        defaultValue: settlementAccount,
        value: settlementAccount,
        onChange: (value: string) => dispatch(createLegalEntityActions.setSettlementAccount(value)),
        rules: {
          required: true,
        },
      },
      {
        id: 'correspondentAccount',
        type: FormType.TEXT,
        placeholder: 'Корреспондентский счёт',
        defaultValue: correspondentAccount,
        value: correspondentAccount,
        onChange: (value: string) => dispatch(createLegalEntityActions.setCorrespondentAccount(value)),
        rules: {
          required: true,
        },
      },
      {
        id: 'bank',
        type: FormType.TEXT,
        placeholder: 'Банк',
        defaultValue: bank,
        value: bank,
        onChange: (value: string) => dispatch(createLegalEntityActions.setBank(value)),
        rules: {
          required: true,
        },
      },
      {
        id: 'bik',
        type: FormType.TEXT,
        placeholder: 'БИК',
        defaultValue: bik,
        value: bik,
        onChange: (value: string) => dispatch(createLegalEntityActions.setBik(value)),
        rules: {
          required: true,
        },
      },
    ],
    onSubmit: onSubmitHandler,
    onCancel: onCloseHandler,
    submitTitle: isEdit ? 'Сохранить' : 'Создать',
  });

  return (
    <div className={classNames(cls.createLegalEntitySawatzkyForm, {}, [className])}>
      <Text title="Создать Юр. лицо Sawatzky" textAlign={TextAlign.CENTER} className={cls.title} />
      {
        Form
      }
    </div>
  );
};

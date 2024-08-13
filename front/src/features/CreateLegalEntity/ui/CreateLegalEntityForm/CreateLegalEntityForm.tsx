import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { SelectOptionType } from 'shared/ui/Select/Select';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import { getWorkObjectGroup } from 'entities/WorkObjectGroup';
import { getWorkTaskGroup } from 'entities/WorkTaskGroup';
import { getWorkMaterialGroup } from 'entities/WorkMaterialGroup';
import { useCallback, useMemo } from 'react';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { validationPatterns } from 'shared/patterns/validationPatterns';
import { editLegalEntity } from 'features/CreateLegalEntity/model/services/editLegalEntity';
import { Button, ButtonSize, ButtonThemes } from 'shared/ui/Button/Button';
import { RoutePath } from 'shared/config/RouteConfig/appRouteConfig';
import { useNavigate } from 'react-router-dom';
import cls from './CreateLegalEntityForm.module.scss';
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
  getCreateLegalEntityFormPrepayment,
  getCreateLegalEntityFormSettlementAccount,
  getCreateLegalEntityFormStatus,
  getCreateLegalEntityFormWorkMaterialGroups,
  getCreateLegalEntityFormWorkObject,
  getCreateLegalEntityFormWorkObjectGroup,
  getCreateLegalEntityFormWorkTaskGroups,
  getCreateLegalEntityId,
  getCreateLegalEntityIsEdit,
  getCreateLegalEntityIsView,
} from '../../model/selectors/createLegalEntitySelectors';
import { createLegalEntityActions } from '../../model/slice/createLegalEntitySlice';
import { addLegalEntity } from '../../model/services/addLegalEntity';

interface CreateLegalEntityFormProps {
  className?: string;
}

export const CreateLegalEntityForm: React.FC<CreateLegalEntityFormProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const formData = useSelector(getCreateLegalEntityFormData);
  const isEdit = useSelector(getCreateLegalEntityIsEdit);
  const isView = useSelector(getCreateLegalEntityIsView);
  const legalEntityId = useSelector(getCreateLegalEntityId);

  const workObjectsGroup = useSelector(getCreateLegalEntityFormWorkObjectGroup);
  const workObject = useSelector(getCreateLegalEntityFormWorkObject);
  const selectedWorkTaskGroups = useSelector(getCreateLegalEntityFormWorkTaskGroups);
  const selectedWorkMaterialGroups = useSelector(getCreateLegalEntityFormWorkMaterialGroups);

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
  const prepayment = useSelector(getCreateLegalEntityFormPrepayment);
  const status = useSelector(getCreateLegalEntityFormStatus);

  const workObjectsGroups = useSelector(getWorkObjectGroup.selectAll);
  const workTaskGroups = useSelector(getWorkTaskGroup.selectAll);
  const workMaterialGroups = useSelector(getWorkMaterialGroup.selectAll);

  const onChangeWorkObjectGroup = useCallback((item: SelectOptionType) => {
    dispatch(createLegalEntityActions.setWorkObjectsGroup(+item.value));
  }, [dispatch]);

  const onChangeWorkObject = useCallback((item: SelectOptionType) => {
    dispatch(createLegalEntityActions.setWorkObject(+item.value));
  }, [dispatch]);

  const onChangeWorkTaskGroups = useCallback((items: SelectOptionType[]) => {
    dispatch(createLegalEntityActions.setWorkTaskGroups(items.map((item) => +item.value)));
  }, [dispatch]);

  const onChangeWorkMaterialGroups = useCallback((items: SelectOptionType[]) => {
    dispatch(createLegalEntityActions.setWorkMaterialGroups(items.map((item) => +item.value)));
  }, [dispatch]);

  const onSubmitHandler = useCallback(() => {
    if (isEdit && legalEntityId) {
      dispatch(editLegalEntity({ formData, legalEntityId }));
    } else if (!isEdit && formData) {
      dispatch(addLegalEntity(formData));
    }
  }, [dispatch, formData, isEdit, legalEntityId]);

  const onClickHandler = useCallback(() => {
    navigate(`${RoutePath.statistic}${legalEntityId}`);
  }, [navigate, legalEntityId]);

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
  const workTaskGroupOptions: SelectOptionType[] = workTaskGroups.map((item) => ({ value: item.id, text: item.name }));
  const workMaterialGroupOptions: SelectOptionType[] = workMaterialGroups.map((item) => ({ value: item.id, text: item.name }));

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

  const selectedWorkTaskGroupOptions = useMemo(() => {
    if (selectedWorkTaskGroups) {
      return workTaskGroupOptions?.filter((item) => selectedWorkTaskGroups.find((object) => object === item.value));
    }
    return undefined;
  }, [workTaskGroupOptions, selectedWorkTaskGroups]);

  const selectedWorkMaterialGroupOptions = useMemo(() => {
    if (selectedWorkMaterialGroups) {
      return workMaterialGroupOptions?.filter((item) => selectedWorkMaterialGroups.find((object) => object === item.value));
    }
    return undefined;
  }, [workMaterialGroupOptions, selectedWorkMaterialGroups]);

  const { Form } = useForm({
    fields: [
      {
        id: 'workObjectsGroup',
        type: FormType.SELECT,
        placeholder: 'Группа объектов',
        options: workObjectGroupOptions,
        value: workObjectGroupOption,
        onChange: onChangeWorkObjectGroup,
        rules: {
          required: true,
        },
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
        id: 'workTaskGroups',
        type: FormType.MULTIPLE_SELECT,
        placeholder: 'Выбор нескольких категорий услуг',
        options: workTaskGroupOptions,
        value: selectedWorkTaskGroupOptions,
        onChange: onChangeWorkTaskGroups,
        rules: {
          required: true,
        },
      },
      {
        id: 'materialGroups',
        type: FormType.MULTIPLE_SELECT,
        placeholder: 'Выбор нескольких категорий материалов',
        options: workMaterialGroupOptions,
        value: selectedWorkMaterialGroupOptions,
        onChange: onChangeWorkMaterialGroups,
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
        onChange: (value) => dispatch(createLegalEntityActions.setName(value)),
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
        onChange: (value) => dispatch(createLegalEntityActions.setHead(value)),
        rules: {
        },
      },
      {
        id: 'legalAddress',
        type: FormType.TEXT,
        placeholder: 'Юридический адрес',
        defaultValue: legalAddress,
        value: legalAddress,
        onChange: (value) => dispatch(createLegalEntityActions.setLegalAddress(value)),
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
        onChange: (value) => dispatch(createLegalEntityActions.setActualAddress(value)),
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
        onChange: (value) => dispatch(createLegalEntityActions.setPhone(value)),
        rules: {
          required: false,
          pattern: validationPatterns.PHONE,
        },
      },
      {
        id: 'mail',
        type: FormType.TEXT,
        placeholder: 'E-mail',
        defaultValue: mail,
        value: mail,
        onChange: (value) => dispatch(createLegalEntityActions.setMail(value)),
        rules: {
          pattern: validationPatterns.EMAIL,
        },
      },
      {
        id: 'inn',
        type: FormType.TEXT,
        placeholder: 'ИНН/КПП',
        defaultValue: INN,
        value: INN,
        onChange: (value) => dispatch(createLegalEntityActions.setINN(value)),
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
        onChange: (value) => dispatch(createLegalEntityActions.setSettlementAccount(value)),
        rules: {
        },
      },
      {
        id: 'correspondentAccount',
        type: FormType.TEXT,
        placeholder: 'Корреспондентский счёт',
        defaultValue: correspondentAccount,
        value: correspondentAccount,
        onChange: (value) => dispatch(createLegalEntityActions.setCorrespondentAccount(value)),
        rules: {
        },
      },
      {
        id: 'bank',
        type: FormType.TEXT,
        placeholder: 'Банк',
        defaultValue: bank,
        value: bank,
        onChange: (value) => dispatch(createLegalEntityActions.setBank(value)),
        rules: {
        },
      },
      {
        id: 'bik',
        type: FormType.TEXT,
        placeholder: 'БИК',
        defaultValue: bik,
        value: bik,
        onChange: (value) => dispatch(createLegalEntityActions.setBik(value)),
        rules: {
        },
      },
      {
        id: 'prepayment',
        type: FormType.SWITCH,
        defaultValue: prepayment,
        value: prepayment,
        label: 'Работа по предоплате',
        onChange: (value) => dispatch(createLegalEntityActions.setPrepayment(value)),
        rules: {
        },
      },
      {
        id: 'status',
        type: FormType.SWITCH,
        defaultValue: true,
        value: status,
        label: 'Статус контрагента',
        onChange: (value) => dispatch(createLegalEntityActions.setStatus(value)),
        rules: {
        },
      },
    ],
    onSubmit: !isView ? onSubmitHandler : undefined,
    submitTitle: isEdit ? 'Сохранить' : 'Создать',
  });

  return (
    <div className={classNames(cls.createLegalEntityForm, {}, [className])}>
      <Text title={`${isEdit ? 'Изменить' : isView ? 'Карточка' : 'Создать'} контрагента (Юр. лиц Заказчиков)`} textAlign={TextAlign.CENTER} className={cls.title} />
      <div className={cls.body}>
        <div className={classNames(cls.column, {}, [cls.formColumn])}>
          {Form}
        </div>
        {
          (isView || isEdit) && (
            <div className={cls.column}>
              <Button theme={ButtonThemes.BLACK_BORDER} size={ButtonSize.M} onClick={onClickHandler}>
                Отчет о контрагенте
              </Button>
            </div>
          )
        }
      </div>
    </div>
  );
};

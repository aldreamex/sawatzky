import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { SelectOptionType } from 'shared/ui/Select/Select';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getLegalEntity } from 'entities/LegalEntity';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { EmployeeRole } from 'entities/Employee';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { validationPatterns } from 'shared/patterns/validationPatterns';
import { editEmployee } from 'features/CreateEmployee/model/services/editEmployee';
import {
  getCreateEmployeeFormData,
  getCreateEmployeeFormLegalEntity,
  getCreateEmployeeFormRole,
  getCreateEmployeeFormStatus,
  getCreateEmployeeId,
  getCreateEmployeeIsEdit,
  getCreateEmployeeIsView,
  getCreateEmployeeUser,
  getCreateEmployeeUserFormFio,
  getCreateEmployeeUserFormPassword,
  getCreateEmployeeUserFormPhoneNumber,
  getCreateEmployeeUserFormUsername,
} from '../../model/selectors/createEmployeeSelectors';
import { createEmployeeActions } from '../../model/slice/createEmployeeSlice';
import { EmployeeRoleOption } from '../../model/type/createEmployee';
import { createEmployee } from '../../model/services/createEmployee';
import cls from './CreateEmployeeForm.module.scss';

interface CreateEmployeeFormProps {
  className?: string;
}

export const CreateEmployeeForm: React.FC<CreateEmployeeFormProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  const legalEntities = useSelector(getLegalEntity.selectAll);
  const legalEntity = useSelector(getCreateEmployeeFormLegalEntity);
  const fio = useSelector(getCreateEmployeeUserFormFio);
  const employeeId = useSelector(getCreateEmployeeId);
  const phoneNumber = useSelector(getCreateEmployeeUserFormPhoneNumber);
  const username = useSelector(getCreateEmployeeUserFormUsername);
  const password = useSelector(getCreateEmployeeUserFormPassword);
  const role = useSelector(getCreateEmployeeFormRole);
  const status = useSelector(getCreateEmployeeFormStatus);
  const isEdit = useSelector(getCreateEmployeeIsEdit);
  const isView = useSelector(getCreateEmployeeIsView);

  const formData = useSelector(getCreateEmployeeFormData);
  const user = useSelector(getCreateEmployeeUser);
  const { isSawatzky, employee } = useUserData();

  const roles: EmployeeRoleOption[] = useMemo(() => {
    const roles = [
      {
        value: EmployeeRole.INITIATOR,
        text: 'Инициатор',
      },
    ];
    return roles;
  }, []);

  const onChangeLegalEntity = useCallback((item: SelectOptionType) => {
    dispatch(createEmployeeActions.setLegalEntity(+item.value));
  }, [dispatch]);
  const onChangeStatus = useCallback((value: boolean) => {
    dispatch(createEmployeeActions.setStatus(value));
  }, [dispatch]);
  const onChangeRole = useCallback((item: SelectOptionType) => {
    dispatch(createEmployeeActions.setRole(item.value.toString()));
  }, [dispatch]);

  const onChangeFio = useCallback((value: string) => {
    dispatch(createEmployeeActions.setFio(value));
  }, [dispatch]);
  const onChangePhoneNumber = useCallback((value: string) => {
    dispatch(createEmployeeActions.setPhoneNumber(value));
  }, [dispatch]);
  const onChangeUsername = useCallback((value: string) => {
    dispatch(createEmployeeActions.setUsername(value));
  }, [dispatch]);
  const onChangePassword = useCallback((value: string) => {
    dispatch(createEmployeeActions.setPassword(value));
  }, [dispatch]);

  const onSubmitForm = useCallback(() => {
    if (isEdit && employeeId) {
      dispatch(editEmployee({
        ...formData,
        user: {
          fio: user?.fio ?? '',
          phoneNumber: user?.phoneNumber ?? '',
        },
        employeeId,
      }));
    } else if (formData && user) {
      dispatch(createEmployee({ ...formData, user }));
    }
  }, [dispatch, formData, user, isEdit, employeeId]);

  const legalEntityOptions: SelectOptionType[] | undefined = useMemo(() => (
    legalEntities
      .filter((item) => (!isSawatzky ? item.id === Number(employee?.legalEntity) : true))
      .map((item) => ({ value: item.id ?? '', text: item.name ?? '' }
      ))), [legalEntities, isSawatzky, employee?.legalEntity]);

  const legalEntityOption = useMemo(() => {
    if (legalEntity) {
      return legalEntityOptions?.find((item) => item.value === legalEntity);
    }
    return undefined;
  }, [legalEntityOptions, legalEntity]);

  const roleOption = useMemo(() => {
    if (role) {
      return roles.find((item) => item.value === role);
    }
    return undefined;
  }, [role, roles]);

  // const docs: Document[] = [];

  const { Form } = useForm({
    fields: [
      {
        id: 'company',
        type: FormType.SELECT,
        placeholder: 'Компания',
        options: legalEntityOptions,
        value: legalEntityOption,
        onChange: onChangeLegalEntity,
        rules: {
          required: true,
        },
      },
      {
        id: 'fio',
        type: FormType.TEXT,
        placeholder: 'ФИО',
        defaultValue: fio,
        value: fio ?? '',
        onChange: onChangeFio,
        rules: {
          required: true,
          pattern: validationPatterns.FIO,
        },
      },
      {
        id: 'phone',
        type: FormType.TEXT,
        placeholder: 'Телефон',
        defaultValue: phoneNumber,
        value: phoneNumber ?? '',
        onChange: onChangePhoneNumber,
        rules: {
          required: true,
          pattern: validationPatterns.PHONE,
        },
      },
      {
        id: 'username',
        type: FormType.TEXT,
        placeholder: 'Логин (ivanov22)',
        defaultValue: username,
        value: username ?? '',
        onChange: onChangeUsername,
        rules: {
          required: true,
          pattern: validationPatterns.LOGIN,
        },
        otherProps: {
          disabled: isEdit,
        },
      },
      (!isEdit && !isView) ? {
        id: 'password',
        type: FormType.TEXT,
        placeholder: 'Пароль (Ivanov_22)',
        defaultValue: password,
        value: password ?? '',
        onChange: onChangePassword,
        rules: {
          required: true,
          pattern: validationPatterns.PASSWORD,
        },
      } : null as any,
      {
        id: 'roles',
        type: FormType.SELECT,
        placeholder: 'Роль',
        options: roles,
        value: roleOption ?? undefined,
        onChange: onChangeRole,
        rules: {
          required: true,
        },
      },
      isEdit ? {
        id: 'new_password',
        type: FormType.TEXT,
        placeholder: 'Новый пароль',
        defaultValue: password,
        value: password ?? '',
        onChange: onChangePassword,
        rules: {
          required: false,
        },
      } : null as any,
      isEdit ? {
        id: 'repeat_password',
        type: FormType.TEXT,
        placeholder: 'Повторение пароля',
        defaultValue: password,
        value: password ?? '',
        onChange: onChangePassword,
        rules: {
          required: false,
          equal: {
            id: 'new_password',
            message: 'Пароли не совпадают',
          },
        },
      } : null as any,
      {
        id: 'status',
        type: FormType.SWITCH,
        defaultValue: status,
        value: status,
        label: 'Статус сотрудника',
        onChange: onChangeStatus,
        rules: {
        },
      },
    ].filter((field) => field !== null),
    onSubmit: !isView ? onSubmitForm : undefined,
    submitTitle: !isEdit ? 'Создать' : 'Сохранить',
  });

  return (
    <div className={classNames(cls.CreateEmployeeForm, {}, [className])}>
      <Text className={cls.title} textAlign={TextAlign.CENTER} title={`${isEdit ? 'Изменить' : isView ? 'Карточка' : 'Создать'} представителя заказчика`} />
      {/* <Button
        className={cls.addBtn}
        theme={ButtonThemes.CLEAR_BLUE}
      >+ Добавить доверенность
      </Button> */}

      {/* {docs && (
        <DocList className={cls.docList} acts="acts" docs={docs} modal />
      )} */}
      {/* <Button
        className={cls.btn}
        theme={ButtonThemes.BLUE_SOLID}
        onClick={onSubmitForm}
      >Создать
      </Button> */}
      {Form}
    </div>
  );
};

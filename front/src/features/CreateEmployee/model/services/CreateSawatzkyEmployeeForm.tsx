import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { SelectOptionType } from 'shared/ui/Select/Select';
import {
  useCallback, useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { getWorkObjectGroup } from 'entities/WorkObjectGroup';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { EmployeeRole } from 'entities/Employee';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { validationPatterns } from 'shared/patterns/validationPatterns';
import { EmployeeRoleOption } from '../../model/type/createEmployee';
import {
  getCreateEmployeeId,
  getCreateEmployeeIsEdit,
  getCreateEmployeeSawatzkyFormData,
  getCreateEmployeeSawatzkyFormPosition,
  getCreateEmployeeSawatzkyFormRole,
  getCreateEmployeeSawatzkyFormStatus,
  getCreateEmployeeSawatzkyFormWorkObject,
  getCreateEmployeeSawatzkyFormWorkObjectGroup,
  getCreateEmployeeSawatzkyFormWorkingObjects,
  getCreateEmployeeUser,
  getCreateEmployeeUserFormFio,
  getCreateEmployeeUserFormPassword,
  getCreateEmployeeUserFormPhoneNumber,
  getCreateEmployeeUserFormUsername,
} from '../../model/selectors/createEmployeeSelectors';
import { createEmployeeActions } from '../../model/slice/createEmployeeSlice';
import cls from './CreateSawatzkyEmployeeForm.module.scss';
import { createSawatzkyEmployee } from '../../model/services/createSawatzkyEmployee';
import { editSawatzkyEmployee } from './editSawatzkyEmployee';

interface CreateSawatzkyEmployeeFormProps {
  className?: string;
}

export const CreateSawatzkyEmployeeForm: React.FC<CreateSawatzkyEmployeeFormProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  const workObjectGroup = useSelector(getCreateEmployeeSawatzkyFormWorkObjectGroup);
  const workObject = useSelector(getCreateEmployeeSawatzkyFormWorkObject);
  const workingObjects = useSelector(getCreateEmployeeSawatzkyFormWorkingObjects);
  const role = useSelector(getCreateEmployeeSawatzkyFormRole);
  const fio = useSelector(getCreateEmployeeUserFormFio);
  const phoneNumber = useSelector(getCreateEmployeeUserFormPhoneNumber);
  const username = useSelector(getCreateEmployeeUserFormUsername);
  const password = useSelector(getCreateEmployeeUserFormPassword);
  const position = useSelector(getCreateEmployeeSawatzkyFormPosition);
  const status = useSelector(getCreateEmployeeSawatzkyFormStatus);
  const formData = useSelector(getCreateEmployeeSawatzkyFormData);
  const workObjectGroups = useSelector(getWorkObjectGroup.selectAll);
  const user = useSelector(getCreateEmployeeUser);
  const isEdit = useSelector(getCreateEmployeeIsEdit);
  const employeeId = useSelector(getCreateEmployeeId);

  const onChangeWorkObjectGroup = useCallback((item: SelectOptionType) => {
    dispatch(createEmployeeActions.setWorkObjectGroup(+item.value));
  }, [dispatch]);

  const onChangeWorkObject = useCallback((item: SelectOptionType) => {
    dispatch(createEmployeeActions.setWorkObject(+item.value));
  }, [dispatch]);

  const onChangeRole = useCallback((item: SelectOptionType) => {
    dispatch(createEmployeeActions.setRole(item.value.toString()));
  }, [dispatch]);

  const onChangeWorkingObjects = useCallback((items: SelectOptionType[]) => {
    dispatch(createEmployeeActions.setWorkingObjects(items.map((item) => +item.value)));
  }, [dispatch]);

  const onChangeStatus = useCallback((value: boolean) => {
    dispatch(createEmployeeActions.setStatus(value));
  }, [dispatch]);

  const onSubmitForm = useCallback(() => {
    if (isEdit && employeeId) {
      dispatch(editSawatzkyEmployee({
        ...formData,
        user: {
          fio: user?.fio ?? '',
          phoneNumber: user?.phoneNumber ?? '',
        },
        employeeId,
      }));
    } else if (formData && user) {
      dispatch(createSawatzkyEmployee({ ...formData, user }));
    }
  }, [dispatch, formData, user, isEdit, employeeId]);

  const roles: EmployeeRoleOption[] = useMemo(() => {
    const roles = [
      {
        value: EmployeeRole.DISPATCHER,
        text: 'Диспетчер',
      },
      {
        value: EmployeeRole.PERFORMER,
        text: 'Исполнитель',
      },
      {
        value: EmployeeRole.DISPATCHER_PERFORMER,
        text: 'Диспетчер/Исполнитель',
      },
      {
        value: EmployeeRole.ADMIN,
        text: 'Администратор',
      },
    ];
    return roles;
  }, []);

  const workObjectOptions = useMemo(() => {
    const workObjects = workObjectGroups.find((item) => item.id === workObjectGroup)?.workObjects;
    if (workObjects) {
      return workObjects?.map((item) => ({
        value: item.id,
        text: item.name,
      }));
    }
    return undefined;
  }, [workObjectGroups, workObjectGroup]);
  const workObjectGroupOptions: SelectOptionType[] = workObjectGroups.map((item) => ({ value: item.id, text: item.name }));

  const workingObjectsOptions = useMemo(() => {
    if (workingObjects) {
      return workObjectOptions?.filter((item) => workingObjects.find((object) => object === item.value));
    }
    return undefined;
  }, [workingObjects, workObjectOptions]);

  const roleOption = useMemo(() => {
    if (role) {
      return roles.find((item) => item.value === role);
    }
    return undefined;
  }, [roles, role]);

  const workObjectOption = useMemo(() => {
    if (workObject) {
      return workObjectOptions?.find((item) => item.value === workObject);
    }
    return undefined;
  }, [workObject, workObjectOptions]);

  const workObjectGroupOption = useMemo(() => {
    if (workObjectGroup) {
      return workObjectGroupOptions?.find((item) => item.value === workObjectGroup);
    }
    return undefined;
  }, [workObjectGroupOptions, workObjectGroup]);

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
        id: 'fio',
        type: FormType.TEXT,
        placeholder: 'ФИО',
        defaultValue: fio,
        value: fio,
        onChange: (value: string) => dispatch(createEmployeeActions.setFio(value)),
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
        value: phoneNumber,
        onChange: (value: string) => dispatch(createEmployeeActions.setPhoneNumber(value)),
        rules: {
          required: true,
          pattern: validationPatterns.PHONE,
        },
      },
      !isEdit ? {
        id: 'username',
        type: FormType.TEXT,
        placeholder: 'Логин (ivanov22)',
        defaultValue: username,
        value: username ?? '',
        onChange: (value: string) => dispatch(createEmployeeActions.setUsername(value)),
        rules: {
          required: true,
          pattern: validationPatterns.LOGIN,
        },
      } : null as any,
      !isEdit ? {
        id: 'password',
        type: FormType.TEXT,
        placeholder: 'Пароль (Ivanov_22)',
        defaultValue: password,
        value: password ?? '',
        onChange: (value: string) => dispatch(createEmployeeActions.setPassword(value)),
        rules: {
          required: true,
          pattern: validationPatterns.PASSWORD,
        },
      } : null as any,
      {
        id: 'position',
        type: FormType.TEXT,
        placeholder: 'Должность',
        defaultValue: position,
        value: position,
        onChange: (value: string) => dispatch(createEmployeeActions.setPosition(value)),
        rules: {
          required: true,
        },
      },
      {
        id: 'roles',
        type: FormType.SELECT,
        placeholder: 'Роль',
        options: roles,
        value: roleOption ?? undefined,
        isHidden: Boolean(!workObject),
        onChange: onChangeRole,
        rules: {
          required: true,
        },
      },
      {
        id: 'objects',
        type: FormType.MULTIPLE_SELECT,
        placeholder: 'Выбор нескольких объектов',
        options: workObjectOptions,
        value: workingObjectsOptions,
        isHidden: Boolean(!roleOption),
        label: `${roleOption?.text} объектов`,
        onChange: onChangeWorkingObjects,
        rules: {
          required: true,
        },
      },
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
    onSubmit: onSubmitForm,
    submitTitle: 'Создать',
  });

  return (
    <div className={classNames(cls.addEmployeeForm, {}, [className])}>
      <Text title="Создать Сотрудника Sawatzky" textAlign={TextAlign.CENTER} className={cls.title} />

      {Form}
    </div>
  );
};

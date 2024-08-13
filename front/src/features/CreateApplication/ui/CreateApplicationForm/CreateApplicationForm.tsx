import { classNames } from 'shared/lib/classNames/classNames';
import { useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { RangePickerSelectedDays } from 'react-trip-date/dist/rangePicker/rangePicker.type';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import { fetchApplicationDetail } from 'pages/ApplicationDetailPage/model/services/fetchApplicationDetail/fetchApplicationDetail';
import { getEmployee } from 'entities/Employee';
import { SelectOptionType } from 'shared/ui/Select/Select';
import {
  getFormApplication,
  getFormApplicationDescription,
  getFormApplicationEndWorkDate,
  getFormApplicationStartWorkDate,
  getFormApplicationTitle,
  getFormApplicationSubject,
  getFormApplicationCalendarIsOpen,
  getFormApplicationIsEdit,
  getFormApplicationApplicationId,
  getFormApplicationClient,
} from '../../model/selectors/createApplicationSelectors';
import { createApplicationActions } from '../../model/slice/createApplicationSlice';
import cls from './CreateApplicationForm.module.scss';
import { saveApplication } from '../../model/serivces/saveApplication/saveApplication';
import { saveEditApplication } from '../../model/serivces/saveApplication/saveEditApplication';

interface CreateApplicationFormProps {
  className?: string;
  onClose?: () => void;
}

export const CreateApplicationForm: React.FC<CreateApplicationFormProps> = (props) => {
  const { className, onClose } = props;

  const {
    sawatzkyEmployee,
    isSawatzky, isAdmin, isDispatcher, isInitiator, isPerformer,
  } = useUserData();

  const allowEdit = useMemo(() => (isSawatzky && (isAdmin || isDispatcher) || isInitiator), [isSawatzky, isAdmin, isDispatcher, isInitiator]);
  const dispatch = useAppDispatch();
  const title = useSelector(getFormApplicationTitle);
  const subject = useSelector(getFormApplicationSubject);
  const description = useSelector(getFormApplicationDescription);
  const startWorkDate = useSelector(getFormApplicationStartWorkDate);
  const endWorkDate = useSelector(getFormApplicationEndWorkDate);
  const form = useSelector(getFormApplication);
  const isCalendarOpen = useSelector(getFormApplicationCalendarIsOpen);
  const isEdit = useSelector(getFormApplicationIsEdit);
  const applicationId = useSelector(getFormApplicationApplicationId);

  const changeSelectedDaysHandler = useCallback((dates: RangePickerSelectedDays) => {
    if (dates.from) {
      dispatch(createApplicationActions.setStartWorkDate(dates.from));
    }
    if (dates.to) {
      dispatch(createApplicationActions.setEndWorkDate(dates.to));
    }
  }, [dispatch]);

  const changeTitleHandler = useCallback((value: string) => {
    dispatch(createApplicationActions.setTitle(value));
  }, [dispatch]);
  const changeSubjectHandler = useCallback((value: string) => {
    dispatch(createApplicationActions.setSubject(value));
  }, [dispatch]);
  const changeDescriptionHandler = useCallback((value: string) => {
    dispatch(createApplicationActions.setDescription(value));
  }, [dispatch]);

  const clearWorkDatesHandler = useCallback(() => {
    dispatch(createApplicationActions.clearWorkDates());
  }, [dispatch]);

  const onCloseHandler = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const onFocusHandler = useCallback(() => {
    dispatch(createApplicationActions.clearWorkDates());
    dispatch(createApplicationActions.openCalendar());
  }, [dispatch]);

  const onCloseCalendar = () => {
    dispatch(createApplicationActions.closeCalendar());
  };

  // employee options для диспетчеров
  const employees = useSelector(getEmployee.selectAll);
  const employee = useSelector(getFormApplicationClient);

  const workObjectsId = sawatzkyEmployee?.workingObjects || [];
  const employeeOptions: SelectOptionType[] | undefined = useMemo(() => (
    employees
      .filter((item) => workObjectsId.includes(Number(item?.legalEntity?.workObject?.id)))
      .map((item) => ({ value: item.id ?? '', text: item.user.fio ?? '' }
      ))), [employees]);

  const employeeOption = useMemo(() => {
    if (employee) {
      return employeeOptions?.find((item) => item.value === employee);
    }
    return undefined;
  }, [employee, employeeOptions]);

  const changeEmployee = useCallback((item: SelectOptionType) => {
    dispatch(createApplicationActions.setClient(+item.value));
  }, [dispatch]);

  const onSaveHandler = useCallback(() => {
    if (isEdit && applicationId && form) {
      dispatch(saveEditApplication({
        formData: form,
        applicationId,
      }));
      dispatch(fetchApplicationDetail(applicationId));
      onCloseHandler();
    } else if (form) {
      dispatch(saveApplication(form));
      onCloseHandler();
    }
  }, [form, dispatch, applicationId, isEdit, onCloseHandler]);
  const { Form } = useForm({
    fields: [
      ...(isSawatzky && (isDispatcher || isAdmin) ? [
        {
          id: 'employee',
          type: FormType.SELECT,
          placeholder: 'Заказчик',
          options: employeeOptions,
          value: employeeOption,
          onChange: changeEmployee,
          rules: {
            required: true,
          },
        },
      ] : []),
      {
        id: 'name',
        type: FormType.TEXT,
        defaultValue: title,
        value: title,
        placeholder: 'Название запроса',
        onChange: changeTitleHandler,
        rules: {
          required: true,
        },
        otherProps: {
          disabled: !allowEdit,
        },
      },
      {
        id: 'subject',
        type: FormType.BIG_TEXT,
        defaultValue: subject,
        value: subject,
        placeholder: 'Предмет запроса',
        onChange: changeSubjectHandler,
        rules: {
          required: true,
        },
        otherProps: {
          disabled: !allowEdit,
        },
      },
      {
        id: 'description',
        type: FormType.BIG_TEXT,
        defaultValue: description,
        value: description,
        placeholder: 'Описание запроса',
        onChange: changeDescriptionHandler,
        rules: {
          required: true,
        },
        otherProps: {
          disabled: !allowEdit,
        },
      },
      {
        id: 'date',
        type: FormType.DATE,
        defaultValue: { from: startWorkDate, to: endWorkDate },
        value: { from: startWorkDate, to: endWorkDate },
        rules: {
          required: true,
        },
        onChange: changeSelectedDaysHandler,
        otherProps: {
          onClear: clearWorkDatesHandler,
          isFocused: isCalendarOpen,
          onCloseCalendar,
          onFocusHandler,
          disabled: !allowEdit,
        },
        placeholder: 'Желаемая дата проведения работ',
      },
    ],
    // onSubmit: !isSawatzky ? onSaveHandler : undefined,
    // onCancel: !isSawatzky ? onCloseHandler : undefined,
    onSubmit: allowEdit ? onSaveHandler : undefined,
    onCancel: allowEdit ? onCloseHandler : undefined,
    submitTitle: !isEdit ? 'Создать' : 'Сохранить',
  });

  return (
    <div className={classNames(cls.createApplicationForm, {}, [className])}>
      {
        !allowEdit
          ? <Text title={!isEdit ? 'Создание запроса' : 'Информация по запросу'} className={cls.title} textAlign={TextAlign.CENTER} />
          : <Text title={!isEdit ? 'Создание запроса' : 'Редактирование запроса'} text="Информация по запросу" className={cls.title} textAlign={TextAlign.CENTER} />
      }
      {
        Form
      }

    </div>
  );
};

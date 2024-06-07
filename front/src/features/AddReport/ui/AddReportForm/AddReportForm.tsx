import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { SelectOptionType } from 'shared/ui/Select/Select';
import { useSelector } from 'react-redux';
import { getWorkObjectGroup } from 'entities/WorkObjectGroup';
import { useCallback, useMemo } from 'react';
import {
  getAddReportFormCalendarIsOpen,
  getAddReportFormData,
  getAddReportFormEmployee,
  getAddReportFormEndWorkDate,
  getAddReportFormLegalEntity,
  getAddReportFormStartWorkDate,
  getAddReportFormStatus,
  getAddReportFormWorkObject,
  getAddReportFormWorkObjectGroup,
} from 'features/AddReport/model/selectors/addReportSelectors';
import { addReportActions } from 'features/AddReport/model/slice/addReportSlice';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { getLegalEntity } from 'entities/LegalEntity';
import { getEmployee } from 'entities/Employee';
import { CalendarThemes } from 'widgets/DateInput/ui/DateInput';
import { RangePickerSelectedDays } from 'react-trip-date/dist/rangePicker/rangePicker.type';
import { saveReport } from 'features/AddReport/model/services/saveReports';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { ApplicationStatusMessage } from 'entities/Application';
import cls from './AddReportForm.module.scss';

interface AddReportFormProps {
  className?: string;
}

export const AddReportForm: React.FC<AddReportFormProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  const formData = useSelector(getAddReportFormData);

  const workObjectsGroups = useSelector(getWorkObjectGroup.selectAll);
  const legalEntities = useSelector(getLegalEntity.selectAll);
  const employees = useSelector(getEmployee.selectAll);
  const workObjectsGroup = useSelector(getAddReportFormWorkObjectGroup);
  const workObject = useSelector(getAddReportFormWorkObject);
  const legalEntity = useSelector(getAddReportFormLegalEntity);
  const employee = useSelector(getAddReportFormEmployee);
  const isCalendarOpen = useSelector(getAddReportFormCalendarIsOpen);
  const startWorkDate = useSelector(getAddReportFormStartWorkDate);
  const endWorkDate = useSelector(getAddReportFormEndWorkDate);
  const statuses = Object.entries(ApplicationStatusMessage);
  const status = useSelector(getAddReportFormStatus);

  const onChangeWorkObjectGroup = useCallback((item: SelectOptionType) => {
    dispatch(addReportActions.setWorkObjectsGroup(+item.value));
  }, [dispatch]);

  const onChangeWorkObject = useCallback((item: SelectOptionType) => {
    dispatch(addReportActions.setWorkObject(+item.value));
  }, [dispatch]);

  const onChangeLegalEntity = useCallback((item: SelectOptionType) => {
    dispatch(addReportActions.setLegalEntity(+item.value));
  }, [dispatch]);

  const onChangeEmployee = useCallback((item: SelectOptionType) => {
    dispatch(addReportActions.setEmployee(+item.value));
  }, [dispatch]);

  const onChangeStatus = useCallback((item: any) => dispatch(addReportActions.setStatus(item.value)), [dispatch]);

  const onFocusHandler = useCallback(() => {
    dispatch(addReportActions.clearWorkDates());
    dispatch(addReportActions.openCalendar());
  }, [dispatch]);

  const onCloseCalendar = () => {
    dispatch(addReportActions.closeCalendar());
  };

  const changeSelectedDaysHandler = useCallback((dates: RangePickerSelectedDays) => {
    if (dates.from) {
      dispatch(addReportActions.setStartWorkDate(dates.from));
    }
    if (dates.to) {
      dispatch(addReportActions.setEndWorkDate(dates.to));
    }
  }, [dispatch]);

  const clearWorkDatesHandler = useCallback(() => {
    dispatch(addReportActions.clearWorkDates());
  }, [dispatch]);

  const onSaveHandler = useCallback(() => {
    if (formData) {
      dispatch(saveReport(formData));
      dispatch(addReportActions.clearForm());
    }
  }, [formData, dispatch]);

  const workObjectGroupOptions: SelectOptionType[] = workObjectsGroups.map((item) => ({ value: item.id, text: item.name }));

  const workObjectGroupOption = useMemo(() => {
    if (workObjectsGroup) {
      return workObjectGroupOptions?.find((item) => item.value === workObjectsGroup);
    }
    return undefined;
  }, [workObjectGroupOptions, workObjectsGroup]);

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

  const workObjectOption = useMemo(() => {
    if (workObject) {
      return workObjectOptions?.find((item) => item.value === workObject);
    }
    return undefined;
  }, [workObject, workObjectOptions]);

  const legalEntityOptions: SelectOptionType[] | undefined = useMemo(() => (
    legalEntities.filter((item) => item.workObject?.id === workObjectOption?.value)
      .map((item) => ({ value: item.id ?? '', text: item.name ?? '' }
      ))), [legalEntities, workObjectOption?.value]);

  const legalEntityOption = useMemo(() => {
    if (legalEntity) {
      return legalEntityOptions?.find((item) => item.value === legalEntity);
    }
    return undefined;
  }, [legalEntity, legalEntityOptions]);

  const employeeOptions: SelectOptionType[] | undefined = useMemo(() => (
    employees.map((item) => ({ value: item.id ?? '', text: item.user.fio ?? '' }
    ))), [employees]);

  const employeeOption = useMemo(() => {
    if (employee) {
      return employeeOptions?.find((item) => item.value === employee);
    }
    return undefined;
  }, [employeeOptions, employee]);

  const statusOptions: SelectOptionType[] = statuses.map((item) => ({ value: item[0], text: item[1] }));

  const statusOption = useMemo(() => statusOptions?.find((item) => item.value === status), [status, statusOptions]);

  const { Form } = useForm({
    fields: [
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
          theme: CalendarThemes.DOWN,
          startDay: false,
        },
        placeholder: 'Период',
      },
      {
        id: 'objectGroups',
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
        id: 'objects',
        type: FormType.SELECT,
        placeholder: 'Объекты',
        options: workObjectOptions,
        value: workObjectOption,
        onChange: onChangeWorkObject,
        rules: {
          required: true,
        },
      },
      {
        id: 'legalEntity',
        type: FormType.SELECT,
        placeholder: 'Контрагенты',
        options: legalEntityOptions,
        value: legalEntityOption,
        onChange: onChangeLegalEntity,
        rules: {
          required: true,
        },
      },
      {
        id: 'employee',
        type: FormType.SELECT,
        placeholder: 'Заказчики',
        options: employeeOptions,
        value: employeeOption,
        onChange: onChangeEmployee,
        rules: {
          required: true,
        },
      },
      {
        id: 'status',
        type: FormType.SELECT,
        placeholder: 'Статус',
        options: statusOptions,
        value: statusOption,
        onChange: onChangeStatus,
        rules: {
          required: true,
        },
      },
    ],
    onSubmit: onSaveHandler,
    submitTitle: 'Создать',
  });

  return (
    <div className={classNames(cls.addReportForm, {}, [className])}>
      <Text className={cls.title} title="Создать новый отчет" textAlign={TextAlign.CENTER} />
      {Form}
    </div>
  );
};

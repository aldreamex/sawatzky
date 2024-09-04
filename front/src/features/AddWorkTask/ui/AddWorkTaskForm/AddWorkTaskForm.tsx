import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useCallback } from 'react';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { validationPatterns } from 'shared/patterns/validationPatterns';
import { editWorkTask } from 'features/AddWorkTask/model/services/editWorkTask';
import { getTotalTime } from 'shared/lib/getTotalTime/getTotalTime';
import {
  getAddWorkTaskForm,
  getAddWorkTaskFormId,
  getAddWorkTaskHours,
  getAddWorkTaskIsEdit,
  getAddWorkTaskMinutes,
  getAddWorkTaskName, getAddWorkTaskPrice, getAddWorkTaskStatus,
} from '../../model/selectors/addWorkTaskFormSelectors';
import { addWorkTaskFormActions } from '../../model/slice/addWorkTaskFormSlice';
import { createWorkTask } from '../../model/services/createWorkTask';
import cls from './AddWorkTaskForm.module.scss';

interface AddWorkTaskFormProps {
  className?: string;
  groupId?: number;
  onClose?: () => void;
}

export const AddWorkTaskForm: React.FC<AddWorkTaskFormProps> = (props) => {
  const { className, groupId } = props;

  const name = useSelector(getAddWorkTaskName);
  const price = useSelector(getAddWorkTaskPrice);
  const status = useSelector(getAddWorkTaskStatus);
  const hours = useSelector(getAddWorkTaskHours);
  const minutes = useSelector(getAddWorkTaskMinutes);
  const isEdit = useSelector(getAddWorkTaskIsEdit);
  const workTaskId = useSelector(getAddWorkTaskFormId);
  const formData = useSelector(getAddWorkTaskForm);

  const dispatch = useAppDispatch();

  const onNameChangeHandler = useCallback((value: string) => {
    dispatch(addWorkTaskFormActions.setName(value));
  }, [dispatch]);

  const onPriceChangeHandler = useCallback((value: number) => {
    dispatch(addWorkTaskFormActions.setPrice(value));
  }, [dispatch]);

  // const onTimeChangeHandler = useCallback((value: string) => {
  //   dispatch(addWorkTaskFormActions.setTime(value));
  // }, [dispatch]);

  const onHoursChangeHandler = useCallback((value: number) => {
    dispatch(addWorkTaskFormActions.setHours(value));
  }, [dispatch]);

  const onMinutesChangeHandler = useCallback((value: number) => {
    dispatch(addWorkTaskFormActions.setMinutes(value));
  }, [dispatch]);

  const onStatusChangeHandler = useCallback((value: boolean) => {
    dispatch(addWorkTaskFormActions.setStatus(value));
  }, [dispatch]);

  const onSaveHandler = useCallback(() => {
    if (isEdit && workTaskId) {
      dispatch(editWorkTask({
        ...formData,
        formData: {
          name: name ?? '',
          price: price ?? undefined,
          status: status ?? undefined,
          hours: hours ?? undefined,
          minutes: minutes ?? undefined,
          time: getTotalTime(hours ?? 0, minutes ?? 0),
          workTaskGroup: groupId,
        },
        workTaskId,
      }));
    } else {
      dispatch(createWorkTask({
        name,
        price,
        workTaskGroup: groupId,
        status,
        hours,
        minutes,
        time: getTotalTime(hours ?? 0, minutes ?? 0),
      }));
    }
  }, [isEdit, workTaskId, dispatch, name, price, groupId, status, hours, minutes, formData]);

  const { Form } = useForm({
    fields: [
      {
        id: 'name',
        type: FormType.TEXT,
        defaultValue: name,
        value: name,
        placeholder: 'Название услуги',
        onChange: onNameChangeHandler,
        rules: {
          required: true,
        },
      },
      {
        id: 'price',
        type: FormType.TEXT,
        defaultValue: price,
        value: price,
        placeholder: '500 руб.',
        label: 'Стоимость часа',
        onChange: onPriceChangeHandler,
        rules: {
          required: true,
          pattern: validationPatterns.NUMBER,
        },
      },
      // {
      //   id: 'time',
      //   type: FormType.TEXT,
      //   defaultValue: time,
      //   value: time,
      //   placeholder: '1ч 20мин',
      //   label: 'Рекомендованный срок выполнения работ',
      //   onChange: onTimeChangeHandler,
      //   rules: {
      //     required: true,
      //     pattern: validationPatterns.TERM,
      //   },
      // },
      {
        id: 'hours',
        type: FormType.TEXT,
        defaultValue: hours,
        value: hours,
        placeholder: '1ч',
        label: 'Рекомендованный срок в часах',
        onChange: onHoursChangeHandler,
        rules: {
          required: true,
          pattern: validationPatterns.NUMBER,
        },
      },
      {
        id: 'minutes',
        type: FormType.TEXT,
        defaultValue: minutes,
        value: minutes,
        placeholder: '20мин',
        label: 'Рекомендованный срок в минутах',
        onChange: onMinutesChangeHandler,
        rules: {
          required: true,
          pattern: validationPatterns.NUMBER,
        },
      },
      {
        id: 'status',
        type: FormType.SWITCH,
        defaultValue: status,
        value: status,
        label: 'Статус услуги',
        onChange: onStatusChangeHandler,
        rules: {
          required: true,
        },
      },
    ].filter((field) => field !== null),
    onSubmit: onSaveHandler,
    submitTitle: !isEdit ? 'Создать' : 'Сохранить',
  });

  return (
    <div className={classNames(cls.AddWorkTaskForm, {}, [className])}>
      <Text title={`${isEdit ? 'Изменить' : 'Создать'} услугу`} textAlign={TextAlign.CENTER} className={cls.title} />
      {
        Form
      }
    </div>
  );
};

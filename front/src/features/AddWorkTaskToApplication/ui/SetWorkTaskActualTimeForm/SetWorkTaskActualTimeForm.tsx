import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useCallback } from 'react';
import { WorkTaskGroupItem } from 'entities/WorkTaskGroup';
import { useSelector } from 'react-redux';
import { getTime } from 'shared/lib/helpers/getTime';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { validationPatterns } from 'shared/patterns/validationPatterns';
import { getTotalTime } from 'shared/lib/getTotalTime/getTotalTime';
import { addWorkTaskApplicationFormActions } from '../../model/slice/addWorkTaskApplicationFormSlice';
import {
  getAddWorkTaskApplicationFormData,
  getAddWorkTaskApplicationFormDataHours,
  getAddWorkTaskApplicationFormDataMinutes,
  getAddWorkTaskApplicationFormSelectedItem,
} from '../../model/selectors/addWorkTaskApplicationFormSelectors';
import { addWorkTaskToApplication } from '../../model/services/addWorkTaskToApplication';
import cls from './SetWorkTaskActualTimeForm.module.scss';

interface SetWorkTaskActualTimeFormProps {
  className?: string;
  onClose?: () => void;
  workTaskGroups?: WorkTaskGroupItem[];
}

export const SetWorkTaskActualTimeForm: React.FC<SetWorkTaskActualTimeFormProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  const selectedItem = useSelector(getAddWorkTaskApplicationFormSelectedItem);
  const formData = useSelector(getAddWorkTaskApplicationFormData);
  const hours = useSelector(getAddWorkTaskApplicationFormDataHours);
  const minutes = useSelector(getAddWorkTaskApplicationFormDataMinutes);

  const onSaveHandler = useCallback(() => {
    if (formData && selectedItem) {
      dispatch(addWorkTaskToApplication({
        ...formData,
        workTask: {
          actualTime: getTotalTime(hours ? +hours : 0, minutes ? +minutes : 0),
          workTask: selectedItem.id,
        },
      }));
    }
  }, [formData, dispatch, hours, minutes, selectedItem]);

  const onChangeHourshandler = useCallback((value: string) => {
    dispatch(addWorkTaskApplicationFormActions.setHours(value));
  }, [dispatch]);

  const onChangeMinutesHandler = useCallback((value: string) => {
    dispatch(addWorkTaskApplicationFormActions.setMinutes(value));
  }, [dispatch]);

  const onBackHandler = useCallback(() => {
    dispatch(addWorkTaskApplicationFormActions.setChoseStep());
  }, [dispatch]);

  const { Form } = useForm({
    fields: [
      {
        id: 'hours',
        type: FormType.TEXT,
        defaultValue: hours,
        value: hours,
        placeholder: `Рекомендуемое время выполнения работы: ${getTime(selectedItem?.time ?? 0).hours}`,
        label: `Часы на выполнение "${selectedItem?.name}" :`,
        onChange: onChangeHourshandler,
        rules: {
          pattern: validationPatterns.NUMBER,
        },
      },
      {
        id: 'minutes',
        type: FormType.TEXT,
        defaultValue: minutes,
        value: minutes,
        placeholder: `Рекомендуемое время выполнения работы: ${getTime(selectedItem?.time ?? 0).minuts}`,
        label: `Минуты на выполнение "${selectedItem?.name}"`,
        onChange: onChangeMinutesHandler,
        rules: {
          pattern: validationPatterns.NUMBER,
        },
      },
    ],
    onSubmit: onSaveHandler,
    onCancel: onBackHandler,
    cancelTitle: 'Назад',
  });

  return (
    <div className={classNames(cls.setWorkTaskActualTimeForm, {}, [className])}>
      <Text title="Выбор услуги" textAlign={TextAlign.CENTER} className={cls.title} />

      {Form}
    </div>
  );
};

import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useCallback } from 'react';
import { WorkMaterialGroupItem } from 'entities/WorkMaterialGroup';
import { useSelector } from 'react-redux';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { validationPatterns } from 'shared/patterns/validationPatterns';
import {
  getAddWorkMaterialApplicationFormActualCountText,
  getAddWorkMaterialApplicationFormData,
  getAddWorkMaterialApplicationFormSelectedItem,
} from '../../model/selectors/addWorkMaterialApplicationFormSelectors';
import { addWorkMaterialApplicationFormActions } from '../../model/slice/addWorkMaterialApplicationFormSlice';
import { addWorkMaterialToApplication } from '../../model/services/addWorkMaterialToApplication';
import cls from './SetWorkMaterialActualCountForm.module.scss';

interface SetWorkMaterialActualCountFormProps {
  className?: string;
  onClose?: () => void;
  workMaterialGroups?: WorkMaterialGroupItem[];

}

export const SetWorkMaterialActualCountForm: React.FC<SetWorkMaterialActualCountFormProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  const selectedItem = useSelector(getAddWorkMaterialApplicationFormSelectedItem);
  const actualCountText = useSelector(getAddWorkMaterialApplicationFormActualCountText);
  const formData = useSelector(getAddWorkMaterialApplicationFormData);

  const onSaveHandler = useCallback(() => {
    if (formData && selectedItem && actualCountText) {
      dispatch(addWorkMaterialToApplication({
        ...formData,
        workMaterial: {
          actualCount: +actualCountText,
          workMaterial: selectedItem.id,
        },
      }));
    }
  }, [formData, dispatch, actualCountText, selectedItem]);

  const onChangeHandler = useCallback((value: string) => {
    dispatch(addWorkMaterialApplicationFormActions.setActualCountText(value));
  }, [dispatch]);

  const onBackHandler = useCallback(() => {
    dispatch(addWorkMaterialApplicationFormActions.setChoseStep());
  }, [dispatch]);

  const { Form } = useForm({
    fields: [
      {
        id: 'name',
        type: FormType.TEXT,
        defaultValue: actualCountText,
        value: actualCountText,
        placeholder: `Рекомендуемое количество материала: ${selectedItem?.count}`,
        onChange: onChangeHandler,
        label: `Количество материала "${selectedItem?.name}" :`,
        rules: {
          required: true,
          pattern: validationPatterns.NUMBER,
        },
      },
    ],
    onSubmit: onSaveHandler,
    onCancel: onBackHandler,
    cancelTitle: 'Назад',
  });

  return (
    <div className={classNames(cls.setWorkMaterialActualCountForm, {}, [className])}>
      <Text title="Выбор услуги" textAlign={TextAlign.CENTER} className={cls.title} />
      {Form}
    </div>
  );
};

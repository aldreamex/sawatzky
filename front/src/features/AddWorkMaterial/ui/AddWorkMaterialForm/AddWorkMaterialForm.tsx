import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useCallback } from 'react';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { validationPatterns } from 'shared/patterns/validationPatterns';
import { editWorkMaterial } from 'features/AddWorkMaterial/model/services/editWorkMaterial';
import {
  getAddWorkMaterialCount,
  getAddWorkMaterialForm,
  getAddWorkMaterialFormIsEdit,
  getAddWorkMaterialId,
  getAddWorkMaterialName,
  getAddWorkMaterialPrice,
  getAddWorkMaterialStatus,
} from '../../model/selectors/addWorkMaterialFormSelectors';
import { addWorkMaterialFormActions } from '../../model/slice/addWorkMaterialFormSlice';
import { createWorkMaterial } from '../../model/services/createWorkMaterial';
import cls from './AddWorkMaterialForm.module.scss';

interface AddWorkMaterialFormProps {
  className?: string;
  groupId?: number;
  onClose?: () => void;
}

export const AddWorkMaterialForm: React.FC<AddWorkMaterialFormProps> = (props) => {
  const { className, groupId } = props;

  const name = useSelector(getAddWorkMaterialName);
  const price = useSelector(getAddWorkMaterialPrice);
  const count = useSelector(getAddWorkMaterialCount);
  const status = useSelector(getAddWorkMaterialStatus);
  const formData = useSelector(getAddWorkMaterialForm);
  const isEdit = useSelector(getAddWorkMaterialFormIsEdit);
  const workMaterialId = useSelector(getAddWorkMaterialId);

  const dispatch = useAppDispatch();

  const onNameChangeHandler = useCallback((value: string) => {
    dispatch(addWorkMaterialFormActions.setName(value));
  }, [dispatch]);

  const onPriceChangeHandler = useCallback((value: number) => {
    dispatch(addWorkMaterialFormActions.setPrice(value));
  }, [dispatch]);

  const onCountChangeHandler = useCallback((value: number) => {
    dispatch(addWorkMaterialFormActions.setCount(value));
  }, [dispatch]);

  const onStatusChangeHandler = useCallback((value: boolean) => {
    dispatch(addWorkMaterialFormActions.setStatus(value));
  }, [dispatch]);

  const onSaveHandler = useCallback(() => {
    if (isEdit && workMaterialId) {
      dispatch(editWorkMaterial({
        ...formData,
        formData: {
          name: name ?? '',
          count: count ?? undefined,
          price: price ?? undefined,
          status: status ?? undefined,
          workMaterialGroup: groupId,
        },
        workMaterialId,
      }));
    } else {
      dispatch(createWorkMaterial({
        name,
        price,
        workMaterialGroup: groupId,
        status,
        count,
      }));
    }
  }, [isEdit, workMaterialId, dispatch, name, price, groupId, status, count, formData]);

  const { Form } = useForm({
    fields: [
      {
        id: 'name',
        type: FormType.TEXT,
        defaultValue: name,
        value: name,
        placeholder: 'Название материала',
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
        label: 'Стоимость материала за шт.',
        onChange: onPriceChangeHandler,
        rules: {
          required: true,
          pattern: validationPatterns.NUMBER,
        },
      },
      {
        id: 'count',
        type: FormType.TEXT,
        defaultValue: count,
        value: count,
        placeholder: '10',
        label: 'Рекомендованное количество материала, шт.',
        onChange: onCountChangeHandler,
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
        label: 'Статус материала',
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
    <div className={classNames(cls.AddWorkMaterialForm, {}, [className])}>
      <Text title={`${isEdit ? 'Изменить' : 'Создать'} материал`} textAlign={TextAlign.CENTER} className={cls.title} />
      {
        Form
      }
    </div>
  );
};

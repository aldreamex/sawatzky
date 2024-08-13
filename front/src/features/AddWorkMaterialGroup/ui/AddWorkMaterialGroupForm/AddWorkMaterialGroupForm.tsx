import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useCallback } from 'react';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { editWorkMaterialGroup } from 'features/AddWorkMaterialGroup/model/services/editWorkMaterialGroup';
import {
  getAddWorkMaterialGroupFormData, getAddWorkMaterialGroupFormId, getAddWorkMaterialGroupFormIsEdit, getAddWorkMaterialGroupFormName,
} from '../../model/selectors/addWorkMaterialGroupFormSelectors';
import cls from './AddWorkMaterialGroupForm.module.scss';
import { addWorkMaterialGroupFormActions } from '../../model/slice/addWorkMaterialGroupFormSlice';
import { createWorkMaterialGroup } from '../../model/services/createWorkMaterialGroup';

interface AddWorkMaterialGroupFormProps {
  className?: string;
  onClose?: () => void;
}

export const AddWorkMaterialGroupForm: React.FC<AddWorkMaterialGroupFormProps> = (props) => {
  const { className } = props;

  const formData = useSelector(getAddWorkMaterialGroupFormData);
  const name = useSelector(getAddWorkMaterialGroupFormName);
  const isEdit = useSelector(getAddWorkMaterialGroupFormIsEdit);
  const workMaterialId = useSelector(getAddWorkMaterialGroupFormId);
  const dispatch = useAppDispatch();

  const onNameChangeHandler = useCallback((value: string) => {
    dispatch(addWorkMaterialGroupFormActions.setFormData({
      name: value,
    }));
  }, [dispatch]);

  const onSaveHandler = useCallback(() => {
    if (isEdit && workMaterialId) {
      dispatch(editWorkMaterialGroup({
        ...formData,
        formData: {
          name: name ?? '',
        },
        workMaterialId,
      }));
    } else if (formData) {
      dispatch(createWorkMaterialGroup(formData));
    }
  }, [isEdit, workMaterialId, formData, dispatch, name]);

  const { Form } = useForm({
    fields: [
      {
        id: 'name',
        type: FormType.TEXT,
        defaultValue: formData?.name,
        value: formData?.name,
        placeholder: 'Наименование группы',
        onChange: onNameChangeHandler,
        rules: {
          required: true,
        },
      },
    ].filter((field) => field !== null),
    onSubmit: onSaveHandler,
    submitTitle: !isEdit ? 'Создать' : 'Сохранить',
  });

  return (
    <div className={classNames(cls.addWorkMaterialGroupForm, {}, [className])}>
      <Text title={`${isEdit ? 'Изменить' : 'Создать'} группу материалов`} textAlign={TextAlign.CENTER} className={cls.title} />

      {Form}
    </div>
  );
};

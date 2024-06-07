import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { useSelector } from 'react-redux';
import {
  getAddWorkTaskGroupFormData, getWorkTaskGroupFormId, getWorkTaskGroupFormIsEdit, getWorkTaskGroupFormName,
} from 'features/AddWorkTaskGroup/model/selectors/addWorkTaskGroupFormSelectors';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useCallback } from 'react';
import { addWorkTaskGroupFormActions } from 'features/AddWorkTaskGroup/model/slice/addWorkTaskGroupFormSlice';
import { createWorkTaskGroup } from 'features/AddWorkTaskGroup/model/services/createWorkTaskGroup';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { editWorkTaskGroup } from 'features/AddWorkTaskGroup/model/services/editWorkTaskGroup';
import cls from './AddWorkTaskGroupForm.module.scss';

interface AddWorkTaskGroupFormProps {
  className?: string;
  onClose?: () => void;
}

export const AddWorkTaskGroupForm: React.FC<AddWorkTaskGroupFormProps> = (props) => {
  const { className } = props;

  const formData = useSelector(getAddWorkTaskGroupFormData);
  const name = useSelector(getWorkTaskGroupFormName);
  const isEdit = useSelector(getWorkTaskGroupFormIsEdit);
  const workTaskGroupId = useSelector(getWorkTaskGroupFormId);
  const dispatch = useAppDispatch();

  const onNameChangeHandler = useCallback((value: string) => {
    dispatch(addWorkTaskGroupFormActions.setFormData({
      name: value,
    }));
  }, [dispatch]);

  const onSaveHandler = useCallback(() => {
    if (isEdit && workTaskGroupId) {
      dispatch(editWorkTaskGroup({
        ...formData,
        formData: {
          name: name ?? '',
        },
        workTaskGroupId,
      }));
    } else if (formData) {
      dispatch(createWorkTaskGroup(formData));
    }
  }, [isEdit, workTaskGroupId, formData, dispatch, name]);

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
    <div className={classNames(cls.addWorkTaskGroupForm, {}, [className])}>
      <Text title={`${isEdit ? 'Изменить' : 'Создать'} группу услуг`} textAlign={TextAlign.CENTER} className={cls.title} />

      {Form}
    </div>
  );
};

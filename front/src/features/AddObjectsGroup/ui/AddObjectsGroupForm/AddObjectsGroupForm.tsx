import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { editWorkObjectGroup } from 'features/AddObjectsGroup/model/services/services/editWorkObjectGroup';
import { addWorkObjectGroupFormActions } from '../../model/slice/addWorkObjectGroupSlice';
import {
  getWorkObjectGroupFormData, getWorkObjectGroupFormId, getWorkObjectGroupFormIsEdit, getWorkObjectGroupFormName,
} from '../../model/selectors/addWorkObjectGroupSelectors';
import { createWorkObjectGroup } from '../../model/services/services/createWorkObjectGroup';
import cls from './AddObjectsGroupForm.module.scss';

interface AddObjectsGroupFormProps {
  className?: string;
}

export const AddObjectsGroupForm: React.FC<AddObjectsGroupFormProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  const name = useSelector(getWorkObjectGroupFormName);
  const formData = useSelector(getWorkObjectGroupFormData);
  const isEdit = useSelector(getWorkObjectGroupFormIsEdit);
  const workObjectGroupId = useSelector(getWorkObjectGroupFormId);

  const onChangeNameHandler = useCallback((value: string) => {
    dispatch(addWorkObjectGroupFormActions.setName(value));
  }, [dispatch]);

  const onSaveHandler = useCallback(() => {
    if (isEdit && workObjectGroupId) {
      dispatch(editWorkObjectGroup({
        ...formData,
        formData: {
          name: name ?? '',
        },
        workObjectGroupId,
      }));
    } else if (formData && name) { dispatch(createWorkObjectGroup({ name })); }
  }, [isEdit, workObjectGroupId, formData, name, dispatch]);

  const { Form } = useForm({
    fields: [
      {
        id: 'ObjectsGroup',
        type: FormType.TEXT,
        defaultValue: name,
        value: name,
        placeholder: 'Наименование группы объектов',
        onChange: onChangeNameHandler,
        rules: {
          required: true,
        },
      },
    ].filter((field) => field !== null),
    onSubmit: onSaveHandler,
    submitTitle: !isEdit ? 'Создать' : 'Сохранить',
  });

  return (
    <div className={classNames(cls.addObjectsGroupForm, {}, [className])}>
      <Text title={`${isEdit ? 'Изменить' : 'Создать'} группу объектов`} textAlign={TextAlign.CENTER} className={cls.title} />

      {Form}
    </div>
  );
};

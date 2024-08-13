import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { SelectOptionType } from 'shared/ui/Select/Select';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { addDocumentFormActions } from 'features/AddDocument/model/slice/addDocumentFormSlice';
import { useParams } from 'react-router-dom';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { DocEntity, DocType } from '../../model/type/addDocument';
import { getAddDocumentDocType, getAddDocumentFormData } from '../../model/selectors/addDocumentFormSelectors';
import { addDocumentToApplication } from '../../model/services/addDocumentToApplication';
import cls from './AddDocumentForm.module.scss';

interface AddDocumentFormProps {
  className?: string;
  docEntity?: DocEntity;
  onClose?: () => void;
}

export const AddDocumentForm: React.FC<AddDocumentFormProps> = (props) => {
  const { className } = props;
  const [file, setFile] = useState<File | undefined>();

  const { id } = useParams();
  const { isSawatzky } = useUserData();

  const docTypeOptions: SelectOptionType[] = useMemo(() => {
    const docTypes = [
      {
        text: 'Платежный документ',
        value: DocType.PAYMENT_SLIPS,
      },
    ];
    if (isSawatzky) {
      docTypes.push(
        {
          text: 'Подтверждение',
          value: DocType.CONFIRMATION,
        },
        {
          text: 'Акт',
          value: DocType.ACT,
        },
      );
    }
    docTypes.push(
      {
        text: 'Прочее',
        value: DocType.OTHER,
      },
    );

    return docTypes;
  }, [isSawatzky]);

  const docType = useSelector(getAddDocumentDocType);
  const formData = useSelector(getAddDocumentFormData);
  const dispatch = useAppDispatch();

  const onChangeFile = useCallback((file: File) => {
    setFile(file);
    dispatch(addDocumentFormActions.setFileName(file.name));
  }, [dispatch]);

  const onChangeDocType = useCallback((value: SelectOptionType) => {
    dispatch(addDocumentFormActions.setDocType(value.value as DocType));
  }, [dispatch]);

  const onSaveHandler = useCallback(() => {
    if (formData && id && file) {
      dispatch(addDocumentToApplication({ docEntity: DocEntity.APPLICATION, formData: { ...formData, file }, applicationId: id }));
      setFile(undefined);
    }
  }, [dispatch, formData, id, file]);

  const { Form } = useForm({
    fields: [
      {
        id: 'file',
        type: FormType.FILE,
        placeholder: 'Исполнитель',
        label: 'Выбрать из списка файлов',
        value: file ?? undefined,
        onChange: onChangeFile,
      },
      {
        id: 'type',
        type: FormType.SELECT,
        placeholder: 'Выберите тип загружаемого документа',
        options: docTypeOptions,
        value: docTypeOptions.find((option) => option.value === docType),
        onChange: onChangeDocType,
        rules: {
          required: true,
        },
      },
    ],
    onSubmit: onSaveHandler,
  });

  return (
    <div className={classNames(cls.addDocumentForm, {}, [className])}>
      <Text title="Добавить документ" textAlign={TextAlign.CENTER} className={cls.title} />
      {/* <FileInput
        className={cls.input}
        id="file"
        label="Выбрать из списка файлов"
        value={file ?? undefined}
        onFileChange={onChangeFile}
      />
      <Select
        className={cls.input}
        options={docTypeOptions}
        value={docTypeOptions.find((option) => option.value === docType)}
        onChange={onChangeDocType}
        placeholder="Выберите тип загружаемого документа"
      />
      <div className={cls.buttons}>
        <Button
          theme={ButtonThemes.BLUE_SOLID}
          className={cls.button}
          onClick={onSaveHandler}
        >
          Сохранить
        </Button>
      </div> */}
      {Form}
    </div>
  );
};

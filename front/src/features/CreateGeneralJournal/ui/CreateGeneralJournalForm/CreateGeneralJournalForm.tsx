import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { SelectOptionType } from 'shared/ui/Select/Select';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getLegalEntity } from 'entities/LegalEntity';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { validationPatterns } from 'shared/patterns/validationPatterns';
import { CalendarThemes } from 'widgets/DateInput/ui/DateInput';
import {
  getCreateGeneralJournalFormData,
  getCreateGeneralJournalFormLegalEntity,
  getCreateGeneralJournalIsEdit,
  getCreateGeneralJournalIsView,
  getCreateGeneralJournalUserFormReceiptDate,
  getCreateGeneralJournalTotalAmount,
  getCreateGeneralJournalPaymentDocumentNumber,
  // getCreateGeneralJournalCalendarIsOpen,
  getCreateGeneralJournalCalendarIsOpen,
} from '../../model/selectors/createGeneralJournalSelectors';
import { createGeneralJournalActions } from '../../model/slice/createGeneralJournalSlice';
import { createGeneralJournal } from '../../model/services/createGeneralJournal';
import cls from './CreateGeneralJournalForm.module.scss';

interface CreateGeneralJournalFormProps {
  className?: string;
}

export const CreateGeneralJournalForm: React.FC<CreateGeneralJournalFormProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  const legalEntities = useSelector(getLegalEntity.selectAll);
  const legalEntity = useSelector(getCreateGeneralJournalFormLegalEntity);
  const paymentDocumentNumber = useSelector(getCreateGeneralJournalPaymentDocumentNumber);
  const receiptDate = useSelector(getCreateGeneralJournalUserFormReceiptDate);
  const totalAmount = useSelector(getCreateGeneralJournalTotalAmount);

  const isEdit = useSelector(getCreateGeneralJournalIsEdit);
  const isView = useSelector(getCreateGeneralJournalIsView);

  const formData = useSelector(getCreateGeneralJournalFormData);

  const {
    isSawatzky, isAdmin, employee, sawatzkyEmployee,
  } = useUserData();

  const onChangeLegalEntity = useCallback((item: SelectOptionType) => {
    dispatch(createGeneralJournalActions.setLegalEntity(+item.value));
  }, [dispatch]);

  const onChangePaymentDocument = useCallback((value: string) => {
    dispatch(createGeneralJournalActions.setPaymentDocumentNumber(value));
  }, [dispatch]);

  const onChangeReceiptDate = useCallback((value: string) => {
    dispatch(createGeneralJournalActions.setReceiptDate(value));
  }, [dispatch]);

  const onChangeTotalAmount = useCallback((value: string) => {
    dispatch(createGeneralJournalActions.setTotalAmount(value));
  }, [dispatch]);

  const onSubmitForm = () => {
    try {
      if (formData) {
        // console.log('formData', formData);
        // if (isEdit && employeeId) {
        //   dispatch(editGeneralJournal({
        //     ...formData,
        //   }));
        // } else if (formData && user) {
        dispatch(createGeneralJournal({ ...formData }));
      }
    } catch (e) {
      console.log('e', e);
    }
    // }
  };

  const legalEntityOptions: SelectOptionType[] | undefined = useMemo(() => (
    legalEntities
      .filter((item) => !!item)
      .filter((item) => (isAdmin ? true : item?.workObject?.id && sawatzkyEmployee?.workingObjects?.includes(Number(item?.workObject?.id))))
      .map((item) => ({ value: item.id ?? '', text: item.name ?? '' }
      ))), [legalEntities, isSawatzky, employee?.legalEntity]);

  const legalEntityOption = useMemo(() => {
    if (legalEntity) {
      return legalEntityOptions?.find((item) => item.value === legalEntity);
    }
    return undefined;
  }, [legalEntityOptions, legalEntity]);

  const onFocusHandler = useCallback(() => {
    dispatch(createGeneralJournalActions.clearWorkDates());
    dispatch(createGeneralJournalActions.openCalendar());
  }, [dispatch]);

  const onCloseCalendar = () => {
    dispatch(createGeneralJournalActions.closeCalendar());
  };
  const isCalendarOpen = useSelector(getCreateGeneralJournalCalendarIsOpen);
  const clearWorkDatesHandler = useCallback(() => {
    dispatch(createGeneralJournalActions.clearWorkDates());
  }, [dispatch]);

  const { Form } = useForm({
    fields: [
      {
        id: 'date',
        type: FormType.DATEPICKER,
        placeholder: 'Дата поступления',
        defaultValue: receiptDate,
        value: receiptDate,
        onChange: onChangeReceiptDate,
        otherProps: {
          onClear: clearWorkDatesHandler,
          isFocused: isCalendarOpen,
          onCloseCalendar,
          onFocusHandler,
          theme: CalendarThemes.DOWN,
          startDay: false,
        },
        rules: {
          required: true,
        },
      },
      {
        id: 'legalEntity',
        type: FormType.SELECT,
        placeholder: 'Контрагент',
        options: legalEntityOptions,
        value: legalEntityOption,
        onChange: onChangeLegalEntity,
        rules: {
          required: true,
        },
      },
      {
        id: 'id',
        type: FormType.TEXT,
        placeholder: '№ платежного док.',
        defaultValue: paymentDocumentNumber,
        value: paymentDocumentNumber ?? '',
        onChange: onChangePaymentDocument,
        rules: {
          required: true,
        },
      },
      // {
      //   id: 'date',
      //   type: FormType.TEXT,
      //   placeholder: 'YYYY-MM-DD',
      //   defaultValue: receiptDate,
      //   value: receiptDate ?? '',
      //   // pattern="\d{4}-\d{2}-\d{2}"
      //   // inputMode="numeric"
      //   onChange: onChangeReceiptDate,
      //   rules: {
      //     required: true,
      //   },
      // },
      {
        id: 'totalAmount',
        type: FormType.TEXT,
        placeholder: 'Общая сумма',
        defaultValue: totalAmount,
        value: totalAmount ?? '',
        onChange: onChangeTotalAmount,
        rules: {
          required: true,
          pattern: validationPatterns.NUMBER,
        },
        // otherProps: {
        //   disabled: isEdit,
        // },
      },
    ].filter((field) => field !== null),
    onSubmit: !isView ? onSubmitForm : undefined,
    submitTitle: !isEdit ? 'Создать' : 'Сохранить',
  });

  return (
    <div className={classNames(cls.CreateGeneralJournalForm, {}, [className])}>
      <Text className={cls.title} textAlign={TextAlign.CENTER} title={`${isEdit ? 'Изменить' : isView ? 'Карточка' : 'Добавить'} платежный документ`} />
      {Form}
    </div>
  );
};

import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
// import { getLegalEntity } from 'entities/LegalEntity';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
// import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
// import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { validationPatterns } from 'shared/patterns/validationPatterns';
// import { editEmployee } from 'features/CreateEmployee/model/services/editEmployee';
import { CalendarThemes } from 'widgets/DateInput/ui/DateInput';
import { Button, ButtonThemes, ButtonSize } from 'shared/ui/Button/Button';
import { formatCurrency } from 'shared/lib/data/utiils';
import { getDateString } from 'shared/lib/getDateString/getDateString';
import { Select, SelectOptionType, SelectSize } from 'shared/ui/Select/Select';
import { Input } from 'shared/ui/Input/Input';
import { editGeneralJournalActions } from 'features/EditGeneralJournal';
import { addApplicationToGeneralJournal } from 'features/EditGeneralJournal/model/services/addApplicationToGeneralJournal';
import { FormInput } from 'shared/lib/hooks/useForm/ui/FormInput';
import { FormType } from 'shared/lib/hooks/useForm/useForm';
import {
  getCreateGeneralJournalFormData,
  getCreateGeneralJournalFormLegalEntity,
  getCreateGeneralJournalIsEdit,
  // getCreateGeneralJournalUserFormUsername,
  getEditGeneralJournalInfo,
  getEditGeneralJournalSelectOptions,
  getEditGeneralJournalSelectedApplications,
  getEditGeneralJournalFullSelectedApplications,
} from '../../model/selectors/editGeneralJournalSelectors';
import cls from './EditGeneralJournalForm.module.scss';

interface CreateGeneralJournalFormProps {
  className?: string;
}

export function formatApplicationString(application: any) {
  return `
      ${application?.id || application?.application_id} /
      ${application.title} /
      ${formatCurrency(application.totalSum)} /
      ${formatCurrency(application.totalPayment)}
  `.trim();
  // return `
  //     ${application.application_id} /
  //     Название: ${application.title} /
  //     Контрагент: / 12.02.1990 /
  //     ${formatCurrency(application.totalSum)} /
  //     ${formatCurrency(application.totalPayment)}
  // `.trim();
}

export const CreateGeneralJournalForm: React.FC<CreateGeneralJournalFormProps> = (props) => {
  const { className } = props;
  const fullSelectedApplications = useSelector(getEditGeneralJournalFullSelectedApplications);

  const dispatch = useAppDispatch();
  const isEdit = useSelector(getCreateGeneralJournalIsEdit);

  const info = useSelector(getEditGeneralJournalInfo);

  const onSubmitForm = useCallback(() => {
    const postData = {
      generalJounalId: info.id as string,
      application: fullSelectedApplications?.map((app) => ({
        id: app?.id as string,
        totalPayment: app?.value as string,
      })) || [],
    };
    dispatch(addApplicationToGeneralJournal(postData));
  }, [dispatch, isEdit, fullSelectedApplications]);

  const applicationsIds = useMemo(() => info?.application?.map((i: any) => i.application_id), [info]) || [];
  const selectAllOptions = useSelector(getEditGeneralJournalSelectOptions);
  const selectAOptions = useMemo(() => {
    if (selectAllOptions) {
      return selectAllOptions?.filter((item: any) => !applicationsIds.includes(item.id)).map((item: any) => ({
        text: formatApplicationString(item),
        value: item?.application_id || item?.id,
      })); // workingObjects.find((object) => object === item.value));
    }
    return undefined;
  }, [selectAllOptions]);

  const selectedApplications = useSelector(getEditGeneralJournalSelectedApplications);

  const onChangeSelect = useCallback((value: any) => {
    dispatch(editGeneralJournalActions.setSelectedApplications(value));
  }, []);

  useEffect(() => {
    const fullSelectedOptions = [];
    for (const option of (selectedApplications || [])) {
      const currentApp = info?.application?.find((item: any) => item.application_id == option.value);
      fullSelectedOptions.push({
        value: currentApp?.totalPayment || '',
        title: option.text,
        id: option?.application_id || option?.id || option?.value,
        isDirty: false,
      });
    }

    dispatch(editGeneralJournalActions.setFullSelectedApplications(fullSelectedOptions));
  }, [selectedApplications]);
  return (
    <div className={classNames(cls.CreateGeneralJournalForm, {}, [className])}>
      <Text className={cls.title} textAlign={TextAlign.CENTER} title="Контрагент наименование" />
      <div className={cls.list}>
        <div className={cls.listItem}>
          <div className={cls.listItemTitle}>
            Общая Сумма
          </div>
          <div className={cls.listItemSubtitle}>
            { info?.totalAmount ? formatCurrency(info?.totalAmount) : '-' }
          </div>
        </div>
        <div className={cls.listItem}>
          <div className={cls.listItemTitle}>
            Сумма по счетам
          </div>
          <div className={cls.listItemSubtitle}>
            { info?.amountByInvoices ? formatCurrency(info?.amountByInvoices) : '-' }
          </div>
        </div>
        <div className={cls.listItem}>
          <div className={cls.listItemTitle}>
            Дата поступления
          </div>
          <div className={cls.listItemSubtitle}>
            {/* { getDateString(info?.receiptDate) } */}
            { info?.receiptDate }
          </div>
        </div>
        <div className={cls.listItem}>
          <div className={cls.listItemTitle}>
            № платежного док.
          </div>
          <div className={cls.listItemSubtitle}>
            { info?.paymentDocumentNumber }
          </div>
        </div>
      </div>
      <Select
        size={SelectSize.S}
        className={classNames(cls.input, {}, [cls.select])}
        placeholder="Выбор заявки"
        options={selectAOptions?.map((option: any) => option)}
        selected={selectedApplications}
        onMultiChange={onChangeSelect}
        multi
      />

      {/* {Form} */}
      {Boolean(fullSelectedApplications?.length) && (
        <div className={cls.applicationItemList}>
          {fullSelectedApplications?.map((app: any) => (
            <div className={cls.applicationItem} key={app.id}>
              <div className={cls.applicationItemTitle}>
                { app?.title }
              </div>
              <FormInput
                // className={cls.input}
                // value={app.value as any}
                isDirty={app.isDirty}
                field={{
                  placeholder: 'Сумма оплаты',
                  id: '1',
                  type: FormType.TEXT,
                  value: app.value as any,
                  rules: {
                    required: true,
                    pattern: validationPatterns.NUMBER,
                  },
                  onChange: (value) => {
                    dispatch(editGeneralJournalActions.setFullSelectedValueApplications({ app, value }));
                  },
                }}
                setIsValid={() => {}}
                // onChange={(value: any) => {
                //   console.log('value', value);
                //   dispatch(editGeneralJournalActions.setFullSelectedValueApplications({ app, value }));
                // }}
                // placeholder="Сумма оплаты"
              />
            </div>
          ))}
        </div>
      )}

      <div className={cls.buttons}>
        <Button
          className={cls.button}
          theme={ButtonThemes.BLUE_SOLID}
          size={ButtonSize.M}
          onClick={() => {
            onSubmitForm();
          }}
        >
          Сохранить
        </Button>
        <Button
          size={ButtonSize.M}
          className={cls.button}
          theme={ButtonThemes.BLUE_BORDER}
          onClick={() => {}}
        >
          Очистить
        </Button>
      </div>
    </div>
  );
};

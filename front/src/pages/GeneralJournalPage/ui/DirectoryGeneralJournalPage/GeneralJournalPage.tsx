import { classNames } from 'shared/lib/classNames/classNames';
import { DirectoryPageWrapper } from 'widgets/DirectoryPageWrapper';
// import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { TableItemType, TableType } from 'widgets/Table';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useTable } from 'shared/lib/hooks/useTable';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import { fetchLegalEntityList, legalEntityReducer } from 'entities/LegalEntity';
import {
  CreateGeneralJournalModal,
  createGeneralJournalActions,
  createGeneralJournalReducer,
} from 'features/CreateGeneralJournal';

import clsTableItemHeader from 'widgets/Table/ui/TableItemHeader/TableItemHeader.module.scss';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import { fetchGeneralJournalList, generalJournalReducer } from 'entities/GeneralJournal';
import { getGeneralJournal } from 'entities/GeneralJournal/model/slice/generalJournalSlice';
import { EditGeneralJournalModal, editGeneralJournalReducer } from 'features/EditGeneralJournal';
import {
  Select, SelectOptionType, SelectSize, SelectThemes,
} from 'shared/ui/Select/Select';
import { employeeReducer, fetchEmployeeList, getEmployee } from 'entities/Employee';
import { RangePickerSelectedDays } from 'react-trip-date/dist/rangePicker/rangePicker.type';
import { InputThemes } from 'shared/ui/Input/Input';
import { CalendarThemes, DateInput } from 'widgets/DateInput/ui/DateInput';
import cls from './GeneralJournalPage.module.scss';
import PaymentDocument from '../PaymentDocument/PaymentDocument';

interface DirectoryEmployeePageProps {
  className?: string;
}

const reducers: ReducersList = {
  legalEntity: legalEntityReducer,
  createGeneralJournal: createGeneralJournalReducer,
  editGeneralJournal: editGeneralJournalReducer,
  generalJournal: generalJournalReducer,
  employee: employeeReducer,
};

const DirectoryEmployeePage: React.FC<DirectoryEmployeePageProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  // const employees = useSelector(getEmployee.selectAll);
  const {
    isSawatzky, isAdmin, sawatzkyEmployee,
  } = useUserData();

  useEffect(() => {
    dispatch(fetchGeneralJournalList());
    dispatch(fetchEmployeeList());
    dispatch(fetchLegalEntityList());
  }, [dispatch]);
  // export const getLegalEntity = legalEntityAdapter.getSelectors<StateSchema>(
  //   (state) => state.legalEntity || legalEntityAdapter.getInitialState(),
  // );

  const generalJournalList = useSelector(getGeneralJournal.selectAll);

  const onTableDeleteHandler = useCallback((item: TableItemType) => {
    // const user = employees.find((employee) => employee.id === item.id)?.user;
    // if (user) {
    //   dispatch(deleteEmployee(`${user.id}`));
    // }
  }, [dispatch]);

  const tableData: TableType = {
    header: {
      id: <div className={clsTableItemHeader.text} style={{ flex: '0 0 100px' }}> № док. </div>,
      congragent: 'Контрагент',
      date: <div className={clsTableItemHeader.text} style={{ flex: '0 0 140px' }}>Дата поступления </div>,
      totalAmount: 'Сумма плат. документа',
      totalApplicationsSum: 'Общая сумма по заявкам',
      restOfThePayment: 'Остаток',
      status: <div className={clsTableItemHeader.text} style={{ width: '120px', textAlign: 'right' }}> Статус </div>,
    },
    items: generalJournalList?.map((item) => (
      <PaymentDocument
        info={item}
        key={item.id}
      /> || []
    )),
  };

  const { Table, selectedItems } = useTable({
    data: tableData,
    onDelete: onTableDeleteHandler,
    editable: true,
    deleteble: true,
    checkable: false,
    collapsable: false,
    className: cls.tableHeader,
    textAlignment: 'center',
  });

  const employees = useSelector(getEmployee.selectAll);
  const [employee, setEmployee] = useState<number|null>(null);

  const employeeOptions: SelectOptionType[] | undefined = useMemo(() => {
    if (!employees) return undefined;
    const result = [{
      value: -1,
      text: 'Показать все',
    },
    ...(employees.length ? employees
      .filter((item) => (isAdmin ? true : item?.legalEntity?.workObject?.id && sawatzkyEmployee?.workingObjects?.includes(Number(item?.legalEntity?.workObject?.id))))
      .map((item) => ({
        value: item.id ?? '',
        text: item.user.fio ?? '',
      })) : [])];
    return result;
  }, [employees]);

  const employeeOption = useMemo(() => {
    if (employee) {
      return employeeOptions?.find((item) => item.value === employee);
    }
    return undefined;
  }, [employeeOptions, employee]);

  const onChangeEmployee = useCallback((item: SelectOptionType) => {
    setEmployee(+item.value);
  }, [dispatch]);

  const [date, setDate] = useState<RangePickerSelectedDays>({
    from: '',
    to: '',
  });
  const [isOpenCalendar, setOpenCalendar] = useState<boolean>(false);

  const onCloseCalendar = () => {
    setOpenCalendar(false);
  };
  const onFocusCalendarHandler = useCallback(() => {
    setOpenCalendar(true);
  }, [dispatch]);

  const changeSelectedDaysHandler = useCallback((dates: RangePickerSelectedDays) => {
    setDate(dates);
  }, [dispatch]);

  const clearWorkDatesHandler = useCallback(() => {
    setDate({
      from: '',
      to: '',
    });
  }, [dispatch]);

  useEffect(() => {
    const params = {
      ...(employeeOption?.value && employeeOption?.value !== -1 && { legalEntity: employeeOption?.value }),
      ...(date.from && date.to && { periodStart: date.from, periodEnd: date.to }),
    };
    dispatch(fetchGeneralJournalList({ params }));
  }, [employeeOption, date.from, date.to]);

  return (
    <DynamicModuleLoader reducers={reducers}>
      <div className={cls.filters}>
        <Select
          className={cls.select}
          size={SelectSize.A}
          placeholder="Выбор заказчика"
          theme={SelectThemes.ACTIVE}
          onChange={onChangeEmployee}
          options={employeeOptions}
          value={employeeOption}
        />
        <div style={{ maxWidth: '260px', width: '100%' }}>
          <DateInput
            className={cls.date}
            inputTheme={InputThemes.WHITE}
            onChange={changeSelectedDaysHandler}
            selectedDays={{ from: date.from, to: date.to }}
            onClear={clearWorkDatesHandler}
            theme={CalendarThemes.DOWN}
            // onSaveCalendar={}
            isFocused={isOpenCalendar}
            onCloseCalendar={onCloseCalendar}
            onFocusHandler={onFocusCalendarHandler}
            placeholder="Дата"
            startDay={false}
          />
        </div>
      </div>
      <div className={cls.buttons}>
        {
          isSawatzky
            && (
              <>
                <button
                  onClick={() => {
                    dispatch(createGeneralJournalActions.openCreateModal());
                  }}
                  className={cls.addButton}
                  type="button"
                  // theme={ButtonThemes.ICON}
                >
                  ++ Добавить платежный документ
                </button>
              </>
            )
        }
      </div>
      {Table}
      <CreateGeneralJournalModal
        className={cls.form}
      />
      <EditGeneralJournalModal
        className={cls.form}
      />
    </DynamicModuleLoader>
  );
};

export default DirectoryEmployeePage;

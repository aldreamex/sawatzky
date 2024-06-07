import { classNames } from 'shared/lib/classNames/classNames';
import { Title } from 'shared/ui/Title/Title';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { ReactComponent as OrderLogo } from 'shared/assets/icons/order-icon.svg';
import { ReactComponent as AddLogo } from 'shared/assets/icons/add-icon.svg';
import { ReactComponent as DeleteLogo } from 'shared/assets/icons/delete-icon.svg';
import { ReactComponent as DeleteFileLogo } from 'shared/assets/icons/del-file-icon.svg';
import { ReactComponent as AddFileLogo } from 'shared/assets/icons/add-file-icon.svg';
import { ReactComponent as SearchLogo } from 'shared/assets/icons/search-icon.svg';
import { AddReportModal } from 'features/AddReport';
import { useCallback, useMemo } from 'react';
import { Select, SelectSize, SelectThemes } from 'shared/ui/Select/Select';
import { CalendarThemes, DateInput } from 'widgets/DateInput/ui/DateInput';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { getAddReportFormIsOpen } from 'features/AddReport/model/selectors/addReportSelectors';
import { addReportActions } from 'features/AddReport/model/slice/addReportSlice';
import { InputThemes } from 'shared/ui/Input/Input';
import {
  getReportPageEndWorkDate, getReportPageIsCalendarOpen, getReportPageStartWorkDate,
} from 'pages/ReportsPage/model/selectors/reportsPageSelectors';
import { RangePickerSelectedDays } from 'react-trip-date/dist/rangePicker/rangePicker.type';
import { reportsPageActions } from 'pages/ReportsPage/model/slice/reportsPageSlice';
import { reportDetailActions, ReportDetailModal } from 'features/ReportDetail';
import { getReport } from 'entities/Report/model/slice/reportSlice';
import { deleteReport } from 'entities/Report';
import { TableItemType, TableItemsMod, TableType } from 'widgets/Table';
import { useTable } from 'shared/lib/hooks/useTable';
import { getDateString } from 'shared/lib/getDateString/getDateString';
import cls from './ReportsPageContent.module.scss';
import { ReportsList } from '../ReportsList/ReportsList';

interface ReportsPageContentProps {
  className?: string;
}

export const ReportsPageContent: React.FC<ReportsPageContentProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  const reportsList = useSelector(getReport.selectAll);
  const reportFormIsOpen = useSelector(getAddReportFormIsOpen);
  const isCalendarOpen = useSelector(getReportPageIsCalendarOpen);
  const startWorkDate = useSelector(getReportPageStartWorkDate);
  const endWorkDate = useSelector(getReportPageEndWorkDate);

  const onReportModalOpenHandler = useCallback(() => {
    dispatch(addReportActions.openModal());
  }, [dispatch]);

  const onReportModalCloseHandler = useCallback(() => {
    dispatch(addReportActions.closeModal());
    dispatch(addReportActions.clearForm());
  }, [dispatch]);

  const onFocusHandler = useCallback(() => {
    dispatch(reportsPageActions.clearWorkDates());
    dispatch(reportsPageActions.openCalendar());
  }, [dispatch]);

  const onCloseCalendar = () => {
    dispatch(reportsPageActions.closeCalendar());
  };

  const changeSelectedDaysHandler = useCallback((dates: RangePickerSelectedDays) => {
    if (dates.from) {
      dispatch(reportsPageActions.setStartWorkDate(dates.from));
    }
    if (dates.to) {
      dispatch(reportsPageActions.setEndWorkDate(dates.to));
    }
  }, [dispatch]);

  const clearWorkDatesHandler = useCallback(() => {
    dispatch(reportsPageActions.clearWorkDates());
  }, [dispatch]);

  const onReportDetailOpenHandler = useCallback((item: TableItemType) => {
    dispatch(reportDetailActions.open(item.id.toString()));
  }, [dispatch]);

  const onTableDeleteHandler = useCallback((item: TableItemType) => {
    dispatch(deleteReport(`${item.id}`));
  }, [dispatch]);

  const tableData: TableType = useMemo(() => ({
    header: {
      id: 'ID',
      date: 'Дата отчета',
      name: 'ФИО создание отчета',
    },
    items: reportsList.map((item) => ({
      id: item.id,
      date: `${getDateString(new Date(item.periodStart), true)} — ${getDateString(new Date(item.periodEnd), true)}`,
      name: item.creator?.creator_fio ?? '',
    })),
  }), [reportsList]);

  const { Table, selectedItems } = useTable({
    data: tableData,
    mod: TableItemsMod.CLICK,
    onDelete: onTableDeleteHandler,
    onClick: onReportDetailOpenHandler,
  });

  const onButtonDeleteHandler = useCallback(() => {
    if (selectedItems) {
      selectedItems.forEach((item) => {
        dispatch(deleteReport(`${item.id}`));
      });
    }
  }, [dispatch, selectedItems]);

  return (
    <div className={classNames(cls.reportsPageContent, {}, [className])}>
      <Title className={cls.title}>Отчеты</Title>
      <div className={cls.navigation}>
        <div className={cls.btns}>
          {/* <Button className={cls.btn} theme={ButtonThemes.ICON}> <OrderLogo /></Button> */}
          <Button className={cls.btn} theme={ButtonThemes.ICON} helpInfo="добавить отчёт" onClick={onReportModalOpenHandler}> <AddLogo /></Button>
          <Button className={cls.btn} theme={ButtonThemes.ICON} helpInfo="удалить отчёт" onClick={onButtonDeleteHandler}> <DeleteLogo /></Button>
        </div>
        <div className={cls.selects}>
          {/* <Select className={cls.selectSearch} placeholder="Выбор проектов" theme={SelectThemes.ACTIVE} size={SelectSize.A} /> */}
          {/* <Select className={cls.selectSearch} placeholder="Заказчики" theme={SelectThemes.BORDER} size={SelectSize.A} /> */}
          {/* <DateInput
            className={cls.date}
            inputTheme={InputThemes.WHITE}
            onChange={changeSelectedDaysHandler}
            selectedDays={{ from: startWorkDate, to: endWorkDate }}
            onClear={clearWorkDatesHandler}
            isFocused={isCalendarOpen}
            onCloseCalendar={onCloseCalendar}
            onFocusHandler={onFocusHandler}
            theme={CalendarThemes.DOWN}
            placeholder="Дата и время проведения работ"
            startDay={false}
          /> */}
        </div>
        {/* <div className={cls.secondBtns}>
          <Button className={cls.btn} theme={ButtonThemes.ICON}> <DeleteFileLogo /></Button>
          <Button className={cls.btn} theme={ButtonThemes.ICON}> <AddFileLogo /></Button>
          <Button className={cls.btn} theme={ButtonThemes.ICON} helpInfo="найти отчёт"><SearchLogo /></Button>
        </div> */}
      </div>
      <ReportsList table={Table} />
      <AddReportModal isOpen={reportFormIsOpen} onClose={onReportModalCloseHandler} />
      <ReportDetailModal />
    </div>
  );
};

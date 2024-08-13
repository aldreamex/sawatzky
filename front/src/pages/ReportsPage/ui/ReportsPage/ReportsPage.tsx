import { classNames } from 'shared/lib/classNames/classNames';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { fetchWorkObjectGroupList, workObjectGroupReducer } from 'entities/WorkObjectGroup';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useEffect } from 'react';
import { addReportReducer } from 'features/AddReport/model/slice/addReportSlice';
import { fetchLegalEntityList, legalEntityReducer } from 'entities/LegalEntity';
import { employeeReducer, fetchEmployeeList } from 'entities/Employee';
import { reportsPageReducer } from 'pages/ReportsPage/model/slice/reportsPageSlice';
import { dateInputReducer } from 'widgets/DateInput/model/slice/dateInputSlice';
import { reportsReducer } from 'entities/Report/model/slice/reportSlice';
import { fetchReportList } from 'entities/Report';
import { reportDetailReducer } from 'features/ReportDetail/model/slice/reportDetailSlice';
import { ReportsPageContent } from '../ReportsPageContent/ReportsPageContent';

interface ReportsPageProps {
  className?: string;
}

const reducers: ReducersList = {
  workObjectGroup: workObjectGroupReducer,
  addReportForm: addReportReducer,
  legalEntity: legalEntityReducer,
  employee: employeeReducer,
  reportsPage: reportsPageReducer,
  dateInput: dateInputReducer,
  report: reportsReducer,
  reportDetail: reportDetailReducer,
};

export const ReportsPage: React.FC<ReportsPageProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchReportList());
    dispatch(fetchWorkObjectGroupList());
    dispatch(fetchEmployeeList());
    dispatch(fetchLegalEntityList());
  }, [dispatch]);

  return (
    <DynamicModuleLoader reducers={reducers}>
      <div className={classNames('', {}, [className ?? ''])}>
        <ReportsPageContent />
      </div>
    </DynamicModuleLoader>
  );
};

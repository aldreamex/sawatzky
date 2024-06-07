import { classNames } from 'shared/lib/classNames/classNames';
import { useParams } from 'react-router-dom';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { applicationDetailActions, applicationDetailReducer, getApplicationDetail } from 'pages/ApplicationDetailPage/model/slice/applicationDetailSlice';
import { applicationReducer } from 'entities/Application';
import { addDocumentFormReducer } from 'features/AddDocument';
import { useEffect } from 'react';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchWorkMaterialGroupList, workMaterialGroupReducer } from 'entities/WorkMaterialGroup';
import { fetchWorkTaskGroupList, workTaskGroupReducer } from 'entities/WorkTaskGroup';
import { addWorkMaterialApplicationFormReducer } from 'features/AddWorkMaterialToApplication';
import { addWorkTaskApplicationFormReducer } from 'features/AddWorkTaskToApplication';
import { performerReducer, fetchPerformersList } from 'entities/Performer';
import { addPerformerToApplicationFormReducer } from 'features/AddPerformerToApplication';
import { useSelector } from 'react-redux';
import { StateSchema } from 'app/providers';
import { createApplicationReducer } from 'features/CreateApplication';
import { createLegalEntityReducer } from 'features/CreateLegalEntity';
import { createEmployeeReducer } from 'features/CreateEmployee';
import { fetchApplicationDetail } from '../../model/services/fetchApplicationDetail/fetchApplicationDetail';
import { ApplicationDetailContent } from '../ApplicationDetailContent/ApplicationDetailContent';
import { getApplicationDetailIsInit } from '../../model/selectors/getApplicationDetail';

interface ApplicationDetailPageProps {
    className?: string;
}

const initialReducers: ReducersList = {
  applicationDetail: applicationDetailReducer,
  application: applicationReducer,
  addDocumentForm: addDocumentFormReducer,
  addWorkTaskApplicationForm: addWorkTaskApplicationFormReducer,
  addWorkMaterialApplicationForm: addWorkMaterialApplicationFormReducer,
  workTaskGroup: workTaskGroupReducer,
  workMaterialGroup: workMaterialGroupReducer,
  performer: performerReducer,
  addPerformerToApplicationForm: addPerformerToApplicationFormReducer,
  createApplication: createApplicationReducer,
  createLegalEntityForm: createLegalEntityReducer,
  createEmployee: createEmployeeReducer,
};

const ApplicationDetailPage: React.FC<ApplicationDetailPageProps> = (props) => {
  const { className } = props;
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const isInit = useSelector(getApplicationDetailIsInit);
  const detail = useSelector((state: StateSchema) => getApplicationDetail.selectById(state, id!!));

  useEffect(() => {
    if (!isInit && id) {
      dispatch(fetchApplicationDetail(id));
      dispatch(fetchWorkTaskGroupList());
      dispatch(fetchWorkMaterialGroupList());
      dispatch(applicationDetailActions.setIsInit());
    }
    if (detail?.creator?.legalEntity.workObject) {
      dispatch(fetchPerformersList([detail?.creator?.legalEntity.workObject.id]));
    }
  }, [dispatch, id, isInit, detail?.creator?.legalEntity.workObject]);

  return (
    <DynamicModuleLoader reducers={initialReducers} removeAfterUnmount>

      <div className={classNames('', {}, [className])}>
        <ApplicationDetailContent applicationId={id || ''} />
      </div>

    </DynamicModuleLoader>

  );
};

export default ApplicationDetailPage;

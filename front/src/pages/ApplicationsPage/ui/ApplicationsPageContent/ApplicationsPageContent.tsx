import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { Title } from 'shared/ui/Title/Title';
import { ReactComponent as AddLogo } from 'shared/assets/icons/add-icon.svg';
// import { ReactComponent as DeleteLogo } from 'shared/assets/icons/delete-icon.svg';
import { ReactComponent as OrderLogo } from 'shared/assets/icons/order-icon.svg';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { CreateApplicationModal, createApplicationActions, createApplicationReducer } from 'features/CreateApplication';
import { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import {
  Select, SelectOptionType, SelectSize, SelectThemes,
} from 'shared/ui/Select/Select';
import { fetchWorkObjectGroupList, getWorkObjectGroup, workObjectGroupReducer } from 'entities/WorkObjectGroup';
import { dateInputReducer } from 'widgets/DateInput/model/slice/dateInputSlice';
import { ApplicationStatus } from 'entities/Application';
import { applicationsPageActions, applicationsPageReducer, getApplicationsPage } from '../../model/slice/applicationsPageSlice';
import cls from './ApplicationsPageContent.module.scss';
import { fetchApplicationsList } from '../../model/services/fetchApplicationsList/fetchApplicationsList';
import { ApplicationPreviewList } from '../ApplicationPreviewList/ApplicationPreviewList';
import {
  getApplicationIsLoading, getApplicationWorkObject, getPageInit,
  getShowFinishedApplications,
} from '../../model/selectors/applicationsPageSelectors';
import { ApplicationLoader } from '../ApplicationLoader/ApplicationLoader';

interface ApplicationsPageContentProps {
}

const reducers: ReducersList = {
  applicationsPage: applicationsPageReducer,
  createApplication: createApplicationReducer,
  workObjectGroup: workObjectGroupReducer,
  dateInput: dateInputReducer,
};

export const ApplicationsPageContent: React.FC<ApplicationsPageContentProps> = (props) => {
  const dispatch = useAppDispatch();
  const applications = useSelector(getApplicationsPage.selectAll);
  const isLoading = useSelector(getApplicationIsLoading);
  const isShowFinishedApplications = useSelector(getShowFinishedApplications);
  const init = useSelector(getPageInit);

  const user = useUserData();
  const workObjectsGroups = useSelector(getWorkObjectGroup.selectAll);
  const workObjectsGroup = user.sawatzkyEmployee?.workingObjects[0];
  const workObject = useSelector(getApplicationWorkObject);

  const filteredApplications = useMemo(
    () => applications
      .filter((application) => (!isShowFinishedApplications ? application.status !== ApplicationStatus.FINISHED : true))
      .filter((application) => (workObject ? application.creator?.legalEntity.workObject?.id === workObject : true))
      .sort((applicationPrev, applicationNext) => +applicationPrev.id - +applicationNext.id),
    [workObject, applications, isShowFinishedApplications],
  );

  useEffect(() => {
    dispatch(fetchWorkObjectGroupList());
  }, [dispatch]);

  const {
    isSawatzky, isInitiator,
  } = useUserData();

  // const onDeleteHandler = useCallback(() => {
  //   if (checkeditems) {
  //     dispatch(deleteCheckedItems(checkeditems));
  //   }
  // }, [checkeditems, dispatch]);

  const openModalHandler = useCallback(() => {
    dispatch(createApplicationActions.openForm());
  }, [dispatch]);

  const onChangeWorkObject = useCallback((item: SelectOptionType) => {
    dispatch(applicationsPageActions.setWorkObject(+item.value));
  }, [dispatch]);

  const workObjectOptions = useMemo(() => {
    const workObjects = workObjectsGroups.find((item) => item.id === workObjectsGroup)?.workObjects;
    if (workObjects) {
      const options = [{
        value: 0,
        text: 'Все',
      }];
      options.push(...workObjects?.map((item) => ({
        value: item.id,
        text: item.name,
      })));
      return options;
    }
    return undefined;
  }, [workObjectsGroups, workObjectsGroup]);

  const workObjectOption = useMemo(() => {
    if (workObject) {
      return workObjectOptions?.find((item) => item.value === workObject);
    }
    return undefined;
  }, [workObject, workObjectOptions]);

  useEffect(() => {
    if (init) {
      dispatch(fetchApplicationsList());
    } else {
      dispatch(applicationsPageActions.initPage());
    }
  }, [dispatch, init]);

  return (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount>

      <Title className={cls.title}>
        Запросы
      </Title>
      <div className={cls.navigation}>
        <Button className={cls.iconBtn} theme={ButtonThemes.ICON}>
          <OrderLogo />
        </Button>
        {
          !isSawatzky && (
            <>
              <Button className={cls.iconBtn} theme={ButtonThemes.ICON} helpInfo="добавить запрос" onClick={openModalHandler}>
                <AddLogo />
              </Button>
              {/* <Button className={cls.iconBtn} theme={ButtonThemes.ICON} helpInfo="удалить запрос" onClick={onDeleteHandler}>
                <DeleteLogo />
              </Button> */}
            </>
          )
        }
        {
          !isInitiator && (
            <Select
              className={cls.select}
              size={SelectSize.A}
              placeholder="Выбор заказчика"
              theme={SelectThemes.ACTIVE}
              onChange={onChangeWorkObject}
              options={workObjectOptions}
              value={workObjectOption}
            />
          )
        }
        <Button className={cls.btn} theme={ButtonThemes.BLUE_SOLID} onClick={() => dispatch(applicationsPageActions.toggleFinishedApplications())}>
          {
            isShowFinishedApplications ? 'Только открытые' : 'Все запросы'
          }
        </Button>
      </div>
      {
        isLoading
          ? <ApplicationLoader />
          : (
            <>
              <ApplicationPreviewList className={cls.list} applications={filteredApplications} />
            </>
          )
      }
      <CreateApplicationModal />
    </DynamicModuleLoader>

  );
};

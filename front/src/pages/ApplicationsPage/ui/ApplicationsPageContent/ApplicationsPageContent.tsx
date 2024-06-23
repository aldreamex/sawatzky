import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { Title } from 'shared/ui/Title/Title';
import { ReactComponent as AddLogo } from 'shared/assets/icons/add-icon.svg';
// import { ReactComponent as DeleteLogo } from 'shared/assets/icons/delete-icon.svg';
import { ReactComponent as OrderLogo } from 'shared/assets/icons/order-icon.svg';
import { ReactComponent as OrderLogo2 } from 'shared/assets/icons/order-icon-1.svg';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { CreateApplicationModal, createApplicationActions, createApplicationReducer } from 'features/CreateApplication';
import {
  useCallback, useEffect, useMemo, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import {
  Select, SelectOptionType, SelectSize, SelectThemes,
} from 'shared/ui/Select/Select';
import { InputThemes } from 'shared/ui/Input/Input';
import { fetchWorkObjectGroupList, getWorkObjectGroup, workObjectGroupReducer } from 'entities/WorkObjectGroup';
import { dateInputReducer } from 'widgets/DateInput/model/slice/dateInputSlice';
import { ApplicationStatus } from 'entities/Application';
import { RangePickerSelectedDays } from 'react-trip-date/dist/rangePicker/rangePicker.type';
import { DateInput } from 'widgets/DateInput';
import { CalendarThemes } from 'widgets/DateInput/ui/DateInput';
import { fetchLegalEntityList, legalEntityReducer } from 'entities/LegalEntity';
import { employeeReducer, fetchEmployeeList } from 'entities/Employee';
import { classNames } from 'shared/lib/classNames/classNames';
import { applicationsPageActions, applicationsPageReducer, getApplicationsPage } from '../../model/slice/applicationsPageSlice';
import { fetchApplicationsList } from '../../model/services/fetchApplicationsList/fetchApplicationsList';
import { ApplicationPreviewList } from '../ApplicationPreviewList/ApplicationPreviewList';
import {
  getApplicationIsCalendarOpen,
  getApplicationIsLoading,
  getApplicationPageCreator,
  getApplicationPageEndWorkDate,
  getApplicationPageSort,
  getApplicationPageStartWorkDate,
  getApplicationStatus,
  getApplicationWorkObject,
  getPageInit,
  getShowFinishedApplications,
} from '../../model/selectors/applicationsPageSelectors';
import { ApplicationLoader } from '../ApplicationLoader/ApplicationLoader';
import cls from './ApplicationsPageContent.module.scss';

interface ApplicationsPageContentProps {
}

const reducers: ReducersList = {
  applicationsPage: applicationsPageReducer,
  legalEntity: legalEntityReducer,
  employee: employeeReducer,
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
  // const workObjectsGroups = useSelector(getWorkObjectGroup.selectAll);
  // const workObjectsGroup = user.sawatzkyEmployee?.workingObjects[0];
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
    dispatch(fetchLegalEntityList());
    dispatch(fetchEmployeeList());
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

  // const onChangeWorkObject = useCallback((item: SelectOptionType) => {
  //   dispatch(applicationsPageActions.setWorkObject(+item.value));
  // }, [dispatch]);

  // const workObjectOptions = useMemo(() => {
  //   const workObjects = workObjectsGroups.find((item) => item.id === workObjectsGroup)?.workObjects;
  //   if (workObjects) {
  //     const options = [{
  //       value: 0,
  //       text: 'Все',
  //     }];
  //     options.push(...workObjects?.map((item) => ({
  //       value: item.id,
  //       text: item.name,
  //     })));
  //     return options;
  //   }
  //   return undefined;
  // }, [workObjectsGroups, workObjectsGroup]);

  // const workObjectOption = useMemo(() => {
  //   if (workObject) {
  //     return workObjectOptions?.find((item) => item.value === workObject);
  //   }
  //   return undefined;
  // }, [workObject, workObjectOptions]);

  useEffect(() => {
    if (init) {
      dispatch(fetchApplicationsList());
    } else {
      dispatch(applicationsPageActions.initPage());
    }
  }, [dispatch, init]);

  // filtres

  const statusesOptions: SelectOptionType[] = [
    {
      value: 0,
      text: 'Показать все',
    },
    {
      value: ApplicationStatus.NEW,
      text: 'Запрос создан',
    },
    {
      value: ApplicationStatus.COORDINATION,
      text: 'На согласовании',
    },

    {
      value: ApplicationStatus.PAYMENT_COORDINATION,
      text: 'Ожидается оплата',
    },
    {
      value: ApplicationStatus.IN_WORK,
      text: 'Отправлено исполнителю',
    },
    {
      value: ApplicationStatus.PROCESSED,
      text: 'Обрабатывается',
    },
    {
      value: ApplicationStatus.WAITING_FINISH,
      text: 'Ожидает подтверждения завершения',
    },
    {
      value: ApplicationStatus.FINISHED,
      text: 'Запрос выполнен',
    },
  ];

  const status = useSelector(getApplicationStatus);
  const statusValue = useMemo(
    () => {
      if (status) {
        return statusesOptions?.find((item) => item.value === status);
      }
      return undefined;
    },
    [status, statusesOptions],
  );
  // Date
  const isCalendarOpen = useSelector(getApplicationIsCalendarOpen);
  const onCloseCalendar = () => {
    dispatch(applicationsPageActions.closeCalendar());
  };
  const onFocusCalendarHandler = useCallback(() => {
    // dispatch(applicationsPageActions.clearWorkDates());
    dispatch(applicationsPageActions.openCalendar());
  }, [dispatch]);

  const changeSelectedDaysHandler = useCallback((dates: RangePickerSelectedDays) => {
    if (dates.from) {
      dispatch(applicationsPageActions.setStartWorkDate(dates.from));
    }
    if (dates.to) {
      dispatch(applicationsPageActions.setEndWorkDate(dates.to));
    }
  }, [dispatch]);

  const clearWorkDatesHandler = useCallback(() => {
    dispatch(applicationsPageActions.clearWorkDates());
  }, [dispatch]);

  const startWorkDate = useSelector(getApplicationPageStartWorkDate);
  const endWorkDate = useSelector(getApplicationPageEndWorkDate);

  // creator

  const creatorsOptionsRef = useRef<SelectOptionType[]>([]);

  useEffect(() => {
    if (creatorsOptionsRef.current.length === 0) {
      const uniqueCreators: SelectOptionType[] = [];
      const seenUsernames: { [key: string]: boolean } = {};

      if (applications.length) {
        uniqueCreators.push({
          value: 0,
          text: 'Показать все',
        });
      }
      for (const app of applications) {
        const username = app.creator?.user?.username;
        const text = app.creator?.user?.fio || username || '-';

        if (username && !seenUsernames[username]) {
          uniqueCreators.push({ value: username, text });
          seenUsernames[username] = true;
        }
      }
      creatorsOptionsRef.current = uniqueCreators;
    }
  }, [applications]);

  const creatorsOptions = creatorsOptionsRef.current;

  const creator = useSelector(getApplicationPageCreator);
  const creatorValue = useMemo(
    () => {
      if (creator) {
        return creatorsOptions?.find((item) => item.value === creator);
      }
      return undefined;
    },
    [creator, creatorsOptions],
  );

  // sort

  const sorting = useSelector(getApplicationPageSort);
  function changeSort() {
    console.log('changeSort', sorting);
    switch (sorting) {
    case undefined:
      dispatch(applicationsPageActions.setSort('createdAt'));
      break;
    case 'createdAt':
      dispatch(applicationsPageActions.setSort('-createdAt'));
      break;
    case '-createdAt':
    default:
      dispatch(applicationsPageActions.setSort(undefined));
      break;
    }
  }

  useEffect(() => {
    const params = {
      ...(sorting && { ordering: sorting }),
      ...(creator && { creator }),
      ...(status && { status }),
      ...(startWorkDate && endWorkDate && { periodEnd: endWorkDate, periodStart: startWorkDate }),
    };
    dispatch(fetchApplicationsList({ params }));
  }, [creator, startWorkDate, endWorkDate, status, sorting, dispatch]);

  return (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount>

      <Title className={cls.title}>
        Запросы
      </Title>
      <div className={cls.navigation}>
        <Button
          onClick={() => {
            changeSort();
          }}
          className={cls.iconBtn}
          theme={ButtonThemes.ICON}
        >
          { sorting ? <OrderLogo className={classNames('', { [cls.rotate180]: sorting === '-createdAt' }, [])} /> : <OrderLogo2 /> }
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
            // <Select
            //   className={cls.select}
            //   size={SelectSize.A}
            //   placeholder="Выбор заказчика"
            //   theme={SelectThemes.ACTIVE}
            //   onChange={onChangeWorkObject}
            //   options={workObjectOptions}
            //   value={workObjectOption}
            // />
            <Select
              className={cls.select}
              size={SelectSize.A}
              placeholder="Выбор заказчика"
              theme={SelectThemes.ACTIVE}
              onChange={(item: SelectOptionType) => {
                dispatch(applicationsPageActions.setCreator(item.value !== 0 ? item.value as string : undefined));
              }}
              options={creatorsOptions}
              value={creatorValue}
            />
          )
        }

        <Select
          className={cls.select}
          size={SelectSize.A}
          placeholder="Статус"
          theme={SelectThemes.ACTIVE}
          onChange={(item: SelectOptionType) => {
            dispatch(applicationsPageActions.setStatus(item.value !== 0 ? item.value as ApplicationStatus : undefined));
          }}
          options={statusesOptions}
          value={statusValue}
        />
        <div style={{ maxWidth: '260px', width: '100%' }}>
          <DateInput
            className={cls.date}
            inputTheme={InputThemes.WHITE}
            onChange={changeSelectedDaysHandler}
            selectedDays={{ from: startWorkDate, to: endWorkDate }}
            onClear={clearWorkDatesHandler}
            theme={CalendarThemes.DOWN}
            // onSaveCalendar={}
            isFocused={isCalendarOpen}
            onCloseCalendar={onCloseCalendar}
            onFocusHandler={onFocusCalendarHandler}
            placeholder="Дата заявки"
            startDay={false}
          />
        </div>

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

import { Button, ButtonSize, ButtonThemes } from 'shared/ui/Button/Button';
import { TableItemType, TableItemsMod, TableType } from 'widgets/Table';
import { getTime } from 'shared/lib/helpers/getTime';
import { CollapsBoard } from 'widgets/CollapsBoard';
import { ApplicationStatus, ApplicationWorkMaterial, ApplicationWorkTask } from 'entities/Application';
import { useTable } from 'shared/lib/hooks/useTable';
import {
  addWorkTaskApplicationFormActions,
  addWorkTaskToApplication,
} from 'features/AddWorkTaskToApplication';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useCallback, useMemo } from 'react';
import { DocList } from 'widgets/DocList';
import {
  addWorkMaterialApplicationFormActions,
  addWorkMaterialToApplication,
} from 'features/AddWorkMaterialToApplication';
import { addDocumentFormActions } from 'features/AddDocument';
import { useSelector } from 'react-redux';
import { StateSchema } from 'app/providers';
import { Document } from 'entities/Document';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import { getApplicationPrepayment, getApplicationStatus, getApplicationStep } from 'pages/ApplicationDetailPage/model/selectors/getApplicationDetailInfo';
import { nextApplicationStep } from 'pages/ApplicationDetailPage/model/services/nextApplicationStep/nextApplicationStep';
import { prevApplicationStep } from 'pages/ApplicationDetailPage/model/services/prevApplicationStep/prevApplicationStep';
import cls from './ApplicationDetailWorkPrice.module.scss';
import { getApplicationDetail } from '../../model/slice/applicationDetailSlice';
import { fetchApplicationDetail } from '../../model/services/fetchApplicationDetail/fetchApplicationDetail';

interface ApplicationDetailWorkPriceProps {
  className?: string;
  applicationId: string;
  workTasks?: ApplicationWorkTask[];
  workMaterials?: ApplicationWorkMaterial[];
}

export const ApplicationDetailWorkPrice: React.FC<ApplicationDetailWorkPriceProps> = (props) => {
  const { workTasks = [], workMaterials = [], applicationId } = props;

  const dispatch = useAppDispatch();

  const detail = useSelector((state: StateSchema) => getApplicationDetail.selectById(state, applicationId));
  const step = useSelector((state: StateSchema) => getApplicationStep(state, applicationId));
  const status = useSelector((state: StateSchema) => getApplicationStatus(state, applicationId));
  const prepayment = useSelector((state: StateSchema) => getApplicationPrepayment(state, applicationId));
  const { isSawatzky } = useUserData();
  const {
    isDispatcher,
    isInitiator,
    isAdmin,
  } = useUserData();

  const docList = useMemo<Document[] | undefined>(() => detail?.documents, [detail]);

  const payList: Document[] | undefined = detail?.paymentSlips;

  const workTasksTable: TableType = {
    header: {
      id: 'Код',
      name: 'Наименование работ',
      price: 'Цена',
      time: 'Время',
      sum: 'Сумма',
    },
    items: workTasks.map((item) => {
      const { hours, minuts } = getTime(item.actualTime);
      const sum = item.workTask.price * hours + Math.floor(item.workTask.price * minuts / 60);
      const timeString = minuts > 0 && hours > 0
        ? `${hours} ч ${minuts} м`
        : minuts > 0
          ? `${minuts} м`
          : `${hours} ч`;

      return {
        id: item.workTask.id,
        name: item.workTask.name,
        price: `${item.workTask.price} ₽/час`,
        time: timeString,
        sum: `${sum} руб`,
      };
    }),

  };
  const workMaterialsTable: TableType = {
    header: {
      id: 'Код',
      name: 'Наименование материалов',
      price: 'Цена',
      count: 'Количество штук',
      sum: 'Сумма',
    },
    items: workMaterials.map((item) => {
      const sum = item.actualCount * item.workMaterial.price;

      return {
        id: item.workMaterial.id,
        name: item.workMaterial.name,
        price: `${item.workMaterial.price} ₽/шт`,
        count: `${item.actualCount}  шт`,
        sum: `${sum} руб`,
      };
    }),
  };

  const totalPrice = useMemo(() => {
    const workTotalPrice = workTasks.reduce((prev, item) => {
      const { hours, minuts } = getTime(item.actualTime);
      const sum = item.workTask.price * hours + Math.floor(item.workTask.price * minuts / 60);
      return prev + sum;
    }, 0);

    const materialTotalPrice = workMaterials.reduce((prev, item) => {
      const sum = item.actualCount * item.workMaterial.price;
      return prev + sum;
    }, 0);

    const clearPrice = workTotalPrice + materialTotalPrice;
    const taxPrice = (workTotalPrice + materialTotalPrice) * 0.2 + workTotalPrice + materialTotalPrice;
    return {
      clear: clearPrice,
      tax: taxPrice,
    };
  }, [workMaterials, workTasks]);

  const onDeleteMaterialHandler = useCallback((item: TableItemType) => {
    dispatch(addWorkMaterialToApplication({
      prevWorkMaterials: workMaterials
        .filter((material) => material.workMaterial.id !== item.id)
        .map((item) => ({
          workMaterial: item.workMaterial.id,
          actualCount: item.actualCount,
        })),
      applicationId,
    }));
  }, [dispatch, workMaterials, applicationId]);

  const onDeleteTaskHandler = useCallback((item: TableItemType) => {
    dispatch(addWorkTaskToApplication({
      prevWorkTasks: workTasks
        .filter((material) => material.workTask.id !== item.id)
        .map((item) => ({
          workTask: item.workTask.id,
          actualTime: item.actualTime,
        })),
      applicationId,
    }));
  }, [dispatch, workTasks, applicationId]);

  const { Table: WorkTasksTable } = useTable({
    data: workTasksTable,
    className: cls.table,
    onDelete: onDeleteTaskHandler,
    mod: (isInitiator || step === 2) ? TableItemsMod.NO_CONTROL : TableItemsMod.NORMAL,
    checkable: false,
  });

  const { Table: WorkMaterialsTable } = useTable({
    data: workMaterialsTable,
    className: cls.table,
    onDelete: onDeleteMaterialHandler,
    mod: (isInitiator || step === 2) ? TableItemsMod.NO_CONTROL : TableItemsMod.NORMAL,
    checkable: false,
  });

  const ChangeStepButton = useMemo(() => {
    if (!prepayment) {
      switch (step) {
        case 1:
          if (isSawatzky && (workTasksTable.items?.length || workMaterialsTable.items?.length)) {
            return (
              <Button
                theme={ButtonThemes.BLUE_SOLID}
                onClick={() => dispatch(nextApplicationStep({
                  applicationId,
                  step,
                }))}
              >Отправить на согласованию заказчику
              </Button>
            );
          }
          break;
        case 2:
          return (
            <Button
              theme={ButtonThemes.BLUE_SOLID}
              onClick={() => dispatch(nextApplicationStep({
                applicationId,
                step,
              }))}
            >Согласовать список работ
            </Button>
          );
        case 3:
          if (isSawatzky && (isDispatcher || isAdmin) && detail?.confirmations?.length) {
            return (
              <Button
                className={cls.blueBtn}
                theme={ButtonThemes.BLUE_SOLID}
                onClick={() => dispatch(nextApplicationStep({
                  applicationId,
                  step,
                }))}
              >
                Отправить на подтверждение заказчику
              </Button>
            );
          }
          break;
        case 4:
          if (!isSawatzky && detail?.confirmations?.length) {
            return (
              <div className={cls.btns}>
                <Button
                  className={cls.blueBtn}
                  theme={ButtonThemes.BLUE_SOLID}
                  onClick={() => dispatch(nextApplicationStep({
                    applicationId,
                    step,
                  }))}
                >
                  Согласовать
                </Button>
                <Button
                  className={cls.blueBtn}
                  theme={ButtonThemes.BLUE_SOLID}
                  onClick={() => dispatch(prevApplicationStep({
                    applicationId,
                    step,
                  }))}
                >
                  Отправить на доработку
                </Button>
              </div>
            );
          }
          break;
        case 5:
          if (isSawatzky && (isDispatcher || isAdmin) && detail?.confirmations?.length) {
            return (
              <Button
                className={cls.blueBtn}
                theme={ButtonThemes.BLUE_SOLID}
                onClick={() => dispatch(nextApplicationStep({
                  applicationId,
                  step,
                }))}
              >Завершить заявку
              </Button>
            );
          }
          break;
        default:
          return null;
      }
    } else {
      switch (step) {
        case 1:
          if (isSawatzky && (workTasksTable.items?.length || workMaterialsTable.items?.length)) {
            return (
              <Button
                theme={ButtonThemes.BLUE_SOLID}
                onClick={() => dispatch(nextApplicationStep({
                  applicationId,
                  step,
                }))}
              >Отправить на согласованию заказчику
              </Button>
            );
          }
          break;
        case 2:
          return (
            <Button
              theme={ButtonThemes.BLUE_SOLID}
              onClick={() => dispatch(nextApplicationStep({
                applicationId,
                step,
              }))}
            >Согласовать список работ
            </Button>
          );
        case 3:
          if (detail?.paymentSlips.length && prepayment) {
            return (
              <Button
                theme={ButtonThemes.BLUE_SOLID}
                onClick={() => dispatch(nextApplicationStep({
                  applicationId,
                  step,
                }))}
              >Отправить платежку
              </Button>
            );
          }
          break;
        case 4:
          if (isSawatzky && (isDispatcher || isAdmin) && detail?.confirmations?.length) {
            return (
              <Button
                className={cls.blueBtn}
                theme={ButtonThemes.BLUE_SOLID}
                onClick={() => dispatch(nextApplicationStep({
                  applicationId,
                  step,
                }))}
              >
                Отправить на подтверждение заказчику
              </Button>
            );
          }
          break;
        case 5:
          if (!isSawatzky && detail?.confirmations?.length) {
            return (
              <div className={cls.btns}>
                <Button
                  className={cls.blueBtn}
                  theme={ButtonThemes.BLUE_SOLID}
                  onClick={() => dispatch(nextApplicationStep({
                    applicationId,
                    step,
                  }))}
                >
                  Согласовать
                </Button>
                <Button
                  className={cls.blueBtn}
                  theme={ButtonThemes.BLUE_SOLID}
                  onClick={() => dispatch(prevApplicationStep({
                    applicationId,
                    step,
                  }))}
                >
                  Отправить на доработку
                </Button>
              </div>
            );
          }
          break;
        case 6:
          if (isSawatzky && (isDispatcher || isAdmin) && detail?.confirmations?.length) {
            return (
              <Button
                className={cls.blueBtn}
                theme={ButtonThemes.BLUE_SOLID}
                onClick={() => dispatch(nextApplicationStep({
                  applicationId,
                  step,
                }))}
              >Завершить заявку
              </Button>
            );
          }
          break;
        default:
          return null;
      }
    }
  }, [
    step,
    isSawatzky,
    workTasksTable.items,
    workMaterialsTable.items,
    applicationId, dispatch,
    detail?.paymentSlips.length,
    detail?.confirmations?.length,
    isDispatcher,
    isAdmin,
    prepayment,
  ]);

  return (
    <div>
      <CollapsBoard className={cls.collapse} title="Стоимость работ">
        <div className={cls.btns}>
          {
            ((isDispatcher || isAdmin) && step && (step <= 2) && (isSawatzky)) && (
              <>
                <Button
                  theme={ButtonThemes.CLEAR_BLUE}
                  className={cls.controlBtn}
                  onClick={() => dispatch(addWorkTaskApplicationFormActions.openModal())}
                >
                  + Добавить работы
                </Button>
                <Button
                  theme={ButtonThemes.CLEAR_BLUE}
                  className={cls.controlBtn}
                  onClick={() => dispatch(addWorkMaterialApplicationFormActions.openModal())}
                >+ Добавить расходный материал
                </Button>
              </>
            )
          }
          <Button
            theme={ButtonThemes.CLEAR_BLUE}
            className={cls.controlBtn}
            onClick={() => dispatch(addDocumentFormActions.openModal())}
          >+ Загрузить документ
          </Button>

          {
            ((step && step > 1) && (status !== ApplicationStatus.NEW && status !== ApplicationStatus.FINISHED) && isSawatzky && (isDispatcher || isAdmin)) && (
              <Button
                theme={ButtonThemes.BLUE_SOLID}
                size={ButtonSize.M}
                className={cls.controlBtn}
                onClick={() => dispatch(prevApplicationStep({
                  applicationId,
                  step,
                }))}
              > Перейти к предыдущему шагу
              </Button>
            )
          }
        </div>
        <div className={cls.tablesBlock}>
          {WorkTasksTable}
          {WorkMaterialsTable}
          <div className={cls.priceInfo}>
            <p className={cls.price}>
              Общая стоимость работ/услуг и материалов составляет
            </p>

            <div className={cls.total}>
              <b className={cls.totalPrice}>
                {totalPrice.clear} ₽
              </b>

              <p className={cls.text}> без  НДС</p>
            </div>

          </div>

          <div className={cls.priceInfo}>
            <p className={cls.price}>
              Общая стоимость работ/услуг и материалов составляет
            </p>

            <div className={cls.total}>
              <b className={cls.totalPrice}>
                {totalPrice.tax} ₽
              </b>

              <p className={cls.text}>  с НДС</p>
            </div>

          </div>
        </div>

        <div className={cls.docs}>
          {docList?.length !== 0 && <DocList onDelete={() => dispatch(fetchApplicationDetail(applicationId))} docs={docList} title="Список документов" />}
          {payList?.length !== 0 && <DocList docs={payList} onDelete={() => dispatch(fetchApplicationDetail(applicationId))} title="Платежный документ" />}
        </div>
        {ChangeStepButton}
      </CollapsBoard>

    </div>
  );
};

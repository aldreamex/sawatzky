import { classNames } from 'shared/lib/classNames/classNames';
import { useSelector } from 'react-redux';
import { StateSchema } from 'app/providers';
import { Title } from 'shared/ui/Title/Title';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Progressbar } from 'widgets/Progressbar';
import { AddWorkTaskApplicationModal, getAddWorkTaskApplicationFormIsOpen } from 'features/AddWorkTaskToApplication';
import { AddWorkMaterialApplicationModal, getAddWorkMaterialApplicationFormIsOpen } from 'features/AddWorkMaterialToApplication';
import {
  DocEntity,
  addDocumentFormActions,
  AddDocumentModal,
  getAddDocumentFormIsOpen,
} from 'features/AddDocument';
import { getWorkMaterialGroup } from 'entities/WorkMaterialGroup';
import { getApplicationDetail } from 'pages/ApplicationDetailPage/model/slice/applicationDetailSlice';
import { AddPerformerToApplicationModal, getAddPerformerToApplicationFormIsOpen } from 'features/AddPerformerToApplication';
import { getPerformer } from 'entities/Performer';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import { ApplicationStatus } from 'entities/Application';
import { Button, ButtonSize, ButtonThemes } from 'shared/ui/Button/Button';
import { createLegalEntityActions, CreateLegalEntityModal, getCreateLegalEntityIsOpen } from 'features/CreateLegalEntity';
import { ApplicationDetailWorkPrice } from '../ApplicationDetailWorkPrice/ApplicationDetailWorkPrice';
import { getApplicationDetailTitle } from '../../model/selectors/getApplicationDetailTitle';
import {
  getApplicationComments, getApplicationDetailInfo, getApplicationLogs, getApplicationPrepayment, getApplicationSawatzkyComments,
} from '../../model/selectors/getApplicationDetailInfo';
import { ApplicationDetailInfoComponent } from '../ApplicationDetailInfoComponent/ApplicationDetailInfoComponent';
import { getApplicationDetailWorkMaterials, getApplicationDetailWorkTasks } from '../../model/selectors/getApplicationDetailWorkTasks';
import { ApplicationDetailActs } from '../ApplicationDetailActs/ApplicationDetailActs';
import { ApplicationDetailPerformer } from '../ApplicationDetailPerformer/ApplicationDetailPerformer';
import { getApplicationDetailPerformers } from '../../model/selectors/getApplicatioinDetailPerformer';
import { nextApplicationStep } from '../../model/services/nextApplicationStep/nextApplicationStep';
import cls from './ApplicationDetailContent.module.scss';
import { getApplicationCreatorWorkTaskGroups } from '../../model/selectors/getApplicationDetailCreator';
import { ApplicationDetailComments } from '../ApplicationDetailComments/ApplicationDetailComments';
import { ApplicationDetailHistory } from '../ApplicationDetailHistory/ApplicationDetailHistory';
import { getApplicationDetailIsInit } from '../../model/selectors/getApplicationDetail';
import { ApplicationDetailLoader } from '../ApplicationDetailLoader/ApplicationDetailLoader';

interface ApplicationDetailContentProps {
  className?: string;
  applicationId: string;
}

export const ApplicationDetailContent: React.FC<ApplicationDetailContentProps> = (props) => {
  const { className, applicationId } = props;
  const dispatch = useAppDispatch();
  const { isSawatzky, isAdmin } = useUserData();
  const isInit = useSelector(getApplicationDetailIsInit);

  const detail = useSelector((state: StateSchema) => getApplicationDetail.selectById(state, applicationId));
  const info = useSelector((state: StateSchema) => getApplicationDetailInfo(state, applicationId));
  const title = useSelector((state: StateSchema) => getApplicationDetailTitle(state, applicationId));
  const workTasks = useSelector((state: StateSchema) => getApplicationDetailWorkTasks(state, applicationId));
  const workMaterials = useSelector((state: StateSchema) => getApplicationDetailWorkMaterials(state, applicationId));
  const addWorkTaskApplicationModalIsOpen = useSelector(getAddWorkTaskApplicationFormIsOpen);
  const addWorkMaterialApplicationModalIsOpen = useSelector(getAddWorkMaterialApplicationFormIsOpen);
  const addPerformerToApplicationFormIsOpen = useSelector(getAddPerformerToApplicationFormIsOpen);
  const addDocumentModalIsOpen = useSelector(getAddDocumentFormIsOpen);
  const workTaskGroups = useSelector((state: StateSchema) => getApplicationCreatorWorkTaskGroups(state, applicationId));
  const workMaterialGroups = useSelector(getWorkMaterialGroup.selectAll);
  const applicationPerformers = useSelector((state: StateSchema) => getApplicationDetailPerformers(state, applicationId));
  const performers = useSelector(getPerformer.selectAll);
  const { isDispatcher } = useUserData();
  const logs = useSelector((state: StateSchema) => getApplicationLogs(state, applicationId));
  const prepayment = useSelector((state: StateSchema) => getApplicationPrepayment(state, applicationId));

  const comments = useSelector((state: StateSchema) => getApplicationComments(state, applicationId));
  const sawatzkyComments = useSelector((state: StateSchema) => getApplicationSawatzkyComments(state, applicationId));

  const legalEntityFormIsOpen = useSelector(getCreateLegalEntityIsOpen);

  const onLegalEntityFormCloseHandler = useCallback(() => {
    dispatch(createLegalEntityActions.closeModal());
  }, [dispatch]);

  const openLegalEntityHandler = useCallback(() => {
    const legalEntitie = detail?.creator?.legalEntity;
    if (legalEntitie) {
      dispatch(createLegalEntityActions.openViewModal(legalEntitie));
    }
  }, [dispatch, detail]);

  useEffect(() => {
    if (isInit) {
      if (info?.status === ApplicationStatus.NEW && (isDispatcher || isAdmin) && isSawatzky) {
        dispatch(nextApplicationStep({ applicationId, step: info.step - 1 }));
      }
    }
  }, [isInit, info?.status, applicationId, dispatch, info?.step, isAdmin, isDispatcher, isSawatzky]);

  return (
    <div className={classNames(cls.applicationDetailContent, {}, [className])}>
      {
        info ? (
          <>
            <Title className={cls.title}>{title}</Title>
            <Button
              theme={ButtonThemes.BLACK_BORDER}
              size={ButtonSize.M}
              onClick={openLegalEntityHandler}
            >
              {detail?.creator?.legalEntity.workObject?.code} {detail?.creator?.legalEntity.name}
            </Button>
            <ApplicationDetailInfoComponent className={cls.infoComponent} info={info} />
            <Progressbar prepayment={prepayment ?? false} step={info.step} />
            <ApplicationDetailWorkPrice workTasks={workTasks} workMaterials={workMaterials} applicationId={applicationId} />
            <ApplicationDetailComments title="Комментарии к запросу" applicationId={applicationId} commentList={comments} />
            {
              Boolean(prepayment ? ((info.step >= 4 && isSawatzky)) : ((info.step >= 3 && isSawatzky)))
              && <ApplicationDetailPerformer applicationId={applicationId} performers={applicationPerformers} />
            }

            <ApplicationDetailActs applicationId={applicationId} acts={detail?.acts} />

            {
              (isSawatzky) && (
                <ApplicationDetailComments
                  isSawatzkyBlock
                  title="Внутренние комментарии сотрудников Sawatzky"
                  applicationId={applicationId}
                  commentList={sawatzkyComments}
                />
              )
            }
            {
              logs && <ApplicationDetailHistory historyList={logs} />
            }
          </>
        )
          : <ApplicationDetailLoader />
      }

      {/* Modals */}
      <AddDocumentModal
        docEntity={DocEntity.APPLICATION}
        onClose={() => dispatch(addDocumentFormActions.closeModal())}
        isOpen={addDocumentModalIsOpen}
      />

      <AddWorkTaskApplicationModal
        isOpen={addWorkTaskApplicationModalIsOpen}
        workTaskGroups={workTaskGroups}
        applicationId={applicationId}
        prevWorkTasks={workTasks}
      />
      <AddWorkMaterialApplicationModal
        isOpen={addWorkMaterialApplicationModalIsOpen}
        workMaterialGroups={workMaterialGroups}
        applicationId={applicationId}
        prevWorkMaterials={workMaterials}
      />
      <AddPerformerToApplicationModal
        applicationId={applicationId}
        performers={performers}
        prevPerformers={applicationPerformers}
        isOpen={addPerformerToApplicationFormIsOpen}
      />
      <CreateLegalEntityModal
        isSawatzky={false}
        onClose={onLegalEntityFormCloseHandler}
        isOpen={legalEntityFormIsOpen}
        className={cls.form}
      />
    </div>

  );
};

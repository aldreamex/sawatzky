import { Modal } from 'shared/ui/Modal/Modal';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import { fetchApplicationsByLegalEntity } from 'features/EditGeneralJournal/model/services/fetchApplicationsByLegalEntity';
import { editGeneralJournalActions } from 'features/EditGeneralJournal';
import cls from './EditGeneralJournalModal.module.scss';
import { CreateGeneralJournalForm, formatApplicationString } from '../EditGeneralJournalForm/EditGeneralJournalForm';
import { createGeneralJournalActions } from '../../model/slice/editGeneralJournalSlice';
import { getCreateGeneralJournalIsOpen, getEditGeneralJournalInfo } from '../../model/selectors/editGeneralJournalSelectors';

interface CreateEmployeeModalProps {
  className?: string;
  onClose?: () => void;
  isSawatzky?: boolean;
}

export const CreateGeneralJournalModal: React.FC<CreateEmployeeModalProps> = (props) => {
  const { onClose, isSawatzky = false } = props;
  const dispatch = useAppDispatch();
  const isOpen = useSelector(getCreateGeneralJournalIsOpen);
  const info = useSelector(getEditGeneralJournalInfo);

  useEffect(() => {
    if (info?.legalEntity?.id) {
      dispatch(fetchApplicationsByLegalEntity(info?.legalEntity?.id));
      const selectedApplications = info.application.map((item: any) => ({
        text: formatApplicationString(item),
        value: item?.application_id || item.id,
      }));
      dispatch(editGeneralJournalActions.setSelectedApplications(selectedApplications));
    }
  }, [info]);

  const closeHandler = useCallback(() => {
    onClose?.();
    dispatch(createGeneralJournalActions.closeModal());
  }, [dispatch, onClose]);

  return (
    <Modal className={cls.createEmployeeModal} isOpen={isOpen} onClose={closeHandler}>
      <CreateGeneralJournalForm />
    </Modal>
  );
};

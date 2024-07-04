import { Modal } from 'shared/ui/Modal/Modal';
import { useCallback } from 'react';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import cls from './CreateGeneralJournalModal.module.scss';
import { CreateGeneralJournalForm } from '../CreateGeneralJournalForm/CreateGeneralJournalForm';
import { createGeneralJournalActions } from '../../model/slice/createGeneralJournalSlice';
import { getCreateGeneralJournalIsOpen } from '../../model/selectors/createGeneralJournalSelectors';

interface CreateEmployeeModalProps {
  className?: string;
  onClose?: () => void;
  isSawatzky?: boolean;
}

export const CreateGeneralJournalModal: React.FC<CreateEmployeeModalProps> = (props) => {
  const { onClose, isSawatzky = false } = props;
  const dispatch = useAppDispatch();
  const isOpen = useSelector(getCreateGeneralJournalIsOpen);

  const closeHandler = useCallback(() => {
    onClose?.();
    dispatch(createGeneralJournalActions.closeModal());
  }, [dispatch, onClose]);

  return (
    <Modal className={cls.createGeneralJournalModal} isOpen={isOpen} onClose={closeHandler}>
      <CreateGeneralJournalForm />
    </Modal>
  );
};

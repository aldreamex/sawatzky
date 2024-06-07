import { Modal } from 'shared/ui/Modal/Modal';
import { useCallback } from 'react';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import cls from './CreateEmployeeModal.module.scss';
import { CreateSawatzkyEmployeeForm } from '../CreateSawatzkyEmployeeForm/CreateSawatzkyEmployeeForm';
import { CreateEmployeeForm } from '../CreateEmployeeForm/CreateEmployeeForm';
import { createEmployeeActions } from '../../model/slice/createEmployeeSlice';
import { getCreateEmployeeIsOpen } from '../../model/selectors/createEmployeeSelectors';

interface CreateEmployeeModalProps {
  className?: string;
  onClose?: () => void;
  isSawatzky?: boolean;
}

export const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = (props) => {
  const { onClose, isSawatzky = false } = props;
  const dispatch = useAppDispatch();
  const isOpen = useSelector(getCreateEmployeeIsOpen);

  const closeHandler = useCallback(() => {
    onClose?.();
    dispatch(createEmployeeActions.closeModal());
  }, [dispatch, onClose]);

  return (
    <Modal className={cls.createEmployeeModal} isOpen={isOpen} onClose={closeHandler}>
      {
        isSawatzky
          ? <CreateSawatzkyEmployeeForm />
          : <CreateEmployeeForm />
      }
    </Modal>
  );
};

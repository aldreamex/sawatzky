import { classNames } from 'shared/lib/classNames/classNames';
import { Modal } from 'shared/ui/Modal/Modal';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { CreateApplicationForm } from '../CreateApplicationForm/CreateApplicationForm';
import { getFormApplicationIsOpen } from '../../model/selectors/createApplicationSelectors';
import { createApplicationActions } from '../../model/slice/createApplicationSlice';

interface CreateApplicationModalProps {
	className?: string;
	onClose?: () => void;
}

export const CreateApplicationModal: React.FC<CreateApplicationModalProps> = (props) => {
  const { className, onClose } = props;

  const isOpen = useSelector(getFormApplicationIsOpen);
  const dispatch = useAppDispatch();

  const closeHandler = useCallback(() => {
    onClose?.();
    dispatch(createApplicationActions.clearForm());
    dispatch(createApplicationActions.closeCalendar());
    dispatch(createApplicationActions.clearWorkDates());
    dispatch(createApplicationActions.closeForm());
  }, [onClose, dispatch]);

  return (
    <Modal className={classNames('', {}, [className])} isOpen={isOpen} onClose={closeHandler}>
      {isOpen && <CreateApplicationForm onClose={closeHandler} />}
    </Modal>
  );
};

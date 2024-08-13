import { classNames } from 'shared/lib/classNames/classNames';
import { Logo } from 'shared/ui/Logo/Logo';
import { DropdownMenu } from 'widgets/DropdownMenu/DropdownMenu';
import { ChangePasswordModal } from 'features/ChangePassword';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { changePasswordActions, changePasswordReducer } from 'features/ChangePassword/model/slice/changePasswordSlice';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import { getChangePasswordIsOpen } from 'features/ChangePassword/model/selectors/changePasswordSelectors';
import { useCallback } from 'react';
import cls from './Header.module.scss';

interface HeaderProps {
  className?: string;
}

const reducers: ReducersList = {
  changePasswordForm: changePasswordReducer,
};

export const Header: React.FC<HeaderProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  const changePasswordFormIsOpen = useSelector(getChangePasswordIsOpen);

  const onChangePasswordModalCloseHandler = useCallback(() => {
    dispatch(changePasswordActions.closeModal());
  }, [dispatch]);

  const onChangePasswordOpenHandler = useCallback(() => {
    dispatch(changePasswordActions.openModal());
  }, [dispatch]);

  return (
    <DynamicModuleLoader reducers={reducers}>
      <div className={classNames(cls.header, {}, [className ?? ''])}>
        <Logo width={121} className={cls.logo} />
        <DropdownMenu onChangePass={onChangePasswordOpenHandler} />
        <ChangePasswordModal isOpen={changePasswordFormIsOpen} onClose={onChangePasswordModalCloseHandler} />
      </div>
    </DynamicModuleLoader>
  );
};

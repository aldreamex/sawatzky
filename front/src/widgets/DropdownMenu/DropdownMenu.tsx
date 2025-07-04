import { classNames } from 'shared/lib/classNames/classNames';
import { useSelector } from 'react-redux';
import { getUserAuthData, userActions } from 'entities/User';
import { Avatar } from 'shared/ui/Avatar/Avatar';
import { useCallback, useState } from 'react';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import cls from './DropdownMenu.module.scss';

interface DropdownMenuProps {
  className?: string;
  onChangePass?: () => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = (props) => {
  const { className, onChangePass } = props;
  const user = useSelector(getUserAuthData);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useAppDispatch();

  const onClickHandler = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const onLogoutHandler = useCallback(() => {
    dispatch(userActions.logout());
  }, [dispatch]);

  return (
    <div
      className={classNames(cls.dropdownMenu, {
        [cls.active]: isCollapsed,
      }, [className])}
      onClick={onClickHandler}
    >
      <div className={cls.preview}>
        <Avatar size={25} />
        <span className={cls.text}>{user?.fio}</span>
      </div>
      <div className={cls.menu}>
        <div className={cls.column} style={{ minHeight: 0 }}>
          <Button
            theme={ButtonThemes.CLEAR}
            className={classNames(cls.button, {}, [cls.pass])}
            onClick={onChangePass}
          >
            Сменить пароль
          </Button>
          <Button className={cls.button} onClick={onLogoutHandler} theme={ButtonThemes.CLEAR}>Выйти</Button>
        </div>
      </div>
    </div>
  );
};

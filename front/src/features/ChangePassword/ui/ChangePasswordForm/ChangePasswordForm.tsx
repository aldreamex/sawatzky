import { classNames } from 'shared/lib/classNames/classNames';
import { Text, TextAlign } from 'shared/ui/Text/Text';
import { Input } from 'shared/ui/Input/Input';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { changePasswordActions } from 'features/ChangePassword/model/slice/changePasswordSlice';
import cls from './ChangePasswordForm.module.scss';

interface ChangePasswordFormProps {
  className?: string;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  return (
    <div className={classNames(cls.changePasswordForm, {}, [className])}>
      <Text className={cls.title} title="Смена пароля" textAlign={TextAlign.CENTER} />
      <Input className={cls.input} placeholder="Текущий пароль" />
      <Input className={cls.input} placeholder="Новый пароль" />
      <Input className={cls.input} placeholder="Подтверждение пароля" />
      <div className={cls.buttons}>
        <Button className={cls.btn} theme={ButtonThemes.BLUE_SOLID}>Сохранить</Button>
        <Button className={cls.btn} theme={ButtonThemes.BLUE_BORDER} onClick={() => dispatch(changePasswordActions.closeModal())}>Отмена</Button>
      </div>
    </div>
  );
};

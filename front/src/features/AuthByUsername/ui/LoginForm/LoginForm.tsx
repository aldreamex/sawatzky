import { classNames } from 'shared/lib/classNames/classNames';
import { Title } from 'shared/ui/Title/Title';
import { useSelector } from 'react-redux';
import { memo, useCallback } from 'react';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Text, TextTheme } from 'shared/ui/Text/Text';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'shared/config/RouteConfig/appRouteConfig';
import { Logo } from 'shared/ui/Logo/Logo';
import { FormType, useForm } from 'shared/lib/hooks/useForm/useForm';
import { getLoginIsCheck } from 'features/AuthByUsername/model/selectors/getLoginIsCheck/getLoginIsCheck';
import { getLoginError } from '../../model/selectors/getLoginError/getLoginError';
import { getLoginPassword } from '../../model/selectors/getLoginPassword/getLoginPassword';
import { getLoginUsername } from '../../model/selectors/getLoginUsername/getLoginUsername';
import { loginActions, loginReducer } from '../../model/slice/loginSlice';
import cls from './LoginForm.module.scss';
import { createTokensByUsername } from '../../model/services/createTokensByUsername/createTokensByUsername';
import { fetchUserDataByToken } from '../../model/services/fetchUserDataByToken/fetchUserDataByToken';

interface LoginFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  loginForm: loginReducer,
};

export const LoginForm: React.FC<LoginFormProps> = memo((props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const username = useSelector(getLoginUsername);
  const password = useSelector(getLoginPassword);
  const error = useSelector(getLoginError);
  // const isLoading = useSelector(getLoginIsLoading);
  const isCheck = useSelector(getLoginIsCheck);

  const onChangeUsername = useCallback((value: string) => {
    dispatch(loginActions.setUsername(value));
  }, [dispatch]);

  const onChangePassword = useCallback((value: string) => {
    dispatch(loginActions.setPassword(value));
  }, [dispatch]);

  const onChangeIsCheck = useCallback((value: boolean) => {
    dispatch(loginActions.setIsCheck(value));
  }, [dispatch]);

  const onLoginClick = useCallback(async () => {
    dispatch(createTokensByUsername({ username, password })).then((data) => {
      dispatch(fetchUserDataByToken()).then(() => {
        navigate(RoutePath.applications);
      });
    });
  }, [dispatch, username, password, navigate]);

  const { Form } = useForm({
    fields: [
      {
        id: 'login',
        type: FormType.TEXT,
        defaultValue: username,
        value: username,
        placeholder: 'Логин',
        onChange: onChangeUsername,
        rules: {
          required: true,
        },
      },
      {
        id: 'password',
        type: FormType.PASSWORD,
        defaultValue: password,
        value: password,
        placeholder: 'Пароль',
        onChange: onChangePassword,
        rules: {
          required: true,
        },
      },
      {
        id: 'check',
        type: FormType.CHECKBOX,
        defaultValue: isCheck,
        value: isCheck,
        label: 'Я не робот',
        onChange: onChangeIsCheck,
        rules: {
          required: true,
          booleanTrue: true,
        },
      },
    ],
    onSubmit: onLoginClick,
    submitTitle: 'Войти',
  });

  return (
    <DynamicModuleLoader reducers={initialReducers} removeAfterUnmount>
      <div className={classNames(cls.loginForm, {}, [className ?? ''])}>
        <Logo width={159} className={cls.logo} />
        <Title className={cls.title}>Вход</Title>

        {Form}
        {error && <Text text={error} theme={TextTheme.ERROR} className={cls.error} />}
      </div>
    </DynamicModuleLoader>
  );
});

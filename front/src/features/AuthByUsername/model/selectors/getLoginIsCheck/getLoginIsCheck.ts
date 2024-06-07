import { StateSchema } from 'app/providers';

export const getLoginIsCheck = (state: StateSchema) => state.loginForm?.isCheck;

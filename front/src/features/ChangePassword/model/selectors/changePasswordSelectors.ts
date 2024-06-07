import { StateSchema } from 'app/providers';

export const getChangePasswordIsOpen = (state: StateSchema) => state.changePasswordForm?.isOpen;

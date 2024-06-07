import { EmployeeRole } from 'entities/Employee';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';

interface RoleProviderProps {
  children?: React.ReactNode;
  sawatzkyOnly: boolean;
  permittedRoles?: EmployeeRole[];
}

export const RoleProvider = (props: RoleProviderProps) => {
  const { children, sawatzkyOnly, permittedRoles } = props;
  const location = useLocation();
  const { isSawatzky, role } = useUserData();

  if (permittedRoles?.length ? (role && !permittedRoles?.includes(role)) : null) {
    return (
      <Navigate
        to="/forbidden"
        replace // <-- redirect
        state={{ path: location.pathname }}
      />
    );
  }

  if ((sawatzkyOnly && !isSawatzky)) {
    return (
      <Navigate
        to="/forbidden"
        replace // <-- redirect
        state={{ path: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

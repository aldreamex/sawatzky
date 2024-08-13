import { getUserAuthData } from 'entities/User';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
  children?: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const location = useLocation();
  const userAuthData = useSelector(getUserAuthData);

  if (!userAuthData) {
    return (
      <Navigate
        to="/login"
        replace // <-- redirect
        state={{ path: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

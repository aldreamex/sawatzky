import { classNames } from 'shared/lib/classNames/classNames';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import cls from './Navigation.module.scss';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import { SidebarItemsList } from '../models/types/sidebar';

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = (props) => {
  const { className } = props;
  const { pathname } = useLocation();
  const { role, isSawatzky } = useUserData();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div
      className={classNames(cls.navigation, {
        [cls.collapsed]: isCollapsed,
      }, [className ?? ''])}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}

    >
      {
        SidebarItemsList
          .filter((item) => !item.isHidden)
          .filter((item) => (!((item.sawatzkyOnly && !isSawatzky))))
          .filter((item) => (item?.permittedRoles?.length ? !(!item.permittedRoles?.includes(role)) : true))
          .map((item) => (
            <SidebarItem
              item={item}
              key={item.path}
              isCollapsed={isCollapsed}
              isActive={pathname.split('/')[1] === item.path.split('/')[1]}
            />
          ))
      }
    </div>
  );
};

import { classNames } from 'shared/lib/classNames/classNames';
import { DirectoryLinkType } from 'widgets/DirectoryNavigaion/model/type/directoryNavigation';
import { AppLInkTheme, AppLink } from 'shared/ui/AppLink/AppLink';
import { useLocation } from 'react-router-dom';

interface DirectoryNavigationLinkItemProps {
  className?: string;
  link: DirectoryLinkType;
}

export const DirectoryNavigationLinkItem: React.FC<DirectoryNavigationLinkItemProps> = (props) => {
  const { className, link } = props;
  const { pathname } = useLocation();
  const linkPath = `${link.path}/`;

  return (
    <AppLink to={link.path} isActive={pathname === link.path || pathname.includes(linkPath)} theme={AppLInkTheme.BUTTON} className={classNames('', {}, [className])}>
      {link.text}
    </AppLink>
  );
};

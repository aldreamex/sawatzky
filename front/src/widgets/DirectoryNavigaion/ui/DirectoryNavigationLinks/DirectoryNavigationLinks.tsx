import { classNames } from 'shared/lib/classNames/classNames';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import cls from './DirectoryNavigationLinks.module.scss';
import { DirectoryLinkType } from '../../model/type/directoryNavigation';
import { DirectoryNavigationLinkItem } from '../DirectoryNavigationLinkItem/DirectoryNavigationLinkItem';

interface DirectoryNavigationLinksProps {
  className?: string;
  links?: DirectoryLinkType[];
}

export const DirectoryNavigationLinks: React.FC<DirectoryNavigationLinksProps> = (props) => {
  const { className, links } = props;
  const { isSawatzky, role } = useUserData();

  return (
    <div className={classNames(cls.directoryNavigationLinks, {}, [className])}>
      <div className={cls.list}>
        {
          links && links
            .filter((link) => (!((link.sawatzkyOnly && !isSawatzky))))
            .filter((link) => (link?.permittedRoles?.length ? !(!link.permittedRoles?.includes(role)) : true))
            .map((link) => (
              <DirectoryNavigationLinkItem
                className={cls.link}
                link={link}
                key={`directoryNavLink_${link.path}`}
              />
            ))
        }
      </div>
    </div>
  );
};

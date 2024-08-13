import { classNames } from 'shared/lib/classNames/classNames';
import { Application } from 'entities/Application';
import { Tag } from 'shared/ui/Tag/Tag';
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'shared/config/RouteConfig/appRouteConfig';
import { getDateString } from 'shared/lib/getDateString/getDateString';
import cls from './ApplicationPreviewItem.module.scss';

interface ApplicationPreviewItemProps {
  className?: string;
  item: Application;
}

export const ApplicationPreviewItem: React.FC<ApplicationPreviewItemProps> = memo((props) => {
  const { className, item } = props;

  const navigate = useNavigate();
  const onClickHandler = useCallback(() => {
    navigate(`${RoutePath.application_detail}${item.id}`);
  }, [navigate, item]);

  return (
    <div className={classNames(cls.applicationPreviewItem, {}, [className])}>
      <div className={classNames(cls.header)}>
        <div className={cls.info}>
          <span className={cls.title}>
            {item.title}
          </span>
          <span className={cls.number}>
            Запрос № {item.id}
          </span>
        </div>
      </div>
      <div className={classNames(cls.applicationPreviewItemRow, {}, [])} onClick={onClickHandler}>
        <div className={classNames(cls.column, {}, [cls.firstColumn])}>
          <span className={cls.subtitle}>Дата создания: {getDateString(new Date(item.createdAt), true)}</span>
          <Tag className={cls.tag} status={item.status} />
        </div>
        <div className={classNames(cls.column, {}, [cls.subject])}>
          <span className={cls.subtitle}>Предмет запроса:</span>
          <p className={cls.text}>{item.subject ?? 'Предмет запроса отсутствует'}</p>
        </div>
        <div className={classNames(cls.verticalLine, {}, [cls.column])} />
        <div className={classNames(cls.column, {}, [cls.description])}>
          <p>
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
});

import { classNames } from 'shared/lib/classNames/classNames';
import { getDateString } from 'shared/lib/getDateString/getDateString';
import { Tag } from 'shared/ui/Tag/Tag';
import { ReactComponent as PenIcon } from 'shared/assets/icons/pen-icon.svg';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { createApplicationActions, CreateApplicationModal } from 'features/CreateApplication';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import { useCallback } from 'react';
import { createEmployeeActions, CreateEmployeeModal } from 'features/CreateEmployee';
import cls from './ApplicationDetailInfoComponent.module.scss';
import { ApplicationInfo } from '../../model/type/applicationDetail';

interface ApplicationDetailInfoComponentProps {
  className?: string;
  info: ApplicationInfo;
}

export const ApplicationDetailInfoComponent: React.FC<ApplicationDetailInfoComponentProps> = (props) => {
  const { className, info } = props;

  const dispatch = useAppDispatch();
  const { isSawatzky } = useUserData();

  const onCreatorClickHandler = useCallback(() => {
    const employee = info.creator;
    if (employee) {
      dispatch(createEmployeeActions.openViewModal(employee));
    }
  }, [dispatch, info]);

  return (
    <div className={classNames(cls.applicationDetailInfoComponent, {}, [className])}>
      <div className={classNames(cls.firstColumn, {}, [cls.column])}>
        <h2 className={cls.title}>Информация по запросу</h2>
        <span className={classNames(cls.text, {}, [cls.name])}><b className={cls.textBold}>Название: </b>{info.title}</span>
        <span className={cls.text}><b className={cls.textBold}>Код:</b> {info.id}</span>
        <span className={cls.text}>
          <b className={cls.textBold}>Создал запрос:</b>
          <Button
            theme={ButtonThemes.CLEAR}
            onClick={onCreatorClickHandler}
            className={cls.creatorButtom}
          >
            {info.creator?.user.fio}
          </Button>
        </span>
        <Tag status={info.status} />
      </div>
      <div className={classNames(cls.secondColumn, {}, [cls.column])}>
        <span className={cls.text}>
          <b className={cls.textBold}>Дата запроса: </b>
          {getDateString(new Date(info.createdAt), true)}
        </span>
        <span className={cls.text}>
          <b className={cls.textBold}>Желаемая дата проведения работ: </b>
          {
            info.startWorkDate && info.endWorkDate
              ? `${getDateString(new Date(info.startWorkDate), true)} — ${getDateString(new Date(info.endWorkDate), true)}`
              : 'Дата отсутствует'
          }
        </span>
      </div>
      <div className={cls.verticalLine} />
      <div className={classNames(cls.thirdColumn, {}, [cls.column])}>
        <span className={cls.text}>
          {info.description}
        </span>
      </div>
      {
        ((info.step < 4 && info.creator?.legalEntity.prepayment) || (info.step < 3 && !info.creator?.legalEntity.prepayment) || isSawatzky) && (
          <Button
            theme={ButtonThemes.CLEAR}
            className={cls.button}
            onClick={() => dispatch(createApplicationActions.openEditForm(info))}
          >
            <PenIcon className={cls.icon} />
          </Button>
        )
      }

      <CreateApplicationModal />
      <CreateEmployeeModal
        className={cls.form}
      />
    </div>
  );
};

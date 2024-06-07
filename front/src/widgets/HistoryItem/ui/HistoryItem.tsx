import { classNames } from 'shared/lib/classNames/classNames';
import { History } from 'entities/History';
import { getDateString } from 'shared/lib/getDateString/getDateString';
import { getTimeString } from 'shared/lib/getTimeString/getTimeString';
import { EmployeeRoleValue } from 'entities/Employee';
import cls from './HistoryItem.module.scss';

interface HistoryItemProps {
  className?: string;
  item: History;
}

export const HistoryItem: React.FC<HistoryItemProps> = (props) => {
  const { className, item } = props;

  return (
    <div className={classNames(cls.historyItem, {}, [className])}>
      <div className={cls.leftSide}>
        <div className={cls.info}>
          {
            item.changeDate && (
              <div className={cls.term}>
                <p className={cls.date}>{getDateString(new Date(item.changeDate))}</p>
                <p className={cls.time}>{getTimeString(new Date(item.changeDate))}</p>
              </div>
            )
          }
          <div className={cls.persone}>
            <p className={cls.role}>{EmployeeRoleValue[item.role]}: </p>
            <p className={cls.name}>{item.changer}</p>
          </div>
        </div>
        {/* {item?.docList && (<DocList docs={item.docList} />)} */}
      </div>
      <div className={cls.rightSide}>
        <p className={cls.action}>
          {item.whatChange}
        </p>

        {/* {item?.comment && (
          <p className={cls.comment}>
            {item?.comment}
          </p>
        )} */}
      </div>
    </div>
  );
};

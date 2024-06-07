import { classNames } from 'shared/lib/classNames/classNames';
import cls from './ReportsList.module.scss';

interface ReportsListProps {
  className?: string;
  table?: any;
}

export const ReportsList: React.FC<ReportsListProps> = (props) => {
  const { className, table } = props;

  return (
    <div className={classNames(cls.reportsList, {}, [className])}>
      {table}
    </div>
  );
};

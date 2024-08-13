import { classNames } from 'shared/lib/classNames/classNames';
import { Report } from 'entities/Report';
import cls from './ReportDocumentTitle.module.scss';

interface ReportDocumentTitleProps {
  className?: string;
  report: Partial<Report> | null;
}

export const ReportDocumentTitle: React.FC<ReportDocumentTitleProps> = (props) => {
  const { className, report } = props;

  return (
    <div className={classNames(cls.reportDocumentTitle, {}, [className])}>
      <p className={cls.bold}>РЕЕСТР ЗАПРОСОВ</p>
      <p className={cls.text}>По договору возмездного оказания услуг № 001 от 01.01.2023</p>
      <p className={cls.text}>За период с 01.09.2023 по 30.09.2023</p>
    </div>
  );
};

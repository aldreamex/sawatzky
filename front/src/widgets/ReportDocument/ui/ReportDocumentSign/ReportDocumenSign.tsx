import { classNames } from 'shared/lib/classNames/classNames';
import cls from './ReportDocumenSign.module.scss';

interface ReportDocumenSignProps {
  className?: string;
  title: string;
  company: string;
  sign: string;
}

export const ReportDocumenSign: React.FC<ReportDocumenSignProps> = (props) => {
  const {
    className, title, company, sign,
  } = props;

  return (
    <div className={classNames(cls.reportDocumenSign, {}, [className])}>
      <p className={cls.title}>{title}</p>
      <p className={cls.title}>{company}</p>
      <div className={cls.sign}>
        <div className={cls.border} />
        <p>(ФИО представителя {sign})</p>
      </div>
    </div>
  );
};

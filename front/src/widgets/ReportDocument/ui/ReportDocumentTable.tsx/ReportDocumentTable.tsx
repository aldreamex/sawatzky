import { classNames } from 'shared/lib/classNames/classNames';
import { Report } from 'entities/Report';
import cls from './ReportDocumentTable.module.scss';

interface ReportDocumentTableProps {
  className?: string;
  report: Partial<Report> | null;
}

export const ReportDocumentTable: React.FC<ReportDocumentTableProps> = (props) => {
  const { className, report } = props;

  return (
    <div className={classNames(cls.reportDocumentTable, {}, [className])}>
      <table>
        <tr>
          <th>Номер запроса</th>
          <th>Дата размещения запроса</th>
          <th>Инициатор</th>
          <th>Доверенность</th>
          <th>Описание запроса</th>
          <th>Фактическая дата выполнения запроса</th>
          <th>Сумма без НДС, руб.</th>
          <th>В т. числе НДС 20%, руб.</th>
          <th>Сумма с учётом НДС, руб.</th>
        </tr>
        <tr>
          <td>КН-001</td>
          <td>12.09.2023</td>
          <td>Смирнов А.В.</td>
          <td>№1091 от 02.03.2023</td>
          <td>Прошу выполнить комплектацию с/у расходными материалами в августе 2023</td>
          <td>19.09.2023</td>
          <td>1500.00 руб.</td>
          <td>300.00 руб.</td>
          <td>1800.00 руб.</td>
        </tr>
        <tr>
          <td>КН-002</td>
          <td>12.09.2023</td>
          <td>Смирнов А.В.</td>
          <td>№1091 от 02.03.2023</td>
          <td>Прошу выполнить комплектацию с/у расходными материалами в августе 2023</td>
          <td>19.09.2023</td>
          <td>1500.00 руб.</td>
          <td>300.00 руб.</td>
          <td>1800.00 руб.</td>
        </tr>
        <tr>
          <td>КН-003</td>
          <td>12.09.2023</td>
          <td>Смирнов А.В.</td>
          <td>№1091 от 02.03.2023</td>
          <td>Прошу выполнить комплектацию с/у расходными материалами в августе 2023</td>
          <td>19.09.2023</td>
          <td>1500.00 руб.</td>
          <td>300.00 руб.</td>
          <td>1800.00 руб.</td>
        </tr>
        <tr>
          <td colSpan={8} className={cls.bigCell}>Итого</td>
          <td className={cls.total}>1800.00 руб.</td>
        </tr>
      </table>
    </div>
  );
};

import { TableItemsMod, TableItemType, TableType } from 'widgets/Table';
import React, { useMemo } from 'react';
import { ReactComponent as PenIcon } from 'shared/assets/icons/pen-icon_thin.svg';
import { useTable } from 'shared/lib/hooks/useTable';
import clsTableItemHeader from 'widgets/Table/ui/TableItemHeader/TableItemHeader.module.scss';
import { StatusesTranslations, StatusesEnum } from 'entities/GeneralJournal/model/type/generalJournal';
import { formatCurrency } from 'shared/lib/data/utiils';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { editGeneralJournalActions } from 'features/EditGeneralJournal';
import { classNames } from 'shared/lib/classNames/classNames';
import cls from './PaymentDocument.module.scss';

interface DirectoryEmployeePageProps {
  className?: string;
  info?: any
}

const PaymentDocument: React.FC<DirectoryEmployeePageProps> = (props) => {
  const { className, info } = props;
  const dispatch = useAppDispatch();

  const statusClass = cls[`statusBadge-${info?.status}`];
  const totalApplicationsSum = useMemo(() => formatCurrency('1000'), []);
  const restOfThePayment = useMemo(() => formatCurrency('1300'), []);

  const tableDataInner: TableType = useMemo(() => ({
    header: {
      id: 'Номер заявки',
      name: 'Название',
      applicationAmount: 'Сумма заявки',
      deptAmount: 'Сумма долга',
      paymentAmount: 'Сумма оплаты',
    },
    items: [
      ...(info?.application.map((application: any) => (
        {
          status: (
            <div className={cls.tableFirstHeader} style={{ flex: 1 }}>
              <div className={cls.tableItemStatus} />
              <div className={clsTableItemHeader.text}> { application?.id || application.application_id } </div>
            </div>
          ),
          // id: <div className={clsTableItemHeader.text}> { application.id } </div>,
          name: application.title,
          applicationAmount: formatCurrency(application.totalSum || ''),
          deptAmount: formatCurrency(application.totalDebt || ''),
          paymentAmount: formatCurrency(application.totalPayment || ''),
        })) || [{
        status: '-',
        name: '-',
        applicationAmount: '-',
        deptAmount: '-',
        paymentAmount: '-',
      }]),
    ],

  }), [info]);

  const { Table: TableInner } = useTable({
    data: tableDataInner,
    onDelete: () => {},
    onEdit: () => {},
    mod: TableItemsMod.RESET,
    checkable: false,
    collapsable: false,
    headerMod: TableItemsMod.RESET,
    textAlignment: 'center',
    // headerMod:  ItemTheme.HEADER
  });

  const tableData: TableType = useMemo(() => ({
    header: {
      // status: <div style={{ width: '20px' }} />,
      id: (
        <div
          className={clsTableItemHeader.text}
          onClick={(e) => {
            e.stopPropagation();
            console.log('info', info);
            dispatch(editGeneralJournalActions.openCreateModal(info));
          }}
        >
          <PenIcon style={{ fill: '#C18D06' }} /> { info?.paymentDocumentNumber }
        </div>
      ),
      counterparty: info?.legalEntity?.name,
      createdAt: info?.receiptDate || '-', // '1 000 000 руб.',
      totalAmount: formatCurrency(info?.totalAmount),
      totalApplicationsSum,
      restOfThePayment,
      status: (
        <div className={classNames(clsTableItemHeader.column, {}, [])}>
          <div className={`${cls.statusBadge} ${statusClass}`}>
            <span> {info?.status && StatusesTranslations[info?.status as StatusesEnum]}
            </span>
          </div>
        </div>
      ),
    },
    items: [<div key={1}>{TableInner}</div>],

  }), [info, TableInner]);

  const { Table, selectedItems } = useTable({
    data: tableData,
    onDelete: () => {},
    onEdit: () => {},
    // mod: TableItemsMod.RESET,
    checkable: false,
    collapsable: true,
    // headerMod:  ItemTheme.HEADER
    mod: TableItemsMod.RESET,
  });

  return (
    <div className={cls.tableItemList}>
      {Table}
    </div>
  );
};

export default PaymentDocument;

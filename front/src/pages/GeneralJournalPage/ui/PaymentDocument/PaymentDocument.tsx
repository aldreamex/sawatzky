import { TableItemsMod, TableItemType, TableType } from 'widgets/Table';
import React, { useMemo, useCallback } from 'react';
import { ReactComponent as PenIcon } from 'shared/assets/icons/pen-icon_thin.svg';
import { useTable } from 'shared/lib/hooks/useTable';
import clsTableItemHeader from 'widgets/Table/ui/TableItemHeader/TableItemHeader.module.scss';
import { StatusesTranslations, StatusesEnum } from 'entities/GeneralJournal/model/type/generalJournal';
import { formatCurrency } from 'shared/lib/data/utiils';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { editGeneralJournalActions } from 'features/EditGeneralJournal';
import { classNames } from 'shared/lib/classNames/classNames';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { ReactComponent as CrossIcon } from 'shared/assets/icons/cross-icon.svg';
import cls from './PaymentDocument.module.scss';

interface DirectoryEmployeePageProps {
  className?: string;
  info?: any
}
function sumTotalSum(data: any, param: string = 'totalSum') {
  return data.reduce((accumulator: any, currentValue: any) => accumulator + parseFloat(currentValue[param]), 0);
}

const PaymentDocument: React.FC<DirectoryEmployeePageProps> = (props) => {
  const { className, info } = props;
  const dispatch = useAppDispatch();

  const statusClass = cls[`statusBadge-${info?.status}`];
  console.log(info, 'info');
  const onDeleteHandler = useCallback((item: TableItemType) => {
  }, [dispatch]);

  const tableDataInner: TableType = useMemo(() => ({
    header: {
      id: <div className={clsTableItemHeader.text} style={{ flex: '0 0 120px' }}> Номер заявки </div>,
      name: 'Название',
      applicationAmount: 'Сумма заявки',
      deptAmount: 'Сумма долга',
      paymentAmount: 'Сумма оплаты',
    },
    items: [
      ...(info?.application?.length ? info?.application?.map((application: any) => (
        {
          status: (
            <div className={cls.tableFirstHeader} style={{ flex: '0 0 120px' }}>
              <div className={cls.tableItemStatus} />
              <div className={clsTableItemHeader.text}> { application?.id || application.application_id } </div>
            </div>
          ),
          // id: <div className={clsTableItemHeader.text}> { application.id } </div>,
          name: <div className={cls.tableItemHeader} style={{ flex: 1 }}> { application.title } </div>,
          applicationAmount: <div className={cls.tableItemHeader} style={{ flex: 1 }}> { formatCurrency(application.totalPayment || '') } в </div>,
          deptAmount: <div className={classNames(cls.tableItemHeader, {}, [])} style={{ flex: 1, color: '#E11B1B' }}> { formatCurrency(application.totalDebt || '') } </div>,
          paymentAmount: <div className={cls.tableItemHeader} style={{ flex: 1, color: '#169F55' }}> +{ formatCurrency(application.totalPayment || '') } </div>,
        })) : [{
        status: '-',
        name: '-',
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
          className={classNames(cls.tableItemHeader, {}, [cls.tableFirstHeader])}
          // className={clsTableItemHeader.text}
          style={{ flex: '0 0 100px' }}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(editGeneralJournalActions.openCreateModal(info));
          }}
        >
          <PenIcon style={{ fill: '#C18D06' }} /> { info?.paymentDocumentNumber }
        </div>
      ),
      counterparty: (
        <div
          className={cls.tableItemHeader}
          style={{ flex: 1 }}
        >
          {info?.legalEntity?.name}
        </div>
      ),
      createdAt:
      (
        <div
          className={cls.tableItemHeader}
          style={{ flex: '0 0 140px' }}
        >
          {info?.receiptDate || '-'}
        </div>
      ),
      totalAmount:
      (
        <div
          className={cls.tableItemHeader}
          style={{ flex: 1 }}
        >
          {formatCurrency(info?.totalAmount)}
        </div>
      ),
      totalApplicationsSum: (
        <div
          className={cls.tableItemHeader}
          style={{ flex: 1 }}
        >
          { formatCurrency(sumTotalSum(info.application, 'totalDebt'))}
        </div>
      ),
      restOfThePayment: (
        <div
          className={cls.tableItemHeader}
          style={{ flex: 1 }}
        >
          { formatCurrency(Number(info?.totalAmount) - sumTotalSum(info.application, 'totalDebt'))}
        </div>
      ),
      status: (
        <div className={classNames(clsTableItemHeader.column, {}, [])} style={{ flex: '0 0 120px' }}>
          <div className={`${cls.statusBadge} ${statusClass}`}>
            <span> {info?.status && StatusesTranslations[info?.status as StatusesEnum]}
            </span>
          </div>
        </div>
      ),
       // delete: (
      //   <Button
      //     className={cls.button}
      //     theme={ButtonThemes.CLEAR}
      //     onClick={(e) => onDeleteHandler(e)}
      //   >
      //     <CrossIcon />
      //   </Button>),
    },
    items: info?.application?.length ? [<div key={1}>{TableInner}</div>] : undefined,

  }), [info, TableInner]);

  const { Table, selectedItems } = useTable({
    data: tableData,
    onDelete: () => {},
    onEdit: () => {},
    checkable: false,
    collapsable: info?.application?.length,
    mod: TableItemsMod.RESET,
  });

  return (
    <div className={cls.tableItemList}>
      {Table}
    </div>
  );
};

export default PaymentDocument;

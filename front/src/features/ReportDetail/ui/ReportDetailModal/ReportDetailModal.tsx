import { classNames } from 'shared/lib/classNames/classNames';
import { Modal } from 'shared/ui/Modal/Modal';
import { TableItemsMod, TableType } from 'widgets/Table';
import { useCallback, useEffect, useMemo } from 'react';
import { useTable } from 'shared/lib/hooks/useTable';
import { ReactComponent as DeleteFileLogo } from 'shared/assets/icons/del-file-icon.svg';
import { ReactComponent as AddFileLogo } from 'shared/assets/icons/add-file-icon.svg';
import { ReactComponent as PrintFileLogo } from 'shared/assets/icons/print-icon.svg';
import { ReactComponent as SendFileLogo } from 'shared/assets/icons/send-icon.svg';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Tag } from 'shared/ui/Tag/Tag';
import { getDateString } from 'shared/lib/getDateString/getDateString';
import { ReportDocument } from 'widgets/ReportDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReactComponent as PdfFile } from 'shared/assets/icons/pdf-file.svg';
import { baseUrl } from 'shared/api/api';
import cls from './ReportDetailModal.module.scss';
import {
  getReportDetail, getReportDetailApplication, getReportDetailIsInit, getReportDetailIsOpen, getReportDetailReportId,
} from '../../model/selectors/reportDetailSelectors';
import { fetchReport } from '../../model/services/fetchReport';
import { reportDetailActions } from '../../model/slice/reportDetailSlice';

interface ReportDetailModalProps {
  className?: string;
  onClose?: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = (props) => {
  const { className, onClose } = props;

  const dispatch = useAppDispatch();
  const isInit = useSelector(getReportDetailIsInit);
  const isOpen = useSelector(getReportDetailIsOpen);
  const reportId = useSelector(getReportDetailReportId);
  const applications = useSelector(getReportDetailApplication);
  const reportDetail = useSelector(getReportDetail);

  const tableData: TableType = useMemo(() => ({
    header: {
      id: 'Номер запроса',
      describe: 'Описание',
      status: 'Статус',
      created: 'Создан',
      entity: 'Юрлицо',
      requisites: 'Реквизиты договора',
    },
    items: applications?.map((application) => ({
      id: application.id,
      describe: application.description,
      status: <Tag status={application.status} />,
      created: `${getDateString(new Date(application.createdAt), true)}` ?? '',
      entity: application.creator?.legalEntity.name ?? '',
      requisites: 'Реквизиты договора',
    })),
  }), [applications]);

  useEffect(() => {
    if (!isInit && reportId && isOpen) {
      dispatch(fetchReport(reportId));
      dispatch(reportDetailActions.setIsInit());
    }
  }, [dispatch, isInit, reportId, isOpen]);

  const { Table } = useTable({
    data: tableData,
    mod: TableItemsMod.NO_CONTROL,
    textAlignment: 'center',
  });

  const onCloseHandler = useCallback(() => {
    onClose?.();
    dispatch(reportDetailActions.close());
  }, [dispatch, onClose]);

  const downloadPdfReport = useCallback(() => {
    const url = `${baseUrl}api/v1/reports_download/${reportId}/`;
    window.open(url, '_blank');
  }, [reportId]);
  return (
    <Modal className={classNames(cls.reportDetailModal, {}, [className])} isOpen={isOpen} onClose={onCloseHandler}>
      <div className={cls.table}>
        {Table}
      </div>
      {/* <div className={cls.btns}>
        <Button className={cls.btn} theme={ButtonThemes.ICON}> <DeleteFileLogo /></Button>
        <Button className={cls.btn} theme={ButtonThemes.ICON}> <AddFileLogo /></Button>
        <PDFDownloadLink document={<ReportDocument report={reportDetail ?? null} />} fileName={`Отчет_${reportDetail?.createdAt}`}>
          <Button className={cls.btn} theme={ButtonThemes.ICON}> <PrintFileLogo /> </Button>
        </PDFDownloadLink>
        <Button className={cls.btn} theme={ButtonThemes.ICON}> <SendFileLogo /> </Button>
      </div> */}
      <div className={cls.btns}>
        <Button className={cls.btn} theme={ButtonThemes.ICON} onClick={downloadPdfReport}> <PdfFile /></Button>
      </div>
    </Modal>
  );
};

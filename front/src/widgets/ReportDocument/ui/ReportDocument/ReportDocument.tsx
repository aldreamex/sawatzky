import {
  Page,
  Text,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';
import { Report } from 'entities/Report';
import { Logo } from 'shared/ui/Logo/Logo';
import { ReportDocumentTitle } from '../ReportDocumentTitle/ReportDocumentTitle';
import { ReportDocumentTable } from '../ReportDocumentTable.tsx/ReportDocumentTable';
import { ReportDocumenSign } from '../ReportDocumentSign/ReportDocumenSign';

interface ReportDocumentProps {
  className?: string;
  report: Partial<Report> | null;
}

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial',
    paddingTop: '10px',
  },
  text: {
    fontStyle: 'italic',
    color: 'gray',
    marginLeft: '20px',
  },
  signs: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '0px 15px',
  },
});

export const ReportDocument: React.FC<ReportDocumentProps> = (props) => {
  const { report } = props;

  return (
    <Document>
      <Page orientation="landscape" size="A4" style={styles.page}>
        <Logo width={250} />
        <Text style={styles.text}>*Данная форма реализована при использовании системы приёма заявок Service Desk</Text>

        <ReportDocumentTitle report={report} />
        <ReportDocumentTable report={report} />

        <div style={styles.signs}>
          <ReportDocumenSign title="Заказчик" company="ООО «Ромашка»" sign="заказчика" />
          <ReportDocumenSign title="Исполнитель" company="ООО «Апполо Констракшн»" sign="исполнителя" />
        </div>

      </Page>
    </Document>
  );
};

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { Report } from 'entities/Report';

interface ReportDocumentProps {
    className?: string;
    report: Partial<Report> | null;
}

Font.register({
  family: 'Roboto',
  src:
      'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    fontFamily: 'Roboto',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export const ReportDocument: React.FC<ReportDocumentProps> = (props) => {
  const { report } = props;

  return (
    <Document>
      <Page orientation="landscape" size="A4" style={styles.page}>
        {
          report && (
            <>
              <View style={styles.section}>
                <Text>{report.id}</Text>
              </View>
              <View style={styles.section}>
                <Text>{report.legalEntity?.name} </Text>
              </View>
            </>
          )
        }

      </Page>
    </Document>
  );
};

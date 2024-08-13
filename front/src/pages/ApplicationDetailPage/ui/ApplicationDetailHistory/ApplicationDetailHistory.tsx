import { CollapsBoard, CollapsBoardThemes } from 'widgets/CollapsBoard';
import { HistoryItem } from 'widgets/HistoryItem';
import { History } from 'entities/History';
import cls from './ApplicationDetailHistory.module.scss';

interface ApplicationDetailHistoryProps {
  className?: string;
  historyList?: History[];
}

export const ApplicationDetailHistory: React.FC<ApplicationDetailHistoryProps> = (props) => {
  const { historyList } = props;

  return (
    <CollapsBoard className={cls.applicationDetailHistory} title="История изменений" theme={CollapsBoardThemes.GRAY} collapsed>
      {
        historyList && historyList.length > 0
          ? historyList.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))
          : <p>Пока что не было изменений</p>
      }
    </CollapsBoard>
  );
};

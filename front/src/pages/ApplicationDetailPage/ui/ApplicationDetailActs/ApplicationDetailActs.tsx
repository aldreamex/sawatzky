import { CollapsBoard } from 'widgets/CollapsBoard';
import { DocList } from 'widgets/DocList';
import { CollapsBoardThemes } from 'widgets/CollapsBoard/ui/CollapsBoard/CollapsBoard';
import { Document } from 'entities/Document';
import cls from './ApplicationDetailActs.module.scss';

interface ApplicationDetailActsProps {
  className?: string;
  acts?: Document[];
  applicationId: string;
}

export const ApplicationDetailActs: React.FC<ApplicationDetailActsProps> = (props) => {
  const { acts } = props;

  if (acts && acts?.length > 0) {
    return (
      <CollapsBoard title="Подтверждение выполненных работ" className={cls.Collapse} theme={CollapsBoardThemes.GRAY}>
        <div className={cls.actsBlock}>
          {/* <Button theme={ButtonThemes.CLEAR_BLUE} className={cls.controlBtn}>+ Добавить </Button> */}
          <DocList docs={acts} title="Список документов" acts="acts" className={cls.docList} />
        </div>
      </CollapsBoard>
    );
  }
  return null;
};

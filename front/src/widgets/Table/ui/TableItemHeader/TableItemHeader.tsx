import { classNames } from 'shared/lib/classNames/classNames';
import { Checkbox } from 'shared/ui/Checkbox/Checkbox';
import { useCallback } from 'react';
import cls from './TableItemHeader.module.scss';
import { TableItemType, TableItemsMod } from '../../model/type/table';

interface TableItemHeaderProps {
  className?: string;
  item?: TableItemType;
  selectedAll?: boolean;
  onSelectAll?: () => void;
  mod?: TableItemsMod;
  checkable: boolean;
  textAlignment?: 'left' | 'center' | 'right'
}

export const TableItemHeader: React.FC<TableItemHeaderProps> = (props) => {
  const {
    className,
    item,
    selectedAll,
    onSelectAll,
    mod,
    checkable,
    textAlignment,
  } = props;

  const onCheckClick = useCallback(() => {
    onSelectAll?.();
  }, [onSelectAll]);

  const alignmentClass = textAlignment ? cls[`text-${textAlignment}`] : '';

  return (
    <div className={classNames(cls.tableItemHeader, {}, [className])}>
      {
        (mod !== TableItemsMod.NO_CONTROL && checkable) && (
          <Checkbox className={cls.checkbox} id={`${item?.id}`} onChange={(e) => onCheckClick()} checked={selectedAll} />
        )
      }
      {
        item && Object.keys(item).map((key, index) => (
          mod !== TableItemsMod.NO_CONTROL
            ? (
              <div className={classNames(cls.column, {}, [alignmentClass])} key={`${key}_table_item_column`} style={{ flex: `1 0 ${100 / (Object.keys(item).length + 1)}%` }}>
                <span className={cls.text}>{item[key]}</span>
              </div>
            )
            : (
              <div className={classNames(cls.column, {}, [alignmentClass])} key={`${key}_table_item_column`} style={{ flex: `1 0 ${100 / (Object.keys(item).length)}%` }}>
                <span className={cls.text}>{item[key]}</span>
              </div>
            )
        ))
      }
    </div>
  );
};

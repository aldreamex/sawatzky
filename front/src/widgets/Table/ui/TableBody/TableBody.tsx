import { classNames } from 'shared/lib/classNames/classNames';
import isReactElement from 'shared/lib/helpers/isReactElement';
import { TableItemType, TableItemsMod } from '../../model/type/table';
import { ItemTheme, TableItem } from '../TableItem/TableItem';
import cls from './TableBody.module.scss';

interface TableBodyProps {
  className?: string;
  items?: TableItemType[];
  mod?: TableItemsMod;
  path?: string;
  onCheck?: (item: TableItemType) => void;
  onDelete?: (item: TableItemType) => void;
  onEdit?: (item: TableItemType) => void;
  onClick?: (item: TableItemType) => void;
  selectedItems?: TableItemType[];
  editable?: boolean;
  deleteble?: boolean
  checkable: boolean;
  textAlignment?: 'left' | 'center' | 'right'

  collapsable?: boolean
}

export const TableBody: React.FC<TableBodyProps> = (props) => {
  const {
    className,
    items,
    mod,
    path,
    onCheck,
    onDelete,
    selectedItems,
    onEdit,
    onClick,
    deleteble,
    editable,
    checkable,
    textAlignment = undefined,
    collapsable,
  } = props;
  return (
    <div className={classNames('', { [cls.collapsableTable]: collapsable }, [className])}>
      {
        items?.map((item, index) => {
          if (isReactElement(item)) {
            return item;
          }
          return (
            <TableItem
              path={path}
              mod={mod}
              key={`TableBodyItem_${item.id}`}
              type={ItemTheme.BODY}
              item={item}
              onCheck={() => onCheck?.(item)}
              onDelete={() => onDelete?.(item)}
              onEdit={() => onEdit?.(item)}
              onClick={() => onClick?.(item)}
              isChecked={Boolean(selectedItems?.find((selectedItem) => item.id === selectedItem.id))}
              deleteble={deleteble}
              editable={editable}
              checkable={checkable}
              textAlignment={textAlignment}
            />
          );
        })
      }
    </div>
  );
};

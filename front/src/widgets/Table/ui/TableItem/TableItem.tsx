import { TableItemType, TableItemsMod } from '../../model/type/table';
import { TableItemBody } from '../TableItemBody/TableItemBody';
import { TableItemHeader } from '../TableItemHeader/TableItemHeader';

interface TableItemProps {
  className?: string;
  item?: TableItemType;
  type?: ItemTheme;
  mod?: TableItemsMod;
  headerMod?: TableItemsMod;
  path?: string;
  isChecked?: boolean;
  selectedAll?: boolean;
  onSelectAll?: () => void;
  onCheck?: () => void;
  onDelete?: (item: TableItemType) => void;
  onEdit?: (item: TableItemType) => void;
  onClick?: (item: TableItemType) => void;
  editable?: boolean;
  deleteble?: boolean
  checkable: boolean;
  textAlignment?: 'left' | 'center' | 'right'
}

export const enum ItemTheme {
  HEADER = 'header',
  BODY = 'body'
}

export const TableItem: React.FC<TableItemProps> = (props) => {
  const {
    className,
    item,
    type = ItemTheme.BODY,
    mod,
    headerMod,
    path,
    isChecked,
    selectedAll,
    onSelectAll,
    onCheck,
    onDelete,
    onEdit,
    onClick,
    deleteble,
    editable,
    checkable,
    textAlignment,
  } = props;
  return (
    type === ItemTheme.BODY
      ? (
        <TableItemBody
          className={className}
          item={item}
          mod={mod}
          path={path}
          isChecked={isChecked}
          onCheck={onCheck}
          onDelete={onDelete}
          onEdit={onEdit}
          onClick={onClick}
          deleteble={deleteble}
          editable={editable}
          checkable={checkable}
          textAlignment={textAlignment}
        />
      )
      : (
        <TableItemHeader
          className={className}
          item={item}
          mod={mod}
          selectedAll={selectedAll}
          onSelectAll={onSelectAll}
          checkable={checkable}
          textAlignment={textAlignment}
          headerMod={headerMod}
        />
      )
  );
};

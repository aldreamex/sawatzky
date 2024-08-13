import { classNames } from 'shared/lib/classNames/classNames';
import { useCallback, useMemo, useState } from 'react';
import { TableHeader } from '../TableHeader/TableHeader';
import { TableBody } from '../TableBody/TableBody';
import { TableItemType, TableItemsMod, TableType } from '../../model/type/table';
import cls from './Table.module.scss';

interface TableProps {
  className?: string;
  mod?: TableItemsMod;
  headerMod?: TableItemsMod;
  data: TableType;
  path?: string;
  selectedItems?: TableItemType[];
  onSelectItem?: (item: TableItemType) => void;
  onSelectAll?: () => void;
  selectedAll?: boolean;
  onDelete?: (item: TableItemType) => void;
  onEdit?: (item: TableItemType) => void;
  onClick?: (item: TableItemType) => void;
  editable?: boolean;
  deleteble?: boolean
  checkable: boolean;
  textAlignment?: 'left' | 'center' | 'right'
  collapsable?: boolean;
  collapsed?: boolean;
}

export const Table: React.FC<TableProps> = (props) => {
  const {
    className,
    mod = TableItemsMod.NORMAL,
    headerMod = TableItemsMod.NORMAL,
    data,
    path,
    onDelete,
    onSelectItem,
    selectedItems,
    selectedAll,
    onSelectAll,
    onEdit,
    onClick,
    deleteble,
    editable,
    checkable,
    textAlignment,
    collapsable,
    collapsed = true,
  } = props;

  const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsable ? collapsed : false);

  const onToggleCollapsed = useCallback(() => {
    if (collapsable) {
      setIsCollapsed((prev) => !prev);
    }
  }, []);

  const collapseHeaderItem = useMemo(() => (
    <div className={classNames(
      '',
      {
        [cls.collapseFirstHeaderItem]: collapsable,
        [cls.collapseFirstHeaderItemShow]: isCollapsed,
      },
      [className],
    )}
    />
  ), [isCollapsed]);

  return (
    <div className={classNames(
      '',
      {
        [cls.collapsBoard]: collapsable,
        [cls.collapsableTable]: collapsable,
        [cls.collapsed]: isCollapsed,
      },
      [className],
    )}
    >
      <TableHeader
        className={cls.header}
        onClick={onToggleCollapsed}
        options={{
          ...(collapsable && { first: collapseHeaderItem }),
          ...data.header,
        }}
        mod={mod}
        headerMod={headerMod}
        selectedAll={selectedAll}
        onSelectAll={onSelectAll}
        checkable={checkable}
        collapsable={collapsable}
        textAlignment={textAlignment}
      />
      {
        data.items && (
          <TableBody
            className={cls.controls}
            path={path}
            items={data.items}
            mod={mod}
            onCheck={onSelectItem}
            selectedItems={selectedItems}
            onDelete={onDelete}
            onEdit={onEdit}
            onClick={onClick}
            deleteble={deleteble}
            editable={editable}
            checkable={checkable}
            collapsable={collapsable}
            textAlignment={textAlignment}
          />
        )
      }
    </div>
  );
};

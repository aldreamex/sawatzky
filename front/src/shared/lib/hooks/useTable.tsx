import { useCallback, useMemo, useState } from 'react';
import {
  Table, TableItemType, TableItemsMod, TableType,
} from 'widgets/Table';

export interface UseTableProps {
  className?: string;
  mod?: TableItemsMod;
  data: TableType;
  path?: string;
  onDelete?: (item: TableItemType) => void;
  onEdit?: (item: TableItemType) => void;
  onClick?: (item: TableItemType) => void;
  editable?: boolean;
  deleteble?: boolean
  checkable?: boolean;
}

type UseTableResult = {
  Table: any;
  onDelete: (item: TableItemType) => void;
  onEdit: (item: TableItemType) => void;
  onCheck: (item: TableItemType) => void;
  onClick: (item: TableItemType) => void;
  onSelectAll: () => void;
  selectedItems: TableItemType[];
}

export const useTable = (props: UseTableProps): UseTableResult => {
  const {
    data,
    onDelete,
    onEdit,
    onClick,
    path,
    mod,
    className,
    deleteble = true,
    editable = true,
    checkable = true,
  } = props;

  const [selectedItems, setSelectedItems] = useState<TableItemType[]>([]);
  const [selectedAll, setSelectedAll] = useState<boolean>(false);

  const onDeleteHandler = useCallback((item: TableItemType) => {
    onDelete?.(item);
  }, [onDelete]);

  const onEditHandler = useCallback((item: TableItemType) => {
    onEdit?.(item);
  }, [onEdit]);

  const onClickHandler = useCallback((item: TableItemType) => {
    onClick?.(item);
  }, [onClick]);

  const onCheckHandler = useCallback((item: TableItemType) => {
    if (selectedItems.find((selectedItem) => selectedItem.id === item.id)) {
      setSelectedItems((prev) => prev.filter((selectedItem) => item.id !== selectedItem.id));
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  }, [selectedItems]);

  const onSelectAllHandler = useCallback(() => {
    if (selectedAll) {
      setSelectedAll(false);
      setSelectedItems([]);
    } else {
      setSelectedAll(true);
      setSelectedItems(data.items!!);
    }
  }, [selectedAll, data]);

  const TableComponent = useMemo(() => (
    <Table
      path={path}
      mod={mod}
      className={className}
      data={data}
      onDelete={onDeleteHandler}
      onEdit={onEditHandler}
      onClick={onClickHandler}
      onSelectAll={onSelectAllHandler}
      onSelectItem={onCheckHandler}
      selectedAll={selectedAll}
      selectedItems={selectedItems}
      deleteble={deleteble}
      editable={editable}
      checkable={checkable}
    />
  ), [path, mod, className, data, onDeleteHandler, onEditHandler, onClickHandler, onSelectAllHandler, onCheckHandler, selectedAll, selectedItems, deleteble, editable, checkable]);

  return {
    Table: TableComponent,
    onDelete: onDeleteHandler,
    onEdit: onDeleteHandler,
    onClick: onClickHandler,
    onCheck: onCheckHandler,
    onSelectAll: onSelectAllHandler,
    selectedItems,
  };
};

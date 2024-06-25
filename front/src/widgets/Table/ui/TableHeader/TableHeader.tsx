import { classNames } from 'shared/lib/classNames/classNames';
import { TableHeaderType, TableItemsMod } from '../../model/type/table';
import { ItemTheme, TableItem } from '../TableItem/TableItem';
import cls from './TableHeader.module.scss';

interface TableHeaderProps {
    className?: string;
    options?: TableHeaderType;
    mod?: TableItemsMod;
    headerMod?: TableItemsMod;
    onSelectAll?: () => void;
    selectedAll?: boolean;
    checkable: boolean;
    textAlignment?: 'left' | 'center' | 'right'
    collapsable?: boolean
    onClick?: () => void
}

export const TableHeader: React.FC<TableHeaderProps> = (props) => {
  const {
    className,
    options,
    mod,
    onSelectAll,
    selectedAll,
    checkable,
    collapsable,
    onClick,
    textAlignment,
    headerMod,
  } = props;

  return (
    <div
      onClick={onClick}
      className={classNames('', { [cls.collapsableTableHeader]: collapsable }, [className])}
    >
      <TableItem
        item={options}
        type={ItemTheme.HEADER}
        headerMod={headerMod}
        mod={mod}
        onSelectAll={onSelectAll}
        selectedAll={selectedAll}
        checkable={checkable}
        textAlignment={textAlignment}
      />
    </div>
  );
};

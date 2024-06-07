import { classNames } from 'shared/lib/classNames/classNames';
import { Checkbox } from 'shared/ui/Checkbox/Checkbox';
import { AppLink } from 'shared/ui/AppLink/AppLink';
import { MouseEvent, useCallback, useMemo } from 'react';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { ReactComponent as CrossIcon } from 'shared/assets/icons/cross-icon.svg';
import { ReactComponent as PenIcon } from 'shared/assets/icons/pen-icon.svg';
import { TableItemType, TableItemsMod } from '../../model/type/table';
import cls from './TableItemBody.module.scss';

interface TableItemBodyProps {
  className?: string;
  item?: TableItemType;
  mod?: TableItemsMod;
  path?: string;
  isChecked?: boolean;
  onCheck?: (id: string) => void;
  onDelete?: (item: TableItemType) => void;
  onEdit?: (item: TableItemType) => void;
  onClick?: (item: TableItemType) => void;
  editable?: boolean;
  deleteble?: boolean
  checkable: boolean;
}

export const TableItemBody: React.FC<TableItemBodyProps> = (props) => {
  const {
    className,
    item,
    mod,
    path,
    isChecked,
    onCheck,
    onDelete,
    onEdit,
    onClick,
    editable,
    deleteble,
    checkable,
  } = props;

  const onCheckHandler = useCallback((id: any) => {
    onCheck?.(id);
  }, [onCheck]);

  const onDeleteHandler = useCallback((e: MouseEvent, item: TableItemType) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.(item);
  }, [onDelete]);

  const onEditHandler = useCallback((e: MouseEvent, item: TableItemType) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit?.(item);
  }, [onEdit]);

  const onClickHandler = useCallback((e: MouseEvent, item: TableItemType) => {
    e.stopPropagation();
    e.preventDefault();
    onClick?.(item);
  }, [onClick]);

  const itemBody = useMemo(() => {
    if (item) {
      switch (mod) {
        case TableItemsMod.LINK:
          return (
            <AppLink to={`${path}${item?.id}`} className={classNames(cls.tableItemBody, {}, [className, cls[mod]])}>
              {
                checkable && (
                  <Checkbox
                    className={cls.checkbox}
                    id={`${item?.id}`}
                    onChange={() => onCheckHandler(item?.id)}
                    checked={isChecked}
                  />
                )
              }
              {
                item && Object.keys(item).map((key) => (
                  <div className={cls.column} key={`${key}_table_item_column`} style={{ flex: `1 0 ${100 / (Object.keys(item).length + 1)}%` }}>
                    <span className={cls.text}>{item[key]}</span>
                  </div>
                ))
              }
              <div className={classNames(cls.column, {}, [cls.columnButtons])} style={{ flex: `1 0 ${100 / (Object.keys(item!!).length + 1)}%` }}>
                <div className={cls.buttons}>
                  {
                    editable ? (
                      <Button
                        className={cls.button}
                        theme={ButtonThemes.CLEAR}
                        onClick={(e) => onDeleteHandler(e, item)}
                      >
                        <CrossIcon />
                      </Button>
                    )
                      : null
                  }

                  {
                    deleteble ? (
                      <Button
                        className={cls.button}
                        theme={ButtonThemes.CLEAR}
                        onClick={(e) => onEditHandler(e, item)}
                      >
                        <PenIcon />
                      </Button>
                    )
                      : null
                  }
                </div>
              </div>
            </AppLink>
          );
        case TableItemsMod.NORMAL:
          return (
            <div className={classNames(cls.tableItemBody, {}, [cls[mod], className])}>
              {
                checkable && (
                  <Checkbox
                    className={cls.checkbox}
                    id={`${item?.id}`}
                    onChange={() => onCheckHandler(item?.id)}
                    checked={isChecked}
                  />
                )
              }
              {
                item && Object.keys(item).map((key) => (
                  <div className={cls.column} key={`${key}_table_item_column`} style={{ flex: `1 0 ${100 / (Object.keys(item).length + 1)}%` }}>
                    <span className={cls.text}>{item[key]}</span>
                  </div>
                ))
              }
              <div className={classNames(cls.column, {}, [cls.columnButtons])} style={{ flex: `1 0 ${100 / (Object.keys(item!!).length + 1)}%` }}>
                <div className={cls.buttons}>
                  {
                    editable ? (
                      <Button
                        className={cls.button}
                        theme={ButtonThemes.CLEAR}
                        onClick={(e) => onDeleteHandler(e, item)}
                      >
                        <CrossIcon />
                      </Button>
                    )
                      : null
                  }

                  {
                    deleteble ? (
                      <Button
                        className={cls.button}
                        theme={ButtonThemes.CLEAR}
                        onClick={(e) => onEditHandler(e, item)}
                      >
                        <PenIcon />
                      </Button>
                    )
                      : null
                  }
                </div>
              </div>
            </div>
          );
        case TableItemsMod.CLICK:
          return (
            <div className={classNames(cls.tableItemBody, {}, [cls[mod], className])} onClick={(e) => onClickHandler(e, item)}>
              {
                checkable && (
                  <Checkbox
                    className={cls.checkbox}
                    id={`${item?.id}`}
                    onChange={() => onCheckHandler(item?.id)}
                    checked={isChecked}
                  />
                )
              }
              {
                item && Object.keys(item).map((key) => (
                  <div className={cls.column} key={`${key}_table_item_column`} style={{ flex: `1 0 ${100 / (Object.keys(item).length + 1)}%` }}>
                    <span className={cls.text}>{item[key]}</span>
                  </div>
                ))
              }
              <div className={classNames(cls.column, {}, [cls.columnButtons])} style={{ flex: `1 0 ${100 / (Object.keys(item!!).length + 1)}%` }}>
                <div className={cls.buttons}>
                  {
                    editable ? (
                      <Button
                        className={cls.button}
                        theme={ButtonThemes.CLEAR}
                        onClick={(e) => onDeleteHandler(e, item)}
                      >
                        <CrossIcon />
                      </Button>
                    )
                      : null
                  }
                </div>
              </div>
            </div>
          );
        case TableItemsMod.NO_CONTROL:
          return (
            <div className={classNames(cls.tableItemBody, {}, [cls[mod], className])}>
              {
                item && Object.keys(item).map((key, index) => (
                  <div className={cls.column} key={`${key}_table_item_column`} style={{ flex: `1 0 ${100 / Object.keys(item).length}%` }}>
                    <span className={cls.text}>{item[key]}</span>
                  </div>
                ))
              }
            </div>
          );
        default:
          return null;
      }
    }
    return null;
  }, [item, mod, path, className, checkable, isChecked, editable, deleteble, onCheckHandler, onDeleteHandler, onEditHandler, onClickHandler]);

  return itemBody;
};

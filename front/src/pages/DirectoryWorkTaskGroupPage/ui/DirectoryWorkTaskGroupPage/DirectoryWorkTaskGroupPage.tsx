import { classNames } from 'shared/lib/classNames/classNames';
import { DirectoryPageWrapper } from 'widgets/DirectoryPageWrapper';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { ReactComponent as AddIcon } from 'shared/assets/icons/add-icon.svg';
import { ReactComponent as DeleteIcon } from 'shared/assets/icons/delete-icon.svg';
import { TableItemsMod, TableType, TableItemType } from 'widgets/Table';
import { DirectoryPath } from 'shared/config/RouteConfig/appRouteConfig';
import {
  AddWorkTaskGroupModal,
  addWorkTaskGroupFormActions,
  addWorkTaskGroupFormReducer,
  getAddWorkTaskGroupFormIsOpen,
} from 'features/AddWorkTaskGroup';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import {
  deleteWorkTaskGroup, getWorkTaskGroup, workTaskGroupReducer, fetchWorkTaskGroupList,
} from 'entities/WorkTaskGroup';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useTable } from 'shared/lib/hooks/useTable';
import cls from './DirectoryWorkTaskGroupPage.module.scss';

interface DirectoryObjectsGroupPageProps {
  className?: string;
}

const reducers: ReducersList = {
  workTaskGroup: workTaskGroupReducer,
  addWorkTaskGroupForm: addWorkTaskGroupFormReducer,
};

const DirectoryWorkTaskGroupPage: React.FC<DirectoryObjectsGroupPageProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  const workObjectsList = useSelector(getWorkTaskGroup.selectAll);
  const tableData: TableType = useMemo(() => ({
    header: {
      id: 'Код',
      name: 'Наименование группы',
    },
    items: workObjectsList.map((item) => ({
      id: item.id,
      name: item.name,
    })),
  }), [workObjectsList]);

  const isOpen = useSelector(getAddWorkTaskGroupFormIsOpen);

  useEffect(() => {
    dispatch(fetchWorkTaskGroupList());
  }, [dispatch]);

  const openFormHandler = useCallback(() => {
    dispatch(addWorkTaskGroupFormActions.openModal());
  }, [dispatch]);

  const onTableDeleteHandler = useCallback((item: TableItemType) => {
    dispatch(deleteWorkTaskGroup(`${item.id}`));
  }, [dispatch]);

  const onTableEditHandler = useCallback((item: TableItemType) => {
    const workTaskGroup = workObjectsList.find((workTaskGroup) => workTaskGroup.id === item.id);
    if (workTaskGroup) {
      dispatch(addWorkTaskGroupFormActions.openEditModal(workTaskGroup));
    }
  }, [dispatch, workObjectsList]);

  const { Table, selectedItems } = useTable({
    data: tableData,
    mod: TableItemsMod.LINK,
    path: DirectoryPath.work_task_group_detail,
    onDelete: onTableDeleteHandler,
    onEdit: onTableEditHandler,
  });

  const onButtonDeleteHandler = useCallback(() => {
    if (selectedItems) {
      selectedItems.forEach((item) => {
        dispatch(deleteWorkTaskGroup(`${item.id}`));
      });
    }
  }, [dispatch, selectedItems]);

  return (
    <DynamicModuleLoader reducers={reducers}>
      <DirectoryPageWrapper className={classNames(cls.directoryWorkTaskGroupPage, {}, [className])}>
        <div className={cls.buttons}>
          <Button helpInfo="Добавить группу услуг" onClick={openFormHandler} className={cls.button} theme={ButtonThemes.ICON}>
            <AddIcon />
          </Button>
          <Button helpInfo="Удалить группу услуг" className={cls.button} onClick={onButtonDeleteHandler} theme={ButtonThemes.ICON}>
            <DeleteIcon />
          </Button>
        </div>
        {Table}
        <AddWorkTaskGroupModal className={cls.form} isOpen={isOpen} />
      </DirectoryPageWrapper>
    </DynamicModuleLoader>
  );
};

export default DirectoryWorkTaskGroupPage;

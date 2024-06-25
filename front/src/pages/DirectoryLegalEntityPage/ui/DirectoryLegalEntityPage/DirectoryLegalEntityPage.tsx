import { classNames } from 'shared/lib/classNames/classNames';
import { DirectoryPageWrapper } from 'widgets/DirectoryPageWrapper';
import { Button, ButtonThemes } from 'shared/ui/Button/Button';
import { ReactComponent as AddIcon } from 'shared/assets/icons/add-icon.svg';
import { ReactComponent as DeleteIcon } from 'shared/assets/icons/delete-icon.svg';
import { TableItemType, TableType } from 'widgets/Table';
import { useCallback, useEffect, useMemo } from 'react';
import {
  CreateLegalEntityModal, getCreateLegalEntityIsOpen, createLegalEntityActions, createLegalEntityReducer,
} from 'features/CreateLegalEntity';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchWorkObjectGroupList, workObjectGroupReducer } from 'entities/WorkObjectGroup';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { fetchWorkTaskGroupList, workTaskGroupReducer } from 'entities/WorkTaskGroup';
import { fetchWorkMaterialGroupList, workMaterialGroupReducer } from 'entities/WorkMaterialGroup';
import { fetchLegalEntityList, getLegalEntity, legalEntityReducer } from 'entities/LegalEntity';
import { useTable } from 'shared/lib/hooks/useTable';
import { useUserData } from 'shared/lib/hooks/useUserData/useUserData';
import { deleteLegalEntityCounter } from 'entities/LegalEntity/model/services/deleteLegalEntityCounter';
import cls from './DirectoryLegalEntityPage.module.scss';

interface DirectoryLegalEntityPageProps {
  className?: string;
}

const reducers: ReducersList = {
  workObjectGroup: workObjectGroupReducer,
  createLegalEntityForm: createLegalEntityReducer,
  workTaskGroup: workTaskGroupReducer,
  workMaterialGroup: workMaterialGroupReducer,
  legalEntity: legalEntityReducer,
};

const DirectoryLegalEntityPage: React.FC<DirectoryLegalEntityPageProps> = (props) => {
  const { className } = props;

  const legalEntityFormIsOpen = useSelector(getCreateLegalEntityIsOpen);
  const dispatch = useAppDispatch();
  const legalEntities = useSelector(getLegalEntity.selectAll);
  const { isAdmin } = useUserData();

  useEffect(() => {
    dispatch(fetchWorkObjectGroupList());
    dispatch(fetchWorkTaskGroupList());
    dispatch(fetchWorkMaterialGroupList());
    dispatch(fetchLegalEntityList());
  }, [dispatch]);

  const onLegalEntityFormCloseHandler = useCallback(() => {
    dispatch(createLegalEntityActions.closeModal());
  }, [dispatch]);

  const onLegalEntityFormOpenHandler = useCallback(() => {
    dispatch(createLegalEntityActions.setSawatzky(false));
    dispatch(createLegalEntityActions.openModal());
  }, [dispatch]);

  const tableData: TableType = {
    header: {
      id: 'Код',
      name: 'Наименование компании',
      group: 'Группа объектов',
      // object: 'Объект',
    },
    items: useMemo(() => legalEntities.map((entity) => (
      {
        id: entity.id ?? '',
        name: entity.name ?? '',
        group: entity.workObjectsGroup?.name ?? '',
        // object: entity.workObject?.name ?? '',

      }
    )), [legalEntities]),
  };

  const onTableDeleteHandler = useCallback((item: TableItemType) => {
    dispatch(deleteLegalEntityCounter(`${item.id}`));
  }, [dispatch]);

  const onTableEditHandler = useCallback((item: TableItemType) => {
    const legalEntitie = legalEntities?.find((legalEntitie) => legalEntitie.id === item.id);
    if (legalEntitie) {
      dispatch(createLegalEntityActions.openEditModal(legalEntitie));
    }
  }, [dispatch, legalEntities]);

  const { Table, selectedItems } = useTable({
    data: tableData,
    onDelete: onTableDeleteHandler,
    onEdit: onTableEditHandler,
    deleteble: isAdmin,
  });

  const onButtonDeleteHandler = useCallback(() => {
    if (selectedItems) {
      selectedItems.forEach((item) => {
        dispatch(deleteLegalEntityCounter(`${item.id}`));
      });
    }
  }, [dispatch, selectedItems]);

  return (
    <DynamicModuleLoader reducers={reducers}>
      <DirectoryPageWrapper className={classNames(cls.directoryLegalEntityPage, {}, [className])}>
        <div className={cls.buttons}>
          <Button helpInfo="Добавить юр. лицо" onClick={onLegalEntityFormOpenHandler} className={cls.button} theme={ButtonThemes.ICON}>
            <AddIcon />
          </Button>
          <Button helpInfo="Удалить юр. лицо" className={cls.button} onClick={onButtonDeleteHandler} theme={ButtonThemes.ICON}>
            <DeleteIcon />
          </Button>
        </div>
        {Table}
        <CreateLegalEntityModal
          isSawatzky={false}
          onClose={onLegalEntityFormCloseHandler}
          isOpen={legalEntityFormIsOpen}
          className={cls.form}
        />

      </DirectoryPageWrapper>
    </DynamicModuleLoader>
  );
};

export default DirectoryLegalEntityPage;

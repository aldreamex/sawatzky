import { classNames } from 'shared/lib/classNames/classNames';
import { useParams } from 'react-router-dom';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { fetchLegalEntityList, getLegalEntity, legalEntityReducer } from 'entities/LegalEntity';
import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { StateSchema } from 'app/providers';
import { StatThemes, Stats } from 'widgets/Stats';
import { Title } from 'shared/ui/Title/Title';
import { CircleProgress } from 'widgets/CircleProgress';
import { fetchStatistic, statisticReducer } from 'entities/Statistic';
import { getStatistic } from 'entities/Statistic/model/slice/statisticSlice';
import { TableItemsMod, TableType } from 'widgets/Table';
import { useTable } from 'shared/lib/hooks/useTable';
import cls from './StatisticPage.module.scss';

interface StatisticPageProps {
  className?: string;
}

const reducers: ReducersList = {
  legalEntity: legalEntityReducer,
  statistic: statisticReducer,
};

const StatisticPage: React.FC<StatisticPageProps> = (props) => {
  const { className } = props;

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const legalEntity = useSelector((state: StateSchema) => getLegalEntity.selectById(state, id!!));
  const stats = useSelector(getStatistic.selectAll);

  useEffect(() => {
    dispatch(fetchLegalEntityList());
    dispatch(fetchStatistic(`${id}`));
  }, [dispatch, id]);

  const tableData: TableType = useMemo(() => ({
    header: {
      id: 'Название',
      object: 'Объект',
      startDate: 'Дата начала',
      endDate: 'Дата завершения',
      summ: 'Сумма',
    },
    items: stats.map((item) => ({
      id: item.title,
      object: item.workObject?.name,
      startDate: item.startWorkDate,
      endDate: item.endWorkDate,
      summ: item.totalSum ?? '0',
    })),
  }), [stats]);

  const { Table } = useTable({
    data: tableData,
    mod: TableItemsMod.NO_CONTROL,
    textAlignment: 'center',
  });

  return (
    <DynamicModuleLoader reducers={reducers} className={classNames(cls.statisticPage, {}, [className])}>
      <Title className={cls.title}>Статистика Юр лица {legalEntity?.name}</Title>
      <div className={cls.info}>
        <Stats className={cls.stat} title="Сумма выставленных счетов" stat={`${legalEntity?.totalInvoicedSum} руб.`} />
        <Stats className={cls.stat} theme={StatThemes.RED} title="Сумма задолженности" stat={`${0} руб.`} />
      </div>
      <div className={cls.info}>
        <CircleProgress className={cls.stat} title="Процент оплаченных счетов" percent={0} />
        <CircleProgress className={cls.stat} title="Процент просроченных счетов" percent={0} />
      </div>
      {Table}
    </DynamicModuleLoader>
  );
};

export default StatisticPage;

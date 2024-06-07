import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { StateSchema } from 'app/providers';
import { Statistic, StatisticSchema } from '../type/statistics';
import { fetchStatistic } from '../services/fetchStatistic';

const statisticAdapter = createEntityAdapter<Statistic>({
  selectId: (statistic) => statistic.title,
});

export const getStatistic = statisticAdapter.getSelectors<StateSchema>(
  (state) => state.statistic || statisticAdapter.getInitialState(),
);

export const statisticSlice = createSlice({
  name: 'Statistic',
  initialState: statisticAdapter.getInitialState<StatisticSchema>({
    ids: [],
    entities: {},
    error: undefined,
    isLoading: false,
  }),
  reducers: {
  },
  extraReducers: (builder) => builder
    .addCase(fetchStatistic.pending, (state, action) => {
      state.error = undefined;
      state.isLoading = true;
    })
    .addCase(fetchStatistic.fulfilled, (state, action: PayloadAction<Statistic[]>) => {
      state.isLoading = false;
      statisticAdapter.setAll(state, action.payload);
    })
    .addCase(fetchStatistic.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }),
});

export const { actions: statisticActions } = statisticSlice;
export const { reducer: statisticReducer } = statisticSlice;

import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { StateSchema } from 'app/providers';
import { Application, ApplicationStatus } from 'entities/Application';
import { ApplicationsPageSchema } from '../type/applicationsPage';
import { fetchApplicationsList } from '../services/fetchApplicationsList/fetchApplicationsList';
import { deleteCheckedItems } from '../services/deleteCheckedItems/deleteCheckedItems';

export const applicationsPageAdapter = createEntityAdapter<Application>({
  selectId: (application) => application.id,
});

export const getApplicationsPage = applicationsPageAdapter.getSelectors<StateSchema>(
  (state) => state.applicationsPage || applicationsPageAdapter.getInitialState(),
);

export const applicationsPageSlice = createSlice({
  name: 'applicationsPage',
  initialState: applicationsPageAdapter.getInitialState<ApplicationsPageSchema>({
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    allIsChecked: false,
    checkedItems: [],
    modalIsOpen: false,
    _init: false,
    workObject: undefined,
    status: undefined,
    isCalendarOpen: false,
    creator: undefined,
    sort: undefined,
  }),
  reducers: {
    toggleCheckbox: (state, action: PayloadAction<string>) => {
      if (state.checkedItems?.includes(action.payload)) {
        state.checkedItems = state.checkedItems.filter((id) => id !== action.payload);
      } else {
        state.checkedItems?.push(action.payload);
      }
    },
    toggleAllCheckboxes: (state) => {
      const toggledItem = !state.allIsChecked;
      state.allIsChecked = toggledItem;
      if (toggledItem) {
        const itemIds = Object.values(state.entities).map((entity) => entity?.id) as string[];
        state.checkedItems = itemIds;
      } else {
        state.checkedItems = [];
      }
    },
    openModal: (state) => {
      state.modalIsOpen = true;
    },
    closeModal: (state) => {
      state.modalIsOpen = false;
    },
    initPage: (state) => {
      state._init = true;
    },
    setWorkObject: (state, action: PayloadAction<number>) => {
      state.workObject = action.payload;
    },
    toggleFinishedApplications: (state) => {
      state.showFinishedApplicaitons = !state.showFinishedApplicaitons;
    },
    setStartWorkDate: (state, action: PayloadAction<string>) => {
      state.startWorkDate = action.payload;
    },
    setEndWorkDate: (state, action: PayloadAction<string>) => {
      state.endWorkDate = action.payload;
    },
    setStatus: (state, action: PayloadAction<ApplicationStatus|undefined>) => {
      state.status = action.payload;
    },
    setCreator: (state, action: PayloadAction<string|undefined>) => {
      state.creator = action.payload;
    },
    clearWorkDates: (state) => {
      state.startWorkDate = '';
      state.endWorkDate = '';
    },
    openCalendar: (state) => {
      state.isCalendarOpen = true;
    },
    closeCalendar: (state) => {
      state.isCalendarOpen = false;
    },
    setSort: (state, action: PayloadAction<undefined|'createdAt'|'-createdAt'>) => {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => builder
    // Аунтификация пользователя
    .addCase(fetchApplicationsList.pending, (state) => {
      state.error = undefined;
      state.isLoading = true;
    })
    .addCase(fetchApplicationsList.fulfilled, (state, action: PayloadAction<Application[]>) => {
      state.isLoading = false;
      // @ts-ignore
      applicationsPageAdapter.setAll(state, action.payload);
    })
    .addCase(fetchApplicationsList.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Удаление заявок
    .addCase(deleteCheckedItems.pending, (state) => {
      state.error = undefined;
      state.isLoading = true;
    })
    .addCase(deleteCheckedItems.fulfilled, (state) => {
      state.isLoading = false;
      state.allIsChecked = false;
    })
    .addCase(deleteCheckedItems.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }),
});

export const { actions: applicationsPageActions } = applicationsPageSlice;
export const { reducer: applicationsPageReducer } = applicationsPageSlice;

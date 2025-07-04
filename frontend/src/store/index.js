import { configureStore } from '@reduxjs/toolkit';
import disastersReducer from '../features/disasters/disastersSlice';
import reportsReducer from '../features/reports/reportsSlice';
import resourcesReducer from '../features/resources/resourcesSlice';

export const store = configureStore({
  reducer: {
    disasters: disastersReducer,
    reports: reportsReducer,
    resources: resourcesReducer,
  },
});

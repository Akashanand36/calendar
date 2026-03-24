import { configureStore } from '@reduxjs/toolkit';
import calendarReducer   from './calendarSlice';
import userReducer       from './userSlice';
import premiumReducer    from './premiumSlice';
import plannerReducer    from './plannerSlice';

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    user:     userReducer,
    premium:  premiumReducer,
    planner:  plannerReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

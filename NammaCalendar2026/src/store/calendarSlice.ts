import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PanchangamDay, Festival } from '@types/index';
import { getTodayString } from '@utils/dateUtils';

interface CalendarState {
  selectedDate:  string;
  currentMonth:  string;        // "YYYY-MM"
  panchangamCache: Record<string, PanchangamDay>;
  festivals:     Festival[];
}

const initialState: CalendarState = {
  selectedDate:  getTodayString(),
  currentMonth:  getTodayString().slice(0, 7),
  panchangamCache: {},
  festivals:     [],
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
    setCurrentMonth(state, action: PayloadAction<string>) {
      state.currentMonth = action.payload;
    },
    cachePanchangam(state, action: PayloadAction<PanchangamDay>) {
      state.panchangamCache[action.payload.date] = action.payload;
    },
    setFestivals(state, action: PayloadAction<Festival[]>) {
      state.festivals = action.payload;
    },
  },
});

export const { setSelectedDate, setCurrentMonth, cachePanchangam, setFestivals } =
  calendarSlice.actions;
export default calendarSlice.reducer;

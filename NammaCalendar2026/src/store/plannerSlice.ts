import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reminder, PlannerNote } from '@types/index';

interface PlannerState {
  reminders: Reminder[];
  notes:     PlannerNote[];
}

const initialState: PlannerState = { reminders: [], notes: [] };

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    addReminder(state, a: PayloadAction<Reminder>)    { state.reminders.push(a.payload); },
    toggleReminder(state, a: PayloadAction<string>)   {
      const r = state.reminders.find(r => r.id === a.payload);
      if (r) r.enabled = !r.enabled;
    },
    deleteReminder(state, a: PayloadAction<string>)   {
      state.reminders = state.reminders.filter(r => r.id !== a.payload);
    },
    addNote(state, a: PayloadAction<PlannerNote>)     { state.notes.push(a.payload); },
    updateNote(state, a: PayloadAction<PlannerNote>)  {
      const i = state.notes.findIndex(n => n.id === a.payload.id);
      if (i !== -1) state.notes[i] = a.payload;
    },
    deleteNote(state, a: PayloadAction<string>)       {
      state.notes = state.notes.filter(n => n.id !== a.payload);
    },
    setAllReminders(state, a: PayloadAction<Reminder[]>)   { state.reminders = a.payload; },
    setAllNotes(state, a: PayloadAction<PlannerNote[]>)    { state.notes = a.payload; },
  },
});

export const {
  addReminder, toggleReminder, deleteReminder,
  addNote, updateNote, deleteNote,
  setAllReminders, setAllNotes,
} = plannerSlice.actions;
export default plannerSlice.reducer;

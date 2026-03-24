import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, FamilyMember, RasiName } from '@types/index';

interface UserState {
  profile: UserProfile | null;
}

const initialState: UserState = {
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },
    updateRasi(state, action: PayloadAction<RasiName>) {
      if (state.profile) state.profile.rasi = action.payload;
    },
    addFamilyMember(state, action: PayloadAction<FamilyMember>) {
      state.profile?.familyMembers.push(action.payload);
    },
    removeFamilyMember(state, action: PayloadAction<string>) {
      if (state.profile) {
        state.profile.familyMembers = state.profile.familyMembers.filter(
          m => m.id !== action.payload
        );
      }
    },
    setPremiumStatus(state, action: PayloadAction<{ isPremium: boolean; expiry?: string }>) {
      if (state.profile) {
        state.profile.isPremium = action.payload.isPremium;
        state.profile.premiumExpiry = action.payload.expiry;
      }
    },
    toggleNotifications(state) {
      if (state.profile) state.profile.notifications = !state.profile.notifications;
    },
  },
});

export const {
  setProfile, updateRasi, addFamilyMember,
  removeFamilyMember, setPremiumStatus, toggleNotifications,
} = userSlice.actions;
export default userSlice.reducer;

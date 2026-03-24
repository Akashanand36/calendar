import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlanId } from '@types/index';

interface PremiumState {
  activePlan:  PlanId;
  loading:     boolean;
  error:       string | null;
  trialActive: boolean;
}

const initialState: PremiumState = {
  activePlan:  'free',
  loading:     false,
  error:       null,
  trialActive: false,
};

const premiumSlice = createSlice({
  name: 'premium',
  initialState,
  reducers: {
    purchaseStart(state)              { state.loading = true; state.error = null; },
    purchaseSuccess(state, action: PayloadAction<PlanId>) {
      state.loading    = false;
      state.activePlan = action.payload;
    },
    purchaseFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error   = action.payload;
    },
    startTrial(state) {
      state.trialActive = true;
      state.activePlan  = 'premium_yearly';
    },
    restorePurchase(state, action: PayloadAction<PlanId>) {
      state.activePlan = action.payload;
    },
  },
});

export const { purchaseStart, purchaseSuccess, purchaseFailed, startTrial, restorePurchase } =
  premiumSlice.actions;
export default premiumSlice.reducer;

import {
  initConnection, getSubscriptions, requestSubscription,
  finishTransaction, purchaseUpdatedListener, purchaseErrorListener,
  type SubscriptionPurchase,
} from 'react-native-iap';
import { store } from '@store/index';
import { purchaseStart, purchaseSuccess, purchaseFailed } from '@store/premiumSlice';
import { setPremiumStatus } from '@store/userSlice';

export const IAP_SKUS = {
  monthly: 'namma_calendar_premium_monthly',
  yearly:  'namma_calendar_premium_yearly',
};

export const PremiumService = {
  async init() {
    try {
      await initConnection();
      this.listenToPurchases();
    } catch (e) {
      console.warn('IAP init failed:', e);
    }
  },

  listenToPurchases() {
    purchaseUpdatedListener(async (purchase: SubscriptionPurchase) => {
      await finishTransaction({ purchase, isConsumable: false });
      const planId = purchase.productId === IAP_SKUS.monthly
        ? 'premium_monthly'
        : 'premium_yearly';
      store.dispatch(purchaseSuccess(planId));
      store.dispatch(setPremiumStatus({ isPremium: true }));
    });

    purchaseErrorListener((err) => {
      store.dispatch(purchaseFailed(err.message));
    });
  },

  async getPlans() {
    return getSubscriptions({ skus: Object.values(IAP_SKUS) });
  },

  async subscribe(sku: string) {
    store.dispatch(purchaseStart());
    await requestSubscription({ sku });
  },
};

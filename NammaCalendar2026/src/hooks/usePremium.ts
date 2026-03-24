import { useSelector } from 'react-redux';
import type { RootState } from '@store/index';

/** Convenience hook — returns premium status and active plan. */
export function usePremium() {
  const { activePlan, loading, trialActive } = useSelector((s: RootState) => s.premium);
  return {
    isPremium:    activePlan !== 'free',
    isMonthly:    activePlan === 'premium_monthly',
    isYearly:     activePlan === 'premium_yearly',
    trialActive,
    loading,
    activePlan,
  };
}

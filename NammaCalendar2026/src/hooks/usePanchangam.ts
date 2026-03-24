import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/index';
import { PanchangamService } from '@services/PanchangamService';
import { getTodayString } from '@utils/dateUtils';

/** Returns Panchangam data for any date (defaults to today). */
export function usePanchangam(date?: string) {
  const selectedDate = useSelector((s: RootState) => s.calendar.selectedDate);
  const target = date ?? selectedDate ?? getTodayString();

  return useMemo(
    () => PanchangamService.getDay(target),
    [target]
  );
}

/** Returns all festival days across the year. */
export function useFestivals() {
  return useMemo(() => PanchangamService.getFestivalDays(), []);
}

/** Returns Panchangam days for a given "YYYY-MM" month string. */
export function useMonthPanchangam(yearMonth: string) {
  return useMemo(
    () => PanchangamService.getMonth(yearMonth),
    [yearMonth]
  );
}

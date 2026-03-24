import { format, parseISO, isToday, isSameMonth } from 'date-fns';

export const getTodayString = (): string => format(new Date(), 'yyyy-MM-dd');

export const formatDisplayDate = (dateStr: string): string => {
  const d = parseISO(dateStr);
  return format(d, 'MMMM d, yyyy');
};

export const formatDayName = (dateStr: string): string => {
  return format(parseISO(dateStr), 'EEEE');
};

export const getMonthDates = (year: number, month: number): Date[] => {
  const dates: Date[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(new Date(year, month, d));
  }
  return dates;
};

export const isTodayDate = (dateStr: string): boolean =>
  isToday(parseISO(dateStr));

export const isSameMonthDate = (dateStr: string, month: Date): boolean =>
  isSameMonth(parseISO(dateStr), month);

/** Convert 24h "HH:MM" to "h:MM AM/PM" */
export const to12h = (time: string): string => {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};

/** Tamil month names */
export const TAMIL_MONTHS = [
  'சித்திரை', 'வைகாசி', 'ஆனி',      'ஆடி',
  'ஆவணி',    'புரட்டாசி', 'ஐப்பசி', 'கார்த்திகை',
  'மார்கழி',  'தை',       'மாசி',    'பங்குனி',
];

/** Tamil digit string from 1–31 */
const TAMIL_DIGITS = ['௧','௨','௩','௪','௫','௬','௭','௮','௯',
  '௧௦','௧௧','௧௨','௧௩','௧௪','௧௫','௧௬','௧௭','௧௮','௧௯',
  '௨௦','௨௧','௨௨','௨௩','௨௪','௨௫','௨௬','௨௭','௨௮','௨௯','௩௦','௩௧'];

export const toTamilDigit = (n: number): string => TAMIL_DIGITS[n - 1] ?? String(n);

import moment from 'moment-timezone';

export const parseTimeRange = (rangeStr: any) => {
  const [startStr, endStr] = rangeStr.split('-');

  const to24Hr = (time: string) => {
    const [hourStr, ampm] = time.trim().split(' ');
    let hour = parseInt(hourStr);
    if (ampm?.toLowerCase() === 'pm' && hour !== 12) hour += 12;
    if (ampm?.toLowerCase() === 'am' && hour === 12) hour = 0;
    return hour;
  };

  const startHour = to24Hr(startStr);
  const endHour = to24Hr(endStr);

  const baseDate = new Date();
  const start = new Date(baseDate);
  start.setHours(startHour, 0, 0, 0);

  const end = new Date(baseDate);
  end.setHours(endHour, 0, 0, 0);

  return {start, end};
};

export const isOverlapping = (
  segmentStart: Date,
  segmentEnd: Date,
  bookingStart: string,
  bookingEnd: string,
) => {
  const toISTDate = (base: Date, timeStr: string) => {
    const dateStr = moment(base).tz('Asia/Kolkata').format('YYYY-MM-DD');
    const fullDateTime = moment.tz(
      `${dateStr} ${timeStr}`,
      'YYYY-MM-DD h A',
      'Asia/Kolkata',
    );
    return fullDateTime.isValid() ? fullDateTime.toDate() : null;
  };

  const bookingStartDate = toISTDate(segmentStart, bookingStart);
  const bookingEndDate = toISTDate(segmentStart, bookingEnd);

  if (!bookingStartDate || !bookingEndDate) return false;

  return (
    (segmentStart >= bookingStartDate && segmentStart < bookingEndDate) ||
    (segmentEnd > bookingStartDate && segmentEnd <= bookingEndDate) ||
    (segmentStart <= bookingStartDate && segmentEnd >= bookingEndDate)
  );
};

export const parseISTTime = (
  baseDate: Date,
  timeString: string,
): Date | 'Invalid Date' => {
  try {
    const cleanedTime = timeString.replace(/\u202f/g, ' ').trim();
    const datePart = baseDate.toDateString();
    const combined = `${datePart} ${cleanedTime}`;
    const parsed = new Date(combined);
    return isNaN(parsed.getTime()) ? 'Invalid Date' : parsed;
  } catch {
    return 'Invalid Date';
  }
};

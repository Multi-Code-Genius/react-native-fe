export const parseTimeRange = (
  rangeStr: string,
  baseDateInput?: Date | string,
) => {
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

  const baseDate = baseDateInput ? new Date(baseDateInput) : new Date();

  const start = new Date(baseDate);
  start.setHours(startHour, 0, 0, 0);

  const end = new Date(baseDate);
  end.setHours(endHour, 0, 0, 0);

  return {start, end};
};

export const isOverlapping = (
  segmentStart: any,
  segmentEnd: any,
  bookingStart: any,
  bookingEnd: any,
) => {
  if (segmentEnd < segmentStart) {
    segmentEnd.setDate(segmentEnd.getDate() + 1);
  }

  const segmentStartDate = new Date(segmentStart);
  const segmentEndDate = new Date(segmentEnd);
  const bookingStartDate = new Date(bookingStart);
  const bookingEndDate = new Date(bookingEnd);

  // console.log(
  //   'object',
  //   segmentStartDate,
  //   segmentEndDate,
  //   bookingStartDate,
  //   bookingEndDate,
  //   segmentStartDate >= bookingStartDate && segmentEndDate <= bookingEndDate,
  // );

  const isWithinBooking =
    segmentStartDate >= bookingStartDate && segmentEndDate <= bookingEndDate;

  return isWithinBooking;
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

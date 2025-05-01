export const useAmountCalculator = (
  hourlyPrice: number,
  startTime: Date,
  endTime: Date,
  nets: number,
) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const durationInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  const durationInHours = durationInMinutes / 60;

  const totalAmount = hourlyPrice * durationInHours * nets;

  return totalAmount;
};

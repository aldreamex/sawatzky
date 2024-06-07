export const getTotalTime = (hours: number, minutes: number) => {
  const time = +hours * 60 + +minutes;
  return time;
};

export const getTimeString = (date: Date, short = false) => {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

  return date.toLocaleTimeString('ru-Ru', options);
};

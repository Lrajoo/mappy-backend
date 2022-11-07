export const formatOpeningHours = (hours: string[]) => {
  const sundayHours = hours[6];
  let formattedHours = [...hours];
  formattedHours.pop();
  formattedHours.unshift(sundayHours);
  return formattedHours;
};

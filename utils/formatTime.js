export const formatDate = (isoString) => {
  if (!isoString) {
    throw new Error("Invalid date string");
  }

  const date = new Date(isoString);

  if (isNaN(date)) {
    throw new Error("Invalid date format");
  }

  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  // Array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthNames[date.getMonth()]; // Get month name from array

  return `${day}-${month}-${year}`;
};

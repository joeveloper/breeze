export const formatDate = (isoString) => {
  if (!isoString || typeof isoString !== "string") {
    console.error("Invalid date string:", isoString);
    return "Invalid date";
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

export const formatDateAndTime = (isoString) => {
  if (!isoString || typeof isoString !== "string") {
    console.error("Invalid date string:", isoString);
    return "Invalid date";
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

  // Get time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};


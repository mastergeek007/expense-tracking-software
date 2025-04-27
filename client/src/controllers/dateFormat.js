const dateFormat = (time24) => {
  if (!time24 || typeof time24 !== "string") return "";

  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr);
  const minute = minuteStr.padStart(2, "0");

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // Convert "0" to "12"

  return `${hour}:${minute} ${ampm}`;
};

export default dateFormat;

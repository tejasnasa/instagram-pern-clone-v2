export const getPostDuration = (postTime: Date): string => {
  const now = new Date();
  const delta = now.getTime() - postTime.getTime(); // Difference in milliseconds
  const seconds = Math.floor(delta / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) {
    return `${weeks}w`; // Weeks
  } else if (days > 0) {
    return `${days}d`; // Days
  } else if (hours > 0) {
    return `${hours}h`; // Hours
  } else if (minutes > 0) {
    return `${minutes}m`; // Minutes
  } else {
    return "just now"; // Less than a minute
  }
};


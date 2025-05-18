function clamp(value: number, min: number, max: number):number {
  return Math.max(min, Math.min(max, value));
}

const ticksToDate = (ticks: number) => {
  // .NET epoch (January 1, 0001)
  const dotNetEpoch = new Date(0); // This is January 1, 1970
  dotNetEpoch.setFullYear(1); // Set to January 1, 0001

  // Calculate the milliseconds from ticks
  const milliseconds = (ticks - 621355968000000000) / 10000;

  // Create a new date object
  return new Date(dotNetEpoch.getTime() + milliseconds);
};


const formatPlayTime = (totalSeconds: number) => {
  const secondsInMinute = 60;
  const secondsInHour = 3600; // 60 * 60
  const secondsInDay = 86400; // 60 * 60 * 24

  const days = Math.floor(totalSeconds / secondsInDay);
  const hours = Math.floor((totalSeconds % secondsInDay) / secondsInHour);
  const minutes = Math.floor((totalSeconds % secondsInHour) / secondsInMinute);
  const seconds = totalSeconds % secondsInMinute;

  // Construct the output string
  let result = '';
  if (days > 0) {
    result += `${days}d `;
  }
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0) {
    result += `${minutes}m `;
  }
  if (seconds > 0 || (days === 0 && hours === 0 && minutes === 0)) { // Include seconds if there are any or if there are no days, hours, or minutes
    result += `${seconds.toPrecision(2)}s`;
  }

  return result.trim(); // Remove any leading/trailing whitespace
};


export {clamp, ticksToDate, formatPlayTime}
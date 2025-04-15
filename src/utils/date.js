/**
 * Date utility functions
 */

/**
 * Get current time in various formats
 * @param {string} format - The format to return ('iso', 'date', 'time', 'datetime', 'timestamp')
 * @returns {string|number} Formatted date/time
 */
export function getNow(format = 'iso') {
  const now = new Date();
  
  switch (format) {
    case 'iso':
      return now.toISOString();
    case 'date':
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    case 'time':
      return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    case 'datetime':
      return `${getNow('date')} ${getNow('time')}`;
    case 'timestamp':
      return now.getTime();
    default:
      return now.toISOString();
  }
}

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format to use ('relative', 'date', 'time', 'datetime')
 * @returns {string} Formatted date
 */
export function formatDate(date, format = 'relative') {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }
  
  if (format === 'relative') {
    return getRelativeTimeString(dateObj);
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
  switch (format) {
    case 'date':
      return `${year}-${month}-${day}`;
    case 'time':
      return `${hours}:${minutes}`;
    case 'datetime':
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    default:
      return dateObj.toISOString();
  }
}

/**
 * Get relative time string (e.g., "just now", "5 minutes ago")
 * @param {Date} date - Date to format
 * @returns {string} Relative time string
 */
function getRelativeTimeString(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // Difference in seconds
  
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  
  // Check if it's today
  if (date.getDate() === now.getDate() && 
      date.getMonth() === now.getMonth() && 
      date.getFullYear() === now.getFullYear()) {
    return `今天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  
  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getDate() === yesterday.getDate() && 
      date.getMonth() === yesterday.getMonth() && 
      date.getFullYear() === yesterday.getFullYear()) {
    return `昨天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  
  // If within 7 days
  if (diff < 604800) {
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return `${days[date.getDay()]} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  
  // If it's this year
  if (date.getFullYear() === now.getFullYear()) {
    return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  
  // Otherwise return full date
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/**
 * Format a date group (e.g., "今日", "昨日", "2023-05-01")
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date group
 */
export function formatDateGroup(date) {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }
  
  const now = new Date();
  
  // Check if it's today
  if (dateObj.getDate() === now.getDate() && 
      dateObj.getMonth() === now.getMonth() && 
      dateObj.getFullYear() === now.getFullYear()) {
    return '今日';
  }
  
  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateObj.getDate() === yesterday.getDate() && 
      dateObj.getMonth() === yesterday.getMonth() && 
      dateObj.getFullYear() === yesterday.getFullYear()) {
    return '昨日';
  }
  
  // Otherwise return date format
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
}

/**
 * Check if two dates are on the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date  
 * @returns {boolean} True if dates are on the same day
 */
export function isSameDay(date1, date2) {
  return date1.getDate() === date2.getDate() && 
         date1.getMonth() === date2.getMonth() && 
         date1.getFullYear() === date2.getFullYear();
}

/**
 * Add a specified amount of time to a date
 * @param {Date} date - The starting date 
 * @param {number} amount - The amount to add
 * @param {string} unit - The unit ('days', 'hours', 'minutes', 'seconds', 'months', 'years')
 * @returns {Date} The new date
 */
export function addTime(date, amount, unit = 'days') {
  const newDate = new Date(date);
  
  switch (unit) {
    case 'years':
      newDate.setFullYear(newDate.getFullYear() + amount);
      break;
    case 'months':
      newDate.setMonth(newDate.getMonth() + amount);
      break;
    case 'days':
      newDate.setDate(newDate.getDate() + amount);
      break;
    case 'hours':
      newDate.setHours(newDate.getHours() + amount);
      break;
    case 'minutes':
      newDate.setMinutes(newDate.getMinutes() + amount);
      break;
    case 'seconds':
      newDate.setSeconds(newDate.getSeconds() + amount);
      break;
    default:
      newDate.setDate(newDate.getDate() + amount);
  }
  
  return newDate;
} 
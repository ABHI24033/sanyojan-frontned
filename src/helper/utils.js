export function timeAgo(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };
  
    for (let key in intervals) {
      const value = intervals[key];
      const diff = Math.floor(seconds / value);
  
      if (diff > 0) {
        return diff === 1 ? `${diff} ${key} ago` : `${diff} ${key}s ago`;
      }
    }
  
    return "just now";
  }
  
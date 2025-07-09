// Utility functions for consistent date handling across the blog

export function formatBlogDate(dateString: string): string {
  // Parse the date string as local date to avoid timezone issues
  // Input format: "YYYY-MM-DD"
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Create date object in local timezone (month is 0-indexed)
  const date = new Date(year, month - 1, day);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatBlogDateShort(dateString: string): string {
  // Parse the date string as local date to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function parseBlogDate(dateString: string): Date {
  // Parse the date string as local date to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isValidDateString(dateString: string): boolean {
  // Check if date string is in YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
}
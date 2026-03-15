export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

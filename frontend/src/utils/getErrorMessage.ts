import { AxiosError } from 'axios';

interface BackendError {
  status: number;
  message: string;
  timestamp: string;
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as BackendError | undefined;
    if (data?.message) return data.message;
  }
  return fallback;
}

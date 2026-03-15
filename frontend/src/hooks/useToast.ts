import { useState } from 'react';

type Severity = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  message: string;
  severity: Severity;
  open: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<Toast>({ message: '', severity: 'info', open: false });

  function showToast(message: string, severity: Severity = 'info') {
    setToast({ message, severity, open: true });
  }

  function hideToast() {
    setToast((prev) => ({ ...prev, open: false }));
  }

  return { toast, showToast, hideToast };
}

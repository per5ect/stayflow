import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { authAdapter } from '../../../adapters/auth.adapter';
import { getErrorMessage } from '../../../utils/getErrorMessage';

interface VerifyForm {
  code: string;
}

export function useVerifyEmailController() {
  const router = useRouter();
  const email = router.query.email as string | undefined;
  const { showSnackbar } = useSnackbar();

  const form = useForm<VerifyForm>({ defaultValues: { code: '' } });
  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = handleSubmit(async ({ code }) => {
    if (!email) return;
    try {
      await authAdapter.verify({ email, code });
      showSnackbar('Email verified successfully! You can now sign in.', 'success');
      router.push('/auth/login');
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error');
    }
  });

  return { form, onSubmit, isSubmitting, email };
}

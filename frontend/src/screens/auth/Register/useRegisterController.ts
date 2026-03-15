import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { authAdapter } from '../../../adapters/auth.adapter';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { RegisterRequest } from '../../../domains/auth.types';

export function useRegisterController() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const form = useForm<RegisterRequest>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      role: 'RENTER',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await authAdapter.register(data);
      showSnackbar('Account created! Please check your email for the verification code.', 'success');
      router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error');
    }
  });

  return { form, onSubmit, isSubmitting };
}

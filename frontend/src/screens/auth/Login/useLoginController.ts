import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAuth } from '../../../hooks/useAuth';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { authAdapter } from '../../../adapters/auth.adapter';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { LoginRequest } from '../../../domains/auth.types';

export function useLoginController() {
  const router = useRouter();
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();

  const form = useForm<LoginRequest>({
    defaultValues: { email: '', password: '' },
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await authAdapter.login(data);
      login(response);
      showSnackbar(`Welcome back, ${response.firstName}!`, 'success');

      const redirect = router.query.redirect as string | undefined;
      if (redirect) {
        router.push(redirect);
      } else if (response.role === 'RENTER') {
        router.push('/renter/search');
      } else if (response.role === 'LANDLORD') {
        router.push('/landlord/apartments');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error');
    }
  });

  return { form, onSubmit, isSubmitting };
}

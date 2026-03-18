import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

export default ResetPassword;

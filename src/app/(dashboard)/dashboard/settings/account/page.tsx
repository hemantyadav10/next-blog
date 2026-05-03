import { Separator } from '@/components/ui/separator';
import { getHasPassword, verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ResetPasswordForm from '../components/ChangePasswordForm';
import DeleteAccountForm from '../components/DeleteAccountForm';
import SetPasswordForm from '../components/SetPasswordForm';

async function Account() {
  const { isAuthenticated, user } = await verifyAuth();
  if (!isAuthenticated) {
    return redirect('/login');
  }
  const hasPassword = await getHasPassword(user.userId);

  return (
    <div className="space-y-6">
      {hasPassword ? (
        <ResetPasswordForm />
      ) : (
        <SetPasswordForm userEmail={user.email} />
      )}
      <Separator />
      <DeleteAccountForm />
    </div>
  );
}

export default Account;

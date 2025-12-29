import { Separator } from '@/components/ui/separator';
import ResetPasswordForm from '../components/ChangePasswordForm';
import DeleteAccountForm from '../components/DeleteAccountForm';

async function Account() {
  return (
    <div className="space-y-6">
      <ResetPasswordForm />
      <Separator />
      <DeleteAccountForm />
    </div>
  );
}

export default Account;

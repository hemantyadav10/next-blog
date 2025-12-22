import ResetPasswordForm from '../components/ChangePasswordForm';
import DeleteAccountForm from '../components/DeleteAccountForm';

async function Account() {
  return (
    <div className="space-y-8">
      <ResetPasswordForm />
      <DeleteAccountForm />
    </div>
  );
}

export default Account;

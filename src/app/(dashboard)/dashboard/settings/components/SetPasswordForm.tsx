import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { InfoIcon } from 'lucide-react';

function SetPasswordForm({ userEmail }: { userEmail: string }) {
  return (
    <FieldSet>
      <FieldLegend className="data-[variant=legend]:text-2xl">
        Set Password
      </FieldLegend>
      <FieldDescription>
        Add a password to enable email login for your account.
      </FieldDescription>
      <FieldGroup>
        <Alert variant={'warning'}>
          <InfoIcon />
          <AlertTitle>No Password Set</AlertTitle>
          <AlertDescription className="text-foreground">
            Your account was created using social sign-in, so no password has
            been set. The ability to set a password directly is coming soon. In
            the meantime, you can continue signing in with your connected social
            account. If you need email login, sign out and use the forgot
            password flow with ({userEmail}) to set a password.
          </AlertDescription>
        </Alert>
      </FieldGroup>
    </FieldSet>
  );
}

export default SetPasswordForm;

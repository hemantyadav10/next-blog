import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

// TODO: Implement delete account functionality
function DeleteAccountForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive text-xl">
          Delete Account
        </CardTitle>
        <CardDescription>
          {/* Permanently delete your account and all associated data. This action
          cannot be undone. */}
          Delete account is not yet available. This flow is a preview of the
          upcoming behavior.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="border-destructive/20 bg-destructive/5 space-y-6 rounded-xl border p-5">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-2">
              <p className="text-destructive-foreground text-lg font-semibold">
                Permanent Deletion
              </p>
              <p className="text-destructive-foreground/80 text-sm">
                This will immediately remove your account, posts, comments, and
                all data from our servers forever.
              </p>
            </div>
          </div>

          <Field>
            <FieldLabel className="font-medium">
              Type &quot;DELETE&quot; to confirm
            </FieldLabel>
            <FieldContent>
              <Input
                placeholder="DELETE"
                className="bg-background font-mono"
                disabled
              />
              <FieldDescription>
                Enter &quot;DELETE&quot; exactly to enable the delete button.
              </FieldDescription>
            </FieldContent>
          </Field>
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg" disabled>
              <Trash2 />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Permanently Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <FieldError>
              Are you absolutely sure? This action cannot be reversed.
            </FieldError>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button variant={'destructive'}>Yes, Delete Account</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

export default DeleteAccountForm;

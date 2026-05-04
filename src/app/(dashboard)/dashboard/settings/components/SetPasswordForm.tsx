'use client';

import { setPassword } from '@/app/actions/userActions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { SetPasswordInput, setPasswordSchema } from '@/lib/schema/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, Eye, EyeOff, InfoIcon } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

function SetPasswordForm({ userEmail }: { userEmail: string }) {
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormFieldError,
  } = useForm<SetPasswordInput>({
    defaultValues: {
      confirmPassword: '',
      newPassword: '',
    },
    resolver: zodResolver(setPasswordSchema),
    disabled: isPending,
  });
  const [error, setError] = useState<string>('');
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const router = useRouter();

  const handleSetPassword = (data: SetPasswordInput) => {
    setError('');
    startTransition(async () => {
      const response = await setPassword(data);
      if (response.success) {
        router.refresh();
        toast.success('Password set successfully');
      } else {
        const { error, errors } = response;
        // Set error message
        setError(error);

        // Set form field errors
        if (errors) {
          (Object.keys(errors) as (keyof SetPasswordInput)[]).forEach((key) => {
            const value = errors[key];
            if (value?.[0]) {
              setFormFieldError(key, { message: value[0] });
            }
          });
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleSetPassword)}>
      <FieldSet>
        <FieldLegend className="data-[variant=legend]:text-2xl">
          Create a Password
        </FieldLegend>
        <FieldDescription>
          Add a password to enable email login for your account.
        </FieldDescription>
        <FieldGroup>
          <Alert variant={'info'}>
            <InfoIcon />
            <AlertTitle>No Password Set</AlertTitle>
            <AlertDescription className="text-foreground">
              Your account was created with social sign-in, so it does not have
              a password yet. Set a password here to enable email and password
              login for {userEmail}.
            </AlertDescription>
          </Alert>

          {/* Error callout */}
          {error && (
            <Alert variant={'destructive'}>
              <AlertCircleIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          {/* New Password */}
          <Controller
            control={control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                <FieldContent>
                  <InputGroup className="max-w-md">
                    <InputGroupInput
                      id={field.name}
                      type={showNew ? 'text' : 'password'}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter a new password"
                    />
                    <InputGroupAddon align={'inline-end'}>
                      <InputGroupButton
                        type="button"
                        aria-label="Toggle password visibility"
                        title="Toggle password"
                        size="icon-sm"
                        onClick={() => {
                          setShowNew(!showNew);
                        }}
                      >
                        {showNew ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    Use at least 8 characters.
                  </FieldDescription>
                </FieldContent>
              </Field>
            )}
          />

          {/* Confirm New Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Confirm New Password
                </FieldLabel>
                <FieldContent>
                  <InputGroup className="max-w-md">
                    <InputGroupInput
                      id={field.name}
                      type={showConfirm ? 'text' : 'password'}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Re-enter your new password"
                    />
                    <InputGroupAddon align={'inline-end'}>
                      <InputGroupButton
                        type="button"
                        aria-label="Toggle password visibility"
                        title="Toggle password"
                        size="icon-sm"
                        onClick={() => {
                          setShowConfirm(!showConfirm);
                        }}
                      >
                        {showConfirm ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    Enter the same password again to confirm it.
                  </FieldDescription>
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isPending}
          className="max-w-fit disabled:cursor-not-allowed"
        >
          {isPending && <Spinner />} Save password
        </Button>
      </FieldSet>
    </form>
  );
}

export default SetPasswordForm;

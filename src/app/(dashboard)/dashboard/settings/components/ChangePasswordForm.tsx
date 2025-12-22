'use client';

import { changePassword } from '@/app/actions/userActions';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import {
  ChangePasswordInput,
  changePasswordSchema,
} from '@/lib/schema/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, Eye, EyeOff } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setError: setFormFieldError,
    reset,
  } = useForm<ChangePasswordInput>({
    defaultValues: {
      confirmPassword: '',
      currentPassword: '',
      newPassword: '',
    },
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    disabled: isPending,
  });
  const [error, setError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = (data: ChangePasswordInput) => {
    setError('');
    startTransition(async () => {
      const response = await changePassword(data);
      if (response.success) {
        toast.success('Password changed successfully');
        reset();
      } else {
        const { error, errors } = response;
        // Set error message
        setError(error);

        // Set form field errors
        if (errors) {
          (Object.keys(errors) as (keyof ChangePasswordInput)[]).forEach(
            (key) => {
              const value = errors[key];
              if (value?.[0]) {
                setFormFieldError(key, { message: value[0] });
              }
            },
          );
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="space-y-6"
        >
          {/* Error callout */}
          {error && (
            <Alert variant={'destructive'}>
              <AlertCircleIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <FieldGroup>
            {/* Current Password */}
            <Controller
              control={control}
              name="currentPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        type={showCurrent ? 'text' : 'password'}
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your current password"
                      />
                      <InputGroupAddon align={'inline-end'}>
                        <InputGroupButton
                          aria-label="Toggle password"
                          title="Toggle password"
                          size="icon-sm"
                          onClick={() => {
                            setShowCurrent(!showCurrent);
                          }}
                        >
                          {showCurrent ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <FieldDescription>
                      Enter your current password for verification.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              )}
            />

            {/* New Password */}
            <Controller
              control={control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        type={showNew ? 'text' : 'password'}
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Create a new password"
                      />
                      <InputGroupAddon align={'inline-end'}>
                        <InputGroupButton
                          aria-label="Toggle password"
                          title="Toggle password"
                          size="icon-xs"
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
                      Password must be at least 8 characters.
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
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        type={showConfirm ? 'text' : 'password'}
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Confirm your new password"
                      />
                      <InputGroupAddon align={'inline-end'}>
                        <InputGroupButton
                          aria-label="Toggle password"
                          title="Toggle password"
                          size="icon-xs"
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
                      Re-enter your new password to confirm.
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
            size={'lg'}
            className="disabled:cursor-not-allowed"
          >
            {isPending && <Spinner />} Change Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ChangePasswordForm;

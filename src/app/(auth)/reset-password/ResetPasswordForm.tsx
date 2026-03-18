'use client';

import { resetPassword } from '@/app/actions/userActions';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from '@/lib/schema/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircleIcon,
  CheckCircleIcon,
  Eye,
  EyeOff,
  LockIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const {
    handleSubmit,
    control,
    setError: setFormFieldError,
  } = useForm<ResetPasswordInput>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      token,
    },
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    disabled: isPending,
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  async function handleFormAction(data: ResetPasswordInput) {
    setError('');

    startTransition(async () => {
      const res = await resetPassword(data);

      if (res.success) {
        setIsSuccess(true);
      } else if (res.error) {
        const { error, errors } = res;
        // Set error message
        setError(error);

        // Set form field errors
        if (errors) {
          (Object.keys(errors) as (keyof ResetPasswordInput)[]).forEach(
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
  }

  // Block the form if no token in URL
  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <FieldSet>
          <FieldContent className="gap-2 text-center">
            <div className="bg-destructive/10 text-destructive mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full">
              <AlertCircleIcon className="h-8 w-8" />
            </div>
            <FieldLabel className="mx-auto text-2xl font-semibold">
              Invalid Reset Link
            </FieldLabel>
            <FieldDescription>
              This password reset link is invalid or has already been used.
              Please request a new one.
            </FieldDescription>
          </FieldContent>
          <FieldGroup>
            <Button asChild size="lg">
              <Link href="/forgot-password">Request a new link</Link>
            </Button>
            <FieldDescription className="text-center [&>a]:no-underline">
              Remember your password?{' '}
              <Link href="/login" className="text-link hover:underline">
                Sign in
              </Link>
            </FieldDescription>
          </FieldGroup>
        </FieldSet>
      </div>
    );
  }

  // add this before the return statement:
  if (isSuccess) {
    return (
      <div className="w-full max-w-sm">
        <FieldSet>
          <FieldContent className="gap-2 text-center">
            <div className="bg-success/10 text-success mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full">
              <CheckCircleIcon className="h-8 w-8" />
            </div>
            <FieldLabel className="mx-auto text-2xl font-semibold">
              Password Reset
            </FieldLabel>
            <FieldDescription>
              Your password has been reset successfully. You can now sign in
              with your new password.
            </FieldDescription>
          </FieldContent>
          <FieldGroup>
            <Button asChild size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </FieldGroup>
        </FieldSet>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <FieldSet>
        <FieldContent className="gap-2 text-center">
          <FieldLabel className="mx-auto text-2xl font-semibold">
            Reset Your Password
          </FieldLabel>
          <FieldDescription>Create a new secure password</FieldDescription>
        </FieldContent>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormAction)} noValidate>
          <FieldGroup>
            {/* Error callout */}
            {error && (
              <Alert variant={'destructive'}>
                <AlertCircleIcon />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}

            {/*New Password */}
            <Controller
              name="newPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>New Password*</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      type={showNewPassword ? 'text' : 'password'}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="********"
                    />
                    <InputGroupAddon>
                      <LockIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align={'inline-end'}>
                      <InputGroupButton
                        aria-label="Toggle password"
                        title="Toggle password"
                        size="icon-xs"
                        onClick={() => {
                          setShowNewPassword(!showNewPassword);
                        }}
                      >
                        {showNewPassword ? <Eye /> : <EyeOff />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    Password must be at least 8 characters long
                  </FieldDescription>
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Confirm Password*
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="********"
                    />
                    <InputGroupAddon>
                      <LockIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align={'inline-end'}>
                      <InputGroupButton
                        aria-label="Toggle password"
                        title="Toggle password"
                        size="icon-xs"
                        onClick={() => {
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                      >
                        {showConfirmPassword ? <Eye /> : <EyeOff />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Reset Password Button */}
            <Field>
              <Button disabled={isPending} type="submit" size={'lg'}>
                {isPending && <Spinner />} Reset Password
              </Button>
            </Field>

            {/* Sign up link */}
            <FieldDescription className="text-center [&>a]:no-underline">
              Remember your password?{' '}
              <Link href="/login" className="text-link hover:underline">
                Sign in
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </FieldSet>
    </div>
  );
}

export default ResetPasswordForm;

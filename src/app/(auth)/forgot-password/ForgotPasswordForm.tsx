'use client';

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
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { Email, emailSchema } from '@/lib/schema/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircleIcon,
  ChevronLeft,
  Mail,
  MailCheckIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { forgotPassword } from '../../actions/userActions';

function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const {
    handleSubmit,
    reset,
    control,
    setError: setFormFieldError,
  } = useForm<Email>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(emailSchema),
  });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  async function handleFormAction(data: Email) {
    setError('');
    setIsSuccess(false);
    startTransition(async () => {
      const response = await forgotPassword(data);

      if (response.success) {
        setIsSuccess(true);
        reset();
      } else if (response.error) {
        const { error, errors } = response;

        // Set error message
        setError(error);
        setIsSuccess(false);

        // Set form field errors
        if (errors) {
          (Object.keys(errors) as (keyof Email)[]).forEach((key) => {
            const value = errors[key];
            if (value?.[0]) {
              setFormFieldError(key, { message: value[0] });
            }
          });
        }
      }
    });
  }

  return (
    <div className="w-full max-w-sm">
      <FieldSet>
        <FieldContent className="gap-2">
          <FieldLabel className="mx-auto text-2xl font-semibold">
            Forgot Password?
          </FieldLabel>
          <FieldDescription className="text-center">
            Enter your email and we&apos;ll send you instructions to reset your
            password
          </FieldDescription>
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

            {/* Success callout */}
            {isSuccess && (
              <Alert>
                <MailCheckIcon />
                <AlertTitle className="line-clamp-none font-normal">
                  If an account with this email exists, you&apos;ll receive a
                  reset link shortly. Check your spam folder if you don&apos;t
                  see it. The link expires in 15 minutes.
                </AlertTitle>
              </Alert>
            )}

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email*</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      type="email"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="example@email.com"
                    />
                    <InputGroupAddon>
                      <Mail />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Send reset link button */}
            <Field>
              <Button disabled={isPending} type="submit" size={'lg'}>
                {isPending && <Spinner />} Send Reset Link
              </Button>
            </Field>
            <FieldDescription className="text-center [&>a]:no-underline">
              <Link
                href="/login"
                className="text-link flex items-center justify-center gap-1 hover:underline"
              >
                <ChevronLeft size={16} /> Back to login
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </FieldSet>
    </div>
  );
}

export default ForgotPasswordForm;

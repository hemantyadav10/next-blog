'use client';

import { OAuthError } from '@/components/OAuthError';
import SocialButton from '@/components/SocialButton';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { useGoogleAuth } from '@/hooks/use-google-auth';
import { useOAuthError } from '@/hooks/use-oauth-error';
import { saveAuthMethod } from '@/lib/authMethod';
import { LoginInput, loginSchema } from '@/lib/schema/userSchema';
import { getSafeRedirect } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { loginUser } from '../../actions/userActions';

function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const oauthError = useOAuthError();
  const { isGoogleLoading, handleGoogleAuth } = useGoogleAuth('login');
  const isFormDisabled = isPending || isGoogleLoading;
  const {
    handleSubmit,
    reset,
    resetField,
    control,
    setError: setFormFieldError,
  } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    disabled: isFormDisabled,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const redirectPath = getSafeRedirect(rawRedirect);

  async function handleFormAction(data: LoginInput) {
    setFormError('');
    startTransition(async () => {
      const { success, error, errors } = await loginUser(data);

      if (success) {
        toast.success('Signed in successfully');
        reset();
        router.push(redirectPath);
        router.refresh();
        saveAuthMethod('email');
      } else if (error) {
        // Set error message
        setFormError(error);

        // Clear password field
        resetField('password');

        // Set form field errors
        if (errors) {
          (Object.keys(errors) as (keyof LoginInput)[]).forEach((key) => {
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
        <FieldContent className="gap-2 text-center">
          <FieldLabel className="mx-auto text-2xl font-semibold">
            Sign in to your account
          </FieldLabel>
        </FieldContent>

        <FieldGroup>
          <OAuthError error={oauthError} />

          {/* Social login button */}
          <Field>
            <SocialButton
              provider="google"
              showLastUsed
              onClick={handleGoogleAuth}
              loading={isGoogleLoading}
              disabled={isFormDisabled}
            />
            <SocialButton
              provider="github"
              showLastUsed
              disabled={isFormDisabled}
            />
          </Field>

          <FieldSeparator>or</FieldSeparator>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormAction)} noValidate>
            <FieldGroup>
              {/* Error callout */}
              {formError && (
                <Alert variant={'destructive'}>
                  <AlertCircleIcon />
                  <AlertTitle>{formError}</AlertTitle>
                </Alert>
              )}

              {/* Email */}
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        type="email"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="example@email.com"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Link
                        href="/forgot-password"
                        className="text-link ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="********"
                      />
                      <InputGroupAddon align={'inline-end'}>
                        <InputGroupButton
                          type="button"
                          aria-label="Toggle password"
                          title="Toggle password"
                          size="icon-xs"
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
                        >
                          {showPassword ? <Eye /> : <EyeOff />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Login Button */}
              <Field>
                <Button disabled={isFormDisabled} type="submit" size={'lg'}>
                  {isPending && <Spinner />} Login
                </Button>
              </Field>
            </FieldGroup>
          </form>

          {/* Sign up link */}
          <FieldDescription className="text-center text-sm [&>a]:no-underline">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-link hover:underline">
              Sign up
            </Link>
          </FieldDescription>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}

export default LoginForm;

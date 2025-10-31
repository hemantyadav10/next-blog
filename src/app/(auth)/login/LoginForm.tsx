'use client';

import { GoogleIcon } from '@/components/icons/google-icon';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { LoginInput, loginSchema } from '@/lib/schema/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, Eye, EyeOff, LockIcon, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { loginUser } from '../../actions/userActions';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string[] | undefined>>();
  const router = useRouter();

  async function handleFormAction(data: LoginInput) {
    setError('');
    setFieldErrors(undefined);
    startTransition(async () => {
      const { success, error, errors } = await loginUser(data);

      if (success) {
        toast.success('Signed in successfully');
        reset();
        router.push('/');
        router.refresh();
      } else if (error) {
        setError(error);
        setFieldErrors(errors);
      }
    });
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-center text-2xl font-semibold">
          Sign in to your account
        </h1>
        <p className="text-muted-foreground text-center text-sm">
          Enter your email below to login to your account
        </p>
      </div>
      <form onSubmit={handleSubmit(handleFormAction)} noValidate>
        <FieldGroup>
          {error && (
            <Alert variant={'destructive'}>
              <AlertCircleIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="email"
                type="email"
                {...register('email')}
                aria-invalid={!!errors.email || !!fieldErrors?.email?.[0]}
                placeholder="example@email.com"
              />
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
            </InputGroup>
            {(errors.email || fieldErrors?.email) && (
              <FieldError>
                {errors.email?.message || fieldErrors?.email?.[0]}
              </FieldError>
            )}
          </Field>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="ml-auto text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <InputGroup>
              <InputGroupInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                aria-invalid={!!errors.password || !!fieldErrors?.password}
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
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {(errors.password || fieldErrors?.password) && (
              <FieldError>
                {errors.password?.message || fieldErrors?.password?.[0]}
              </FieldError>
            )}
          </Field>
          <Field>
            <Button disabled={isPending} type="submit" size={'lg'}>
              {isPending && <Spinner />} Login
            </Button>
          </Field>
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <Button
              variant="secondary"
              type="button"
              size={'lg'}
              onClick={() => toast.info('Google login coming soon!')}
            >
              <GoogleIcon className="size-5" />
              Login with Google
            </Button>
          </Field>

          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-foreground font-medium no-underline hover:underline"
            >
              Sign up
            </Link>
          </p>
        </FieldGroup>
      </form>
    </div>
  );
}

export default LoginForm;

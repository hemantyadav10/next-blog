'use client';

import { registerUser } from '@/app/actions/userActions';
import { GoogleIcon } from '@/components/icons/google-icon';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
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
import { RegisterInput, registerSchema } from '@/lib/schema/userSchema';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircleIcon,
  AtSignIcon,
  Eye,
  EyeOff,
  LockIcon,
  Mail,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });
  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string[] | undefined>>();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleFormAction(data: RegisterInput) {
    console.log(data);
    setError('');
    setFieldErrors(undefined);
    startTransition(async () => {
      const { success, error, errors } = await registerUser(data);
      if (success) {
        toast.success('Account created successfully');
        reset();
        router.push('/login');
      } else if (error) {
        setError(error);
        setFieldErrors(errors);
      }
    });
  }

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Create your free account</h1>
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-foreground font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
      <form
        onSubmit={handleSubmit(handleFormAction)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
        noValidate
      >
        <FieldGroup>
          <Field>
            <Button
              variant="secondary"
              type="button"
              size={'lg'}
              onClick={() => toast.info('Google sign up coming soon!')}
            >
              <GoogleIcon className="size-5" />
              Sign up with Google
            </Button>
          </Field>
          <FieldSeparator>Or continue with</FieldSeparator>

          {/* Error callout */}
          {error && (
            <Alert variant={'destructive'}>
              <AlertCircleIcon />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                <p>{error}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="email"
                type="email"
                {...register('email')}
                aria-invalid={!!errors.email || !!fieldErrors?.email?.[0]}
                placeholder="john.doe@example.com"
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

          {/* Username */}
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="username"
                {...register('username')}
                aria-invalid={!!errors.username || !!fieldErrors?.username?.[0]}
                placeholder="johndoe"
              />
              <InputGroupAddon>
                <AtSignIcon />
              </InputGroupAddon>
            </InputGroup>
            {(errors.username || fieldErrors?.username) && (
              <FieldError>
                {errors.username?.message || fieldErrors?.username?.[0]}
              </FieldError>
            )}
            <FieldDescription>
              Choose a unique username for your account.
            </FieldDescription>
          </Field>

          <div className="grid gap-7 sm:grid-cols-2 sm:gap-4">
            {/* First Name */}
            <Field>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="firstName"
                  {...register('firstName')}
                  aria-invalid={
                    !!errors.firstName || !!fieldErrors?.firstName?.[0]
                  }
                  placeholder="John"
                />
                <InputGroupAddon>
                  <User />
                </InputGroupAddon>
              </InputGroup>
              {(errors.firstName || fieldErrors?.firstName) && (
                <FieldError>
                  {errors.firstName?.message || fieldErrors?.firstName?.[0]}
                </FieldError>
              )}
            </Field>

            {/* Last name */}
            <Field>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="lastName"
                  {...register('lastName')}
                  aria-invalid={
                    !!errors.lastName || !!fieldErrors?.lastName?.[0]
                  }
                  placeholder="Doe"
                />
                <InputGroupAddon>
                  <User />
                </InputGroupAddon>
              </InputGroup>
              {(errors.lastName || fieldErrors?.lastName) && (
                <FieldError>
                  {errors.lastName?.message || fieldErrors?.lastName?.[0]}
                </FieldError>
              )}
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
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
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>
          <Field>
            <Button disabled={isPending} type="submit" size={'lg'}>
              {isPending && <Spinner />} Create Account
            </Button>
          </Field>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{' '}
            <Link href="/terms">Terms of Service</Link> and{' '}
            <Link href="/privacy">Privacy Policy</Link>.
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}

'use client';

import { registerUser } from '@/app/actions/userActions';
import { GoogleIcon } from '@/components/icons/google-icon';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { RegisterInput, registerSchema } from '@/lib/schema/userSchema';
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
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const {
    handleSubmit,
    control,
    reset,
    setError: setFormFieldError,
  } = useForm<RegisterInput>({
    defaultValues: {
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      password: '',
    },
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    disabled: isPending,
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleFormAction(data: RegisterInput) {
    setError('');
    startTransition(async () => {
      const { success, error, errors } = await registerUser(data);
      if (success) {
        toast.success('Account created successfully');
        reset();
        router.push('/login');
      } else if (error) {
        // Set error message
        setError(error);

        // Set form field errors
        if (errors) {
          (Object.keys(errors) as (keyof RegisterInput)[]).forEach((key) => {
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
    <div className="w-full max-w-lg">
      <FieldSet>
        <FieldContent className="gap-2">
          <FieldLabel className="text-2xl font-semibold">
            Create your free account
          </FieldLabel>
          <FieldDescription>
            Already have an account?{' '}
            <Link href="/login" className="text-link">
              Sign in
            </Link>
          </FieldDescription>
        </FieldContent>
        <form onSubmit={handleSubmit(handleFormAction)} noValidate>
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
                      placeholder="john.doe@example.com"
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

            {/* Username */}
            <Controller
              control={control}
              name="username"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="johndoe"
                    />
                    <InputGroupAddon>
                      <AtSignIcon />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    Choose a unique username for your account.
                  </FieldDescription>
                </Field>
              )}
            />

            <div className="grid gap-7 sm:grid-cols-2 sm:gap-4">
              {/* First Name */}
              <Controller
                control={control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="John"
                      />
                      <InputGroupAddon>
                        <User />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Last name */}
              <Controller
                control={control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Doe"
                      />
                      <InputGroupAddon>
                        <User />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      type={showPassword ? 'text' : 'password'}
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
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
              )}
            />
            <Field>
              <Button disabled={isPending} type="submit" size={'lg'}>
                {isPending && <Spinner />} Create Account
              </Button>
            </Field>
            <FieldDescription className="px-6 text-center">
              By clicking continue, you agree to our{' '}
              <Link href="/terms" className="text-link">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-link">
                Privacy Policy
              </Link>
              .
            </FieldDescription>
          </FieldGroup>
        </form>
      </FieldSet>
    </div>
  );
}

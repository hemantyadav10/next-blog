'use client';

import { GoogleIcon } from '@/components/icons/google-icon';
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
import { LoginInput, loginSchema } from '@/lib/schema/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, Eye, EyeOff, LockIcon, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { loginUser } from '../../actions/userActions';

function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const {
    handleSubmit,
    reset,
    control,
    setError: setFormFieldError,
  } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    disabled: isPending,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleFormAction(data: LoginInput) {
    setError('');
    startTransition(async () => {
      const { success, error, errors } = await loginUser(data);

      if (success) {
        toast.success('Signed in successfully');
        reset();
        router.push('/');
        router.refresh();
      } else if (error) {
        // Set error message
        setError(error);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm"
    >
      <FieldSet>
        <FieldContent className="gap-2 text-center">
          <FieldLabel className="mx-auto text-2xl font-semibold">
            Sign in to your account
          </FieldLabel>
          <FieldDescription>
            Enter your email below to login to your account
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
                </Field>
              )}
            />

            {/* Login Button */}
            <Field>
              <Button disabled={isPending} type="submit" size={'lg'}>
                {isPending && <Spinner />} Login
              </Button>
            </Field>

            <FieldSeparator>Or continue with</FieldSeparator>

            {/* Google login button */}
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

            {/* Sign up link */}
            <FieldDescription className="text-center">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-link">
                Sign up
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </FieldSet>
    </motion.div>
  );
}

export default LoginForm;

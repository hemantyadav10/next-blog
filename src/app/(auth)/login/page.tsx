import Loader from '@/components/ui/Loader';
import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function Login() {
  return (
    <Suspense fallback={<Loader center size="xl" />}>
      <LoginForm />
    </Suspense>
  );
}

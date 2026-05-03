import Loader from '@/components/ui/Loader';
import { Suspense } from 'react';
import RegistrationForm from './RegistrationForm';

function Register() {
  return (
    <Suspense fallback={<Loader center size="xl" />}>
      <RegistrationForm />
    </Suspense>
  );
}

export default Register;

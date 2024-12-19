import type { Metadata } from 'next';
import { Form } from './form';

export const metadata: Metadata = {
  title: 'Recipe Box - login',
};

export default async function LoginPage() {
  return <Form />;
}

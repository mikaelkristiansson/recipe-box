'use client';
import { login, signup } from './actions';
import {
  Tabs,
  Tab,
  Input,
  Button,
  Card,
  CardBody,
  Alert,
} from '@nextui-org/react';
import { useActionState, useState } from 'react';

export function Form() {
  const [selected, setSelected] = useState('login');
  const [loginState, loginFormAction, loginIsPending] = useActionState(
    (_prev: unknown, formData: FormData) => login(formData),
    { status: 'idle', email: '' }
  );

  return (
    <div className="flex h-full w-full justify-center items-center mt-6">
      <Card className="max-w-full w-[340px]">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            aria-label="Tabs form"
            selectedKey={selected}
            size="md"
            onSelectionChange={(key) => setSelected(String(key))}
          >
            <Tab key="login" title="Login">
              <form className="flex flex-col gap-4" action={loginFormAction}>
                <Input
                  isRequired
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  variant="bordered"
                  isDisabled={loginIsPending}
                  defaultValue={loginState.email}
                  key={loginState.email}
                />
                <Input
                  isRequired
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                  isDisabled={loginIsPending}
                />
                {loginState?.status === 'error' && (
                  <Alert
                    color="danger"
                    variant="faded"
                    description="Fel användarnamn eller lösenord, försök igen"
                  />
                )}
                <Button
                  color="primary"
                  variant="flat"
                  type="submit"
                  isLoading={loginIsPending}
                >
                  Log in
                </Button>
              </form>
            </Tab>
            <Tab key="sign-up" title="Sign up">
              <form className="flex flex-col gap-4">
                <Input
                  isRequired
                  label="First name"
                  placeholder="Enter your first name"
                  name="first_name"
                  type="text"
                  variant="bordered"
                />
                <Input
                  isRequired
                  label="Last name"
                  placeholder="Enter your last name"
                  name="last_name"
                  type="text"
                  variant="bordered"
                />
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  name="email"
                  type="email"
                  variant="bordered"
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  name="password"
                  type="password"
                  variant="bordered"
                />
                <Button
                  fullWidth
                  color="primary"
                  variant="flat"
                  type="submit"
                  formAction={signup}
                >
                  Sign up
                </Button>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}

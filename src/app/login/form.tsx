"use client";
import { login } from "./actions";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Link from "next/link";

export function Form() {
  return (
    <div className="flex h-full w-full justify-center items-center mt-6">
      <div className="w-full h-full max-w-96 border border-default-200 dark:border-default-100 p-4 rounded-lg">
        <form className="flex flex-col gap-2">
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            labelPlacement="outside"
            required
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            labelPlacement="outside"
            required
          />
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="flat"
              size="sm"
              type="submit"
              formAction={login}
            >
              Log in
            </Button>
            OR
            <Button
              color="secondary"
              variant="flat"
              size="sm"
              type="button"
              as={Link}
              href="/auth/sign-up"
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

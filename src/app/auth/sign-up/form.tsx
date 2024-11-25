"use client";
import { signup } from "./actions";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Link from "next/link";

export function Form() {
  return (
    <div className="flex h-full w-full justify-center items-center mt-6">
      <div className="w-full h-full max-w-96 border border-default-200 dark:border-default-100 p-4 rounded-lg">
        <Button size="sm" as={Link} href="/login">
          Back
        </Button>
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
          <Input
            label="First name"
            id="first_name"
            name="first_name"
            type="text"
            placeholder="Enter your first name"
            labelPlacement="outside"
            required
          />
          <Input
            label="Last name"
            id="last_name"
            name="last_name"
            type="text"
            placeholder="Enter your last name"
            labelPlacement="outside"
            required
          />
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="flat"
              size="sm"
              type="submit"
              formAction={signup}
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

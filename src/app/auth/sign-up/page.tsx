import type { Metadata } from "next";
import { Form } from "./form";

export const metadata: Metadata = {
  title: "Recipe Box - sign up",
};

export default function SignUpPage() {
  return <Form />;
}

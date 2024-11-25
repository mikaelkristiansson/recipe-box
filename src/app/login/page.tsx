import type { Metadata } from "next";
import { Form } from "./form";

export const metadata: Metadata = {
  title: "Recipe Box - login",
};

export default function LoginPage() {
  return <Form />;
}

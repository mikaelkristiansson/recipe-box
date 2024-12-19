import { NavigationBar } from "./Navbar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationBar />
      <section>{children}</section>
    </>
  );
}

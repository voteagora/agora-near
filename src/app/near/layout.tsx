import { ReactNode } from "react";

export const metadata = {
  title: "NEAR Wallet Connection | Agora",
  description: "Connect to your NEAR wallet and manage your connections",
};

export default function NearLayout({ children }: { children: ReactNode }) {
  return <main className="flex min-h-screen flex-col">{children}</main>;
}

import { Navbar } from "@/components/layout/navbar";
import type { ReactNode } from "react";

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import TopbarWrapper from "@/components/Topbar/Topbar";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-[250px] overflow-y-hidden">
        <TopbarWrapper />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

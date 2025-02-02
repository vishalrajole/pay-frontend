"use client";

import Link from "next/link";
import { Home, CreditCard } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const ROUTES_MAPPING = [
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Properties", href: "/properties", icon: Home },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 w-[250px] h-full bg-gray-800 text-white flex flex-col p-4">
      <div className="px-4 flex items-center space-x-2 mb-6">
        <Image
          src="/favicon.png"
          alt="Logo"
          width={28}
          height={28}
          className="w-7 h-7 object-contain rounded-md"
        />
        <h1 className="text-lg font-semibold">Buena</h1>
      </div>

      <nav className="space-y-4">
        {ROUTES_MAPPING.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center px-4 py-2 rounded-md cursor-pointer transition mb-2
                
                ${isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700"}`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

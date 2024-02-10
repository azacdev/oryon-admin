"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronFirst,
  ChevronLast,
  Settings,
  Image,
  ListChecks,
  Ruler,
  PaintBucket,
  ShoppingCart,
  LayoutDashboard,
  Package,
} from "lucide-react";
import { cn } from "@lib/utils";
import { useParams, usePathname } from "next/navigation";

import { useSidebar } from "@context/sidebar-toggle-context";
import { ModeToggle } from "./theme-toggle";

const Sidebar = () => {
  const params = useParams();
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (isClient && window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    if (isClient) {
      // Check initial window width
      handleResize();

      // Attach resize event listener
      window.addEventListener("resize", handleResize);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isClient, setIsSidebarOpen]);

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
      icon: LayoutDashboard,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeId}/billboards`,
      icon: Image,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeId}/categories`,
      icon: ListChecks,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeId}/sizes`,
      icon: Ruler,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      active: pathname === `/${params.storeId}/colors`,
      icon: PaintBucket,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathname === `/${params.storeId}/products`,
      icon: Package,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
      icon: Settings,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/${params.storeId}/orders`,
      icon: ShoppingCart,
    },
  ];

  return (
    <aside className="flex flex-col border-r px-3">
      <button
        className={`hidden p-3 rounded-lg lg:flex transition-colors ${
          isSidebarOpen ? "justify-end" : "justify-center"
        }`}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? <ChevronFirst /> : <ChevronLast />}
      </button>
      <div
        className={`flex flex-col transition-colors mt-3 ${
          isSidebarOpen ? "justify-center" : "justify-start items-center"
        }`}
      >
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={cn(
              "font-medium transition-colors hover:text-primary flex items-center py-2 my-1",
              route.active
                ? "text-blackdark:text-white"
                : "text-muted-foreground"
            )}
          >
            <route.icon className="mr-2" />
            <span
              className={`overflow-hidden transition-colors ${
                isSidebarOpen ? "w-full" : "w-0"
              }`}
            >
              {route.label}
            </span>
          </Link>
        ))}
      </div>
      <div className="flex mt-8 justify-start">
        <ModeToggle />
      </div>
    </aside>
  );
};

export default Sidebar;

"use client";

import Link from "next/link";
import {
  Settings,
  Image,
  ListChecks,
  Ruler,
  PaintBucket,
  ShoppingCart,
  LayoutDashboard,
  Package,
  MenuIcon,
  Package2,
} from "lucide-react";
import { cn } from "@lib/utils";
import { useParams, usePathname } from "next/navigation";

import { useSidebar } from "@context/sidebar-toggle-context";
import { ModeToggle } from "./theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const Sidebar = () => {
  const params = useParams();
  const pathname = usePathname();

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
    <aside className="flex-col border-r px-3 hidden sm:flex">
      <button className="mt-3 rounded-lg lg:flex transition-colors justify-center bg-primary text-lg font-semibold text-primary-foreground p-2">
        <Package2 className="h-7 w-7 transition-all group-hover:scale-110" />
      </button>
      <div className="flex flex-col transition-colors mt-3 justify-center items-center">
        {routes.map((route, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
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
                  <span className="sr-only">{route.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{route.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <div className="flex mt-8 justify-start">
        <ModeToggle />
      </div>
    </aside>
  );
};

export default Sidebar;

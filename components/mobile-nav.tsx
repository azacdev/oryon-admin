"use client";

import Link from "next/link";
import {
  PanelLeft,
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

import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@lib/utils";
import { useState } from "react";
const MobileNav = () => {
  const params = useParams();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="mr-4">
        <Button variant="outline" className="sm:hidden !px-2 !py-0">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <Link
          href={`/${params.storeId}`}
          className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary text-lg font-semibold text-primary-foreground md:text-base mb-3"
          onClick={() => setIsOpen(false)}
        >
          <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="grid text-lg font-medium">
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
              onClick={() => setIsOpen(false)}
            >
              <route.icon className="mr-2" />
              <span>{route.label}</span>
              <span className="sr-only">{route.label}</span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;

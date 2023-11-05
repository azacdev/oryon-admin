"use client";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const routes = [{
    
  }];
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    ></nav>
  );
}

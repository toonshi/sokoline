"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = () => {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on the homepage
  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  
  const breadcrumbs = [
    { name: "home", link: "/" },
    ...pathSegments.map((segment, index) => {
      const link = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const name = segment.replace(/-/g, " ");
      return { name, link };
    }),
  ];

  return (
    <nav className="mx-auto flex max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <ol className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
        {breadcrumbs.map((path, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/40" strokeWidth={3} />
            )}
            <Link
              href={path.link}
              className={`transition-colors hover:text-foreground ${
                index === breadcrumbs.length - 1 
                  ? "text-sokoline-accent" 
                  : "text-muted-foreground/60"
              }`}
            >
              {path.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

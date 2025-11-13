"use client";

import {
  PlusCircle,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Subnav } from "./Subnav";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/campaigns", label: "Campaigns" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 md:h-16 w-full items-center justify-between mx-auto px-4 py-3 md:px-6 md:py-4 lg:px-9 lg:py-4">
          <div className="flex items-center gap-3 md:gap-6 lg:gap-8">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Image 
                src="/images/logo.svg" 
                alt="Logo" 
                width={24} 
                height={24}
                className="h-6 w-6 md:h-5 md:w-7"
              />
              <Image
                src="/images/crowdfy.svg"
                alt="Crowdfy"
                width={60}
                height={45}
                className="h-7 w-auto md:h-9 md:w-20"
              />
            </div>

            <NavigationMenu className="hidden md:flex flex-1 justify-start">
              <NavigationMenuList className="gap-3 md:gap-4 lg:gap-6 items-center">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink
                        href={item.href}
                        className={cn(
                          "text-sm md:text-base transition-colors",
                          isActive
                            ? "font-bold text-gray-900"
                            : "text-gray-400 hover:text-gray-900"
                        )}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-lg bg-gray-100 hover:bg-gray-200 border-0"
            >
              <PlusCircle className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-gray-700" />
            </Button>
            <Avatar className="h-9 w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-full bg-gray-100 border-0">
              <AvatarImage
                src="/images/avatar.jpg"
                alt="User"
                className="object-cover rounded-full"
              />
              <AvatarFallback className="bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm">
                User
              </AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-lg bg-gray-100 hover:bg-gray-200 border-0"
            >
              <Settings className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-gray-700" />
            </Button>
          </div>
        </div>
      </header>

      {pathname === "/explore" && (
        <Subnav />
      )}
    </>
  );
}

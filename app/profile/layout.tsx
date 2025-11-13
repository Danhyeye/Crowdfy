import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crowdfy - Profile",
  description: "View and manage your profile",
  icons: {
    icon: "/images/logo.svg",
  },
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}

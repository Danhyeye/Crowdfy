import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campaigns",
  description: "Create and manage your campaigns and petitions",
  icons: {
    icon: "/images/logo.svg",
  },
};

export default function CampaignsLayout({
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

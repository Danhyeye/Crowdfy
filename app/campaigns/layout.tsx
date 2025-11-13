import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campaigns",
  description: "Create and manage your campaigns and petitions",
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

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
  description: "Explore the latest campaigns and petitions",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pt-20 sm:pt-12 md:pt-14">
      {children}
    </div>
  );
}

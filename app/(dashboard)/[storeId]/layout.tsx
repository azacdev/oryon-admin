import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@lib/prismadb";

import Navbar from "@components/navbar";
import { SidebarProvider } from "@context/sidebar-toggle-context";
import Sidebar from "@components/sidebar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <SidebarProvider>
        <div className="flex">
          <Sidebar />

          <div className="w-full">
            <Navbar />
            {children}
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}

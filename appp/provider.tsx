// "use client"
// import React, { useEffect } from 'react'
// import { useRouter } from 'next/navigation';
// import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// import axios from "axios";
// import { AppSidebar } from './_components/AppSidebar';
// import AppHeader from './_components/AppHeader';


// function DashboardProvider({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {

//     return (
//         <SidebarProvider>
//             <AppSidebar />
//             <main className='w-full'>
//                 <AppHeader />
//                 {/* <SidebarTrigger /> */}
//                 <div className='p-10'>{children}</div>
//             </main>
//         </SidebarProvider>

//     )
// }

// export default DashboardProvider


"use client";
import React from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";

function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignedIn>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <AppHeader />
            <div className="p-10">{children}</div>
          </main>
        </SidebarProvider>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default DashboardProvider;

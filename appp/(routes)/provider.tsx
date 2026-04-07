"use client";

import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../_components/AppSidebar';

function DashboardProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            {/* Sidebar on the left */}
            <AppSidebar />

            {/* Main content area */}
            <main className="w-full">
                {/* Removed AppHeader to eliminate unnecessary top white space */}
                <div className="p-10">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}

export default DashboardProvider;

"use client"

import { Outlet } from "react-router-dom"
import {Footer} from "./Footer"
import {Navbar} from "./Navbar"
import { Toaster } from "sonner"

export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-orange-50">
            <Navbar />
            <main className="flex-1">
              <Toaster position="top-right" richColors />  {/* Sonner Toaster */}
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
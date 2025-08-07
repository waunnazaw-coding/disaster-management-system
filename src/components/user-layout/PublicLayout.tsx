"use client"

import { Outlet } from "react-router-dom"
import {Footer} from "./Footer"
import {Navbar} from "./Navbar"
import { Toaster } from "react-hot-toast"

export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-orange-50">
            <Navbar />
            <main className="flex-1">
                <Toaster position="top-right" />
                <Outlet />
            </main>
            <Footer />
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#000',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </div>
    )
}
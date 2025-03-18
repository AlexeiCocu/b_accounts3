import type {Metadata} from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Geist, Geist_Mono} from "next/font/google";
import "../../globals.css";
import "../../glass.css";
import {Providers} from "@/redux/Providers";
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import React from "react";
import {routing} from '@/i18n/routing';
import Navbar from "@/app/[locale]/(root)/components/NavBar/Navbar";





const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: 'Bank Accounts Management',
    description: 'Manage bank accounts and fund transfers',
};

export default async function RootLayout({children, params}: { children: React.ReactNode; params: Promise<{locale: string}>; }) {

    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale}>
            <body className={`${geistSans.variable} ${geistMono.variable} dark-bubbles`}>
                <NextIntlClientProvider>
                    <Navbar/>
                    <Providers>{children}</Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

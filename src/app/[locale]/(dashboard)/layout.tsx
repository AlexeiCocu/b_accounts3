import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Providers} from "@/redux/Providers";
import DashboardNavbar from "@/app/[locale]/(dashboard)/dashboard/components/DashboardNavbar";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {routing} from "@/i18n/routing";
import {notFound} from "next/navigation";
import "./dashboard.css";


const DashboardLayout = async ({children, params}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) => {


    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <html lang={locale}>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Dashboard</title>
        </head>
            <body>
                <NextIntlClientProvider>
                    <DashboardNavbar/>

                    <Providers>{children}</Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
};

export default DashboardLayout;
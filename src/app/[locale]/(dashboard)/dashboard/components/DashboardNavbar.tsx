"use client"

import React, {useEffect} from 'react';
import {Link} from '@/i18n/navigation';
import Image from 'next/image';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {useTranslations} from "next-intl";


const DashboardNavbar = () => {
    const d = useTranslations('Dashboard');

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <Link className="navbar-brand" href="/">
                    <Image
                        src="/img/logo.png"
                        alt="Bank Manager Logo"
                        width={50}
                        height={30}
                    />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="/dashboard" className="nav-link" aria-current="page">
                                {d('main')}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/dashboard/accounts/create" className="nav-link" aria-current="page">
                                {d('createAccount')}
                            </Link>
                        </li>
                        <li className="d-xs-block d-lg-none">
                            <LanguageSwitcher/>
                        </li>

                    </ul>
                </div>

                <div className="d-none d-lg-block">
                    <LanguageSwitcher/>
                </div>

            </div>
        </nav>
    );
};

export default DashboardNavbar;
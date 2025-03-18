"use client";

import React, { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "./Navbar.module.css";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {useTranslations} from "next-intl";

function Navbar() {
    const g = useTranslations('General');

    const navRef = useRef<HTMLDivElement>(null);

    const showNavbar = () => {
        if (navRef.current) {
            navRef.current.classList.toggle(styles.responsive_nav);
        }
    };

    const handleLinkClick = () => {
        if (navRef.current && navRef.current.classList.contains(styles.responsive_nav)) {
            showNavbar();
        }
    };

    return (
        <header className={`${styles.header} container mt-2 glass glass_opacity-1`}>
            <Link className="navbar-brand" href="/" onClick={handleLinkClick}>
                <Image
                    src="/img/logo.png"
                    alt="Bank Manager Logo"
                    width={80}
                    height={50}
                />
            </Link>
            <nav ref={navRef} className={`${styles.nav}`}>
                <Link href="/" className='nav-link hover-grow text-white' onClick={handleLinkClick}>
                    {g('home')}
                </Link>
                <Link href="/dashboard" className="nav-link hover-grow text-white" onClick={handleLinkClick}>
                    {g('dashboard')}
                </Link>
                <LanguageSwitcher />
                <button
                    className={`${styles.nav_btn} ${styles.nav_close_btn}`}
                    onClick={showNavbar}
                >
                    <FaTimes />
                </button>
            </nav>
            <button
                className={styles.nav_btn}
                onClick={showNavbar}
            >
                <FaBars />
            </button>
        </header>
    );
}

export default Navbar;
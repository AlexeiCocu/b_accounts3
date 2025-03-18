import {Link, usePathname} from '@/i18n/navigation';
import { GB } from 'country-flag-icons/react/3x2'
import { FR } from 'country-flag-icons/react/3x2'
import React from "react";


const LanguageSwitcher = () => {
    const pathname = usePathname();
    return (
        <div className='d-flex align-items-center justify-content-center gap-2'>
            <Link href={pathname} locale="en" className='text-decoration-none'>
                <GB title="United Kinkdom" style={{ width: '24px', height: '24px' }}/>
            </Link>
            <Link href={pathname} locale="fr" className='ms-1 text-decoration-none'>
                <FR title="United States" style={{ width: '24px', height: '24px' }}/>
            </Link>
        </div>
    )
}

export default LanguageSwitcher;

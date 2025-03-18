import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const Home: React.FC = () => {
    const t = useTranslations('HomePage');
    const g = useTranslations('General');

    return (
        <div className='container'>
            <h1 className='text-white text-center mt-3'>{t('greeting')}</h1>
            <div className='position-absolute top-50 start-50 translate-middle'>

                <div className='d-flex flex-column flex-sm-row justify-content-center gap-1 gap-sm-5'>
                    <Link href="/accounts" className='text-decoration-none hover-grow'>
                        <h6 className='card glass glass_opacity-1 text-white text-nowrap p-5'>
                            {t('viewAccounts')}
                        </h6>
                    </Link>
                    <Link href="/transfer" className='text-decoration-none hover-grow'>
                        <h6 className='card glass glass_opacity-1 text-white text-nowrap p-5'>
                            {g('makeATransfer')}
                        </h6>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Home;

// server component ==
import React from 'react';
import AccountList from "@/app/[locale]/(root)/components/AccountsList";
import { getAccounts } from '@/lib/data';

const Page = async () => {
    const accounts = await getAccounts();

    return (
        <>
            <AccountList accounts={accounts}/>
        </>
    );
};

export default Page;
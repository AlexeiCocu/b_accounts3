import React from 'react';
import TransferFunds from "@/app/[locale]/(root)/components/TransferFunds";
import {getAccounts} from "@/lib/data";


interface TransferPageProps {
    searchParams: {
        ownerId?: string;
    };
}

const Page = async ({ searchParams }: TransferPageProps) => {
    const accounts = await getAccounts();
    const serializedAccounts = JSON.parse(JSON.stringify(accounts));

    return (
        <>
            <TransferFunds
                accounts={serializedAccounts}
                defaultFromOwnerId={searchParams.ownerId ? Number(searchParams.ownerId) : undefined}
            />
        </>
    );
};

export default Page;
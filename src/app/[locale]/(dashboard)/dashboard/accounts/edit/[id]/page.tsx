import React from 'react';
import { Account } from '@/types';
import { getAccounts } from '@/lib/data';
import DashboardEditAccountForm from '@/app/[locale]/(dashboard)/dashboard/components/DashboardEditAccountForm';

interface EditAccountPageProps {
    params: { id: string };
}

const EditAccountPage = async ({ params: { id } }: EditAccountPageProps) => {
    const accounts: Account[] = await getAccounts();

    const ownerId = parseInt(id, 10);
    const account = accounts.find((acc) => acc.ownerId === ownerId) || null;


    return (
        <div className='container'>
            <DashboardEditAccountForm account={account} />
        </div>
    );
};

export default EditAccountPage;

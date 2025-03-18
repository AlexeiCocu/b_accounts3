import React from 'react';
import DashboardAccountsList from "@/app/[locale]/(dashboard)/dashboard/components/DashboardAccountsList";
import { getAccounts } from "@/lib/data";


const Page = async () => {
    const accounts = await getAccounts();

    return (
        <div >
            <DashboardAccountsList accounts={accounts} />
        </div>
    );
};

export default Page;

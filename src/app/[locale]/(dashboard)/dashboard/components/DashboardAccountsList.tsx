"use client";

import React, {useTransition} from 'react';
import { Link } from '@/i18n/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { deleteAccount } from '@/redux/features/accountsSlice';
import { Account } from "@/types";
import { useTranslations } from "next-intl";
import { FaEdit, FaTrash } from 'react-icons/fa';


interface AccountsListProps {
    accounts: Account[];
}

const DashboardAccountsList = ({ accounts }: AccountsListProps) => {
    const g = useTranslations('General');
    const dispatch = useDispatch<AppDispatch>();
    const [, startTransition] = useTransition();

    const refreshPage = () => {
        startTransition(() => {
            window.location.reload();
        });
    };

    const handleDelete = (ownerId: number) => {
        dispatch(deleteAccount(ownerId)).then(() => {
            refreshPage();
        });
    };


    return (
        <div className="container">
            <h2 className="text-xl font-bold mt-2 mb-4">{g('accountsList')}</h2>
            {accounts.length === 0 ? (
                <div className='position-absolute top-50 start-50 translate-middle'>{g('noAccounts')}</div>
            ) : (
                <div className='row g-0 d-flex flex-column align-items-center custom-row'>
                    <div className='col-12 col-lg-6 custom-col'>
                        <table className="table table-sm table-hover shadow">
                            <thead>
                            <tr>
                                <th scope="col" className='fw-lighter'>#</th>
                                <th scope="col" className="text-center fw-lighter">{g('ownerId')}</th>
                                <th scope="col" className="text-center fw-lighter">{g('currency')}</th>
                                <th scope="col" className="text-center fw-lighter">{g('balance')}</th>
                                <th scope="col" className="text-end fw-lighter">{g('actions')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accounts.map((account) => (
                                <tr key={account.ownerId}>
                                    <th scope="row" className='fw-lighter'>{account.ownerId}</th>
                                    <td className="text-center">{account.ownerId}</td>
                                    <td className="text-center">{account.currency}</td>
                                    <td className="text-center">{account.balance.toFixed(2)}</td>
                                    <td className="text-end">
                                        <Link
                                            href={`/dashboard/accounts/edit/${account.ownerId}`}
                                            className="text-decoration-none btn btn-sm btn-light"
                                            aria-label="Edit"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(account.ownerId)}
                                            className="btn btn-sm btn-outline-danger ms-1"
                                            aria-label="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
        </div>
    );
};

export default DashboardAccountsList;
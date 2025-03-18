'use client';

import React, { useState } from 'react';
import { Account } from '@/types';
import Link from "next/link";
import {useTranslations} from "next-intl";

interface AccountsListProps {
    accounts: Account[];
}

const AccountsList = ({ accounts }: AccountsListProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const g = useTranslations('General');

    const filteredAccounts = accounts.filter((account) =>
        account.ownerId.toString().includes(searchTerm) ||
        account.currency.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='container-sm'>

            <div className='row d-flex justify-content-md-between pt-3 pt-md-5'>
                <div className='col col-12 col-md-6'>
                    <h2 className='text-white'>{g('accountsList')}</h2>
                </div>
                <div className='col col-12 col-md-6'>
                    <input
                        type="text"
                        placeholder={g('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 mb-4 border border-gray-300 rounded w-full float-md-end w-50 bg-transparent text-white"
                    />
                </div>
            </div>
            <div>
                {filteredAccounts.map((account) => (
                    <div key={account.ownerId} className="glass blur-15 glass_opacity-1 my-2">
                        <div className='d-flex  justify-content-between align-content-center p-1 p-sm-3'>
                            <div className='d-flex flex-column align-items-center'>
                                <p className='text-white fw-lighter'>{g('ownerId')}</p>
                                <span className='text-white'><strong>{account.ownerId}</strong></span>
                            </div>

                            <div className='d-flex flex-column align-items-center'>
                                <p className='text-white fw-lighter'>{g('currency')}</p>
                                <h6 className='text-white'><strong>{account.currency}</strong></h6>
                            </div>

                            <div className='d-flex flex-column align-items-center'>
                                <p className='text-white fw-lighter'>{g('balance')}</p>
                                <h6 className='text-white'><strong>{account.balance.toFixed(2)}</strong></h6>
                            </div>

                            <div className='d-flex flex-column align-items-center justify-content-center'>
                                <Link
                                    href={`/transfer?ownerId=${account.ownerId}`}
                                    className="text-decoration-none btn btn-sm btn-outline-light"
                                    aria-label="Transfer"
                                >
                                    {g('makeATransfer')}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AccountsList;

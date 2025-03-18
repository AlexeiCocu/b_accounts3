"use client"

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { editAccount } from '@/redux/features/accountsSlice';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Select from 'react-select';
import { getCurrencies } from '@/lib/data';

interface Account {
    ownerId: number;
    currency: string;
    balance: number;
}

type CurrencyOption = {
    value: string;
    label: string;
};

interface EditAccountFormProps {
    account: Account | null;
}

const DashboardEditAccountForm: React.FC<EditAccountFormProps> = ({ account }) => {
    const g = useTranslations('General');
    const d = useTranslations('Dashboard');
    const [currency, setCurrency] = useState(account?.currency || '');
    const [balance, setBalance] = useState(account?.balance || 0);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption | null>(null);

    useEffect(() => {
        if (!account) return; // Just return early if account is null

        const fetchCurrencies = async () => {
            const data = await getCurrencies();
            if (data) {
                const options = Object.entries(data).map(([code, name]) => ({
                    value: code.toUpperCase(),
                    label: `${code.toUpperCase()} - ${name}`,
                }));
                setCurrencyOptions(options);

                // Find the matching currency option for the account's currency
                const matchingOption = options.find((option) => option.value === account.currency.toUpperCase());
                if (matchingOption) {
                    setSelectedCurrency(matchingOption);
                }
            }
        };
        fetchCurrencies();
    }, [account]);



    if (!account) {
        return (
            <div className='position-absolute top-50 start-50 translate-middle'>
                {d('accountNotFound')}
            </div>
        );
    }



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await dispatch(editAccount({ ownerId: account.ownerId, currency, balance }));
        router.push('/dashboard');
    };

    const handleCancel = () => {
        router.push('/dashboard');
    };

    const handleCurrencyChange = (selectedOption: CurrencyOption | null) => {
        setSelectedCurrency(selectedOption);
        setCurrency(selectedOption ? selectedOption.value : '');
    };

    return (
        <>
            <h2 className="text-xl font-bold mt-2 mb-4">{d('editAccount')}</h2>
            <div className='row d-flex flex-column align-items-center m-1'>
                <div className='col-12 col-md-6'>
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="currency" className="form-label">{g('currency')}</label>
                                    <Select
                                        options={currencyOptions}
                                        value={selectedCurrency}
                                        onChange={handleCurrencyChange}
                                        className="mb-3"
                                        placeholder="Select a currency..."
                                        isSearchable
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="balance" className="form-label">{g('balance')}</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="balance"
                                        value={balance.toFixed(2)}
                                        onChange={(e) => setBalance(Number(e.target.value))}
                                    />
                                </div>

                                <div className="d-grid gap-2 col-6 mx-auto">
                                    <button type="submit" className="btn btn-sm btn-outline-secondary">{d('save')}</button>
                                    <button onClick={handleCancel} type="button" className="btn btn-sm btn-light">
                                        {g('cancel')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default DashboardEditAccountForm;
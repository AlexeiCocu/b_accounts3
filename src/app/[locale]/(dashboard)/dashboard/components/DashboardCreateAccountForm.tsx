"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createAccount } from '@/redux/features/accountsSlice';
import { AppDispatch } from '@/redux/store';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { getCurrencies } from '@/lib/data';
import Select from 'react-select';

type CurrencyOption = {
    value: string;
    label: string;
};

const DashboardCreateAccountForm = () => {
    const d = useTranslations('Dashboard');
    const g = useTranslations('General');
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const [ownerId, setOwnerId] = useState<number | ''>('');
    const [currency, setCurrency] = useState('');
    const [balance, setBalance] = useState<number | ''>('');
    const [error, setError] = useState('');
    const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption | null>(null);

    useEffect(() => {
        const fetchCurrencies = async () => {
            const data = await getCurrencies();
            if (data) {
                const options = Object.entries(data).map(([code, name]) => ({
                    value: code.toUpperCase(),
                    label: `${code.toUpperCase()} - ${name}`,
                }));
                setCurrencyOptions(options);
            }
        };
        fetchCurrencies();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!ownerId || !currency || balance === '') {
            setError(d('errorAllFieldsRequired'));
            return;
        }

        if (balance < 0) {
            setError(d('errorBalanceNegative'));
            return;
        }

        try {
            const newAccount = { ownerId: Number(ownerId), currency, balance: Number(balance) };
            await dispatch(createAccount(newAccount)).unwrap();

            setOwnerId('');
            setCurrency('');
            setBalance('');
            setError('');

            router.push('/dashboard');
        } catch (error) {
            setError(error as string);
        }
    };

    const handleCancel = () => {
        router.push('/dashboard');
    };

    const handleCurrencyChange = (selectedOption: CurrencyOption | null) => {
        setError('');
        setSelectedCurrency(selectedOption);
        setCurrency(selectedOption ? selectedOption.value : '');
    };

    const handleBalanceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setBalance(Number(e.target.value));
    }

    return (
        <div className="container">
            <h2 className="text-xl font-bold mt-2 mb-4">{d('addNewAccount')}</h2>
            <div className="row d-flex flex-column align-items-center m-1">
                <div className="col-12 col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="ownerId" className="form-label">
                                        {g('ownerId')}
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="ownerId"
                                        value={ownerId}
                                        onChange={(e) => setOwnerId(Number(e.target.value))}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="currency" className="form-label">
                                        {g('currency')}
                                    </label>
                                    <Select
                                        options={currencyOptions}
                                        value={selectedCurrency}
                                        onChange={handleCurrencyChange}
                                        className="mb-3"
                                        placeholder={g('selectCurrencyPlaceholder')}
                                        isSearchable
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="balance" className="form-label">
                                        {g('balance')}
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="balance"
                                        value={balance}
                                        onChange={(e) => handleBalanceInput(e)}
                                    />
                                </div>

                                {error && <div className="text-danger fs-6 fw-lighter mb-3">{error}</div>}

                                <div className="d-grid gap-2 col-6 mx-auto">
                                    <button type="submit" className="btn btn-sm btn-outline-secondary">
                                        {d('create')}
                                    </button>
                                    <button onClick={handleCancel} type="button" className="btn btn-sm btn-light">
                                        {g('cancel')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCreateAccountForm;
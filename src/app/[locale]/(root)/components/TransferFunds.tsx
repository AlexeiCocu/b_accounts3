"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { transferFunds } from '@/redux/features/accountsSlice';
import { AppDispatch } from '@/redux/store';
import { Account } from "@/types";
import Select from 'react-select';
import axios from 'axios';
import { useRouter } from '@/i18n/navigation';
import {useTranslations} from "next-intl";

interface AccountsListProps {
    accounts: Account[];
    defaultFromOwnerId?: number;
}

type AccountOption = {
    value: number;
    label: string;
};

const TransferFunds = ({ accounts, defaultFromOwnerId }: AccountsListProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [fromOwnerId, setFromOwnerId] = useState<number | ''>(defaultFromOwnerId || '');
    const [toOwnerId, setToOwnerId] = useState<number | ''>('');
    const [amount, setAmount] = useState<number | ''>('');
    const [error, setError] = useState<string | null>(null);
    const [errorFromOwnerId, setErrorFromOwnerId] = useState<string | null>(null);
    const router = useRouter();
    const t = useTranslations('TransferPage');
    const g = useTranslations('General');

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    const fetchExchangeRate = async (fromCurrency: string, toCurrency: string) => {
        try {
            const response = await axios.get(`https://latest.currency-api.pages.dev/v1/currencies/${fromCurrency.toLowerCase()}.json`);
            const data = response.data;

            if (!data[fromCurrency.toLowerCase()] || !data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()]) {
                throw new Error('Exchange rate not found');
            }

            return data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
        } catch (error) {
            console.error('Failed to fetch exchange rate:', error);
        }
    };

    const handleTransfer = async () => {
        setError(null);
        setErrorFromOwnerId(null);

        if (!fromOwnerId || !toOwnerId || !amount || amount <= 0) {
            setError(t('errorFillAllFields'));
            return;
        }

        if (fromOwnerId === toOwnerId) {
            setError(t('errorSameAccount'));
            return;
        }

        const fromAccount = accounts.find(account => account.ownerId === fromOwnerId);
        const toAccount = accounts.find(account => account.ownerId === toOwnerId);

        if (!fromAccount || !toAccount) {
            setError(t('errorAccountNotFound'));
            return;
        }

        const fromCurrency = fromAccount.currency.toLowerCase();
        const toCurrency = toAccount.currency.toLowerCase();

        try {
            const exchangeRate = await fetchExchangeRate(fromCurrency, toCurrency);
            if (!exchangeRate) {
                throw new Error('Failed to fetch exchange rate.');
            }
            const convertedAmount = amount * exchangeRate;
            const formattedAmount = parseFloat(convertedAmount.toFixed(2));
            await dispatch(transferFunds({ fromOwnerId, toOwnerId, amount: formattedAmount })).unwrap();
            setError(null);
            router.push('/accounts');

        } catch (error: unknown) {
            if (typeof error === 'string') {
                setError(error);
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(t('unknownError'));
            }
        }
    };

    const options: AccountOption[] = accounts.map(account => ({
        value: account.ownerId,
        label: `${account.ownerId} - ${account.currency} (Balance: ${account.balance.toFixed(2)})`
    }));

    const handleChangeFromOwnerId = (selectedOption: AccountOption | null) => {
        setErrorFromOwnerId(null);
        setFromOwnerId(selectedOption ? selectedOption.value : '');
    };

    const handleChangeToOwnerId = (selectedOption: AccountOption | null) => {
        setError('');
        setToOwnerId(selectedOption ? selectedOption.value : '');
    };

    const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        const value = e.target.value;
        setAmount(value === '' ? '' : Number(value));
    };

    return (
        <div className="container" data-testid="transfer-funds" data-accounts={JSON.stringify(accounts)} data-default-from-owner-id={defaultFromOwnerId}>
            <div className='row d-flex justify-content-md-between pt-3 pt-md-5'>
                <div className='col col-12 col-md-6'>
                    <h2 className='text-white'>{t('pageTitle')}</h2>
                </div>
            </div>

            <div className='row d-flex justify-content-center my-2'>
                <div className='col-sm-12 col-lg-6'>
                    <div className='glass glass_opacity-1 p-2 p-md-5'>

                    <div className='mb-3'>
                        <label className='text-white'>{t('fromAccount')}:</label>
                        <Select
                            options={options}
                            value={options.find(option => option.value === fromOwnerId)}
                            onChange={handleChangeFromOwnerId}
                            placeholder={g('selectPlaceholder')}
                            isSearchable
                        />
                        {errorFromOwnerId && <p className="text-danger">{errorFromOwnerId}</p>}
                    </div>

                    <div className='mb-3'>
                        <label className='text-white'>{t('toAccount')}:</label>
                        <Select
                            options={options}
                            value={options.find(option => option.value === toOwnerId)}
                            onChange={handleChangeToOwnerId}
                            placeholder={g('selectPlaceholder')}
                            isSearchable
                        />
                    </div>

                    <div className="mb-4">
                        <div className='row d-flex align-items-center justify-content-center'>
                            <div className='d-flex flex-column'>
                                <label className='text-white'>{t('amount')}:</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => handleChangeAmount(e)}
                                    className="ml-2 p-2 border rounded"
                                />
                            </div>
                        </div>
                    </div>

                    {error && <div className="text-danger">{error}</div>}

                    <button
                        onClick={handleTransfer}
                        className="btn btn-sm btn-outline-light w-100 mt-5"
                    >
                        {t('transfer')}
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default TransferFunds;
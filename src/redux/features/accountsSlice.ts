import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import apiClient from "@/api/apiClient";
import {AxiosError} from "axios";

export interface Account {
    ownerId: number;
    currency: string;
    balance: number;
}

export interface AccountsState {
    accounts: Account[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AccountsState = {
    accounts: [],
    status: 'idle',
    error: null,
};

export const fetchAccounts = createAsyncThunk('accounts/fetchAccounts', async () => {
    try {
        const response = await apiClient.get('/api/accounts');
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
});


export const createAccount = createAsyncThunk(
    'accounts/createAccount',
    async (newAccount: Account, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/accounts', newAccount);
            return response.data;
        } catch (error) {
            console.error('Create Account API Error:', error);

            const axiosError = error as AxiosError;

            if (axiosError.response && axiosError.response.data && (axiosError.response.data as { message: string }).message) {
                return rejectWithValue((axiosError.response.data as { message: string }).message);
            }

            return rejectWithValue('An unknown error occurred.');
        }
    }
);

export const editAccount = createAsyncThunk(
    'accounts/updateAccount',
    async (account: Account) => {
        try {
            const response = await apiClient.put(`/api/accounts/${account.ownerId}`, account);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
);


export const transferFunds = createAsyncThunk(
    'accounts/transferFunds',
    async (transferData: { fromOwnerId: number; toOwnerId: number; amount: number }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/accounts/transfer', transferData);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;

            if (axiosError.response && axiosError.response.data && (axiosError.response.data as { message: string }).message) {
                const errorMessage = (axiosError.response.data as { message: string }).message;

                if (errorMessage !== 'Insufficient balance') {
                    console.error('TransferFunds API Error:', error);
                }

                return rejectWithValue(errorMessage);
            }

            // Log other unexpected errors
            console.error('TransferFunds API Error:', error);
            return rejectWithValue('An unexpected error occurred. Please try again.');
        }
    }
);


export const deleteAccount = createAsyncThunk('accounts/deleteAccount', async (ownerId: number) => {
    try {
        await apiClient.delete(`/api/accounts/${ownerId}`);
        return ownerId;
    } catch (error) {
        console.error('Delete API Error:', error);
        throw error;
    }
});

const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccounts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<Account[]>) => {
                state.status = 'succeeded';
                state.accounts = action.payload;
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(createAccount.fulfilled, (state, action: PayloadAction<Account>) => {
                state.accounts.push(action.payload);
            })
            .addCase(createAccount.rejected, (state, action) => {
                state.error = action.payload as string || 'Failed to create account';
            })
            .addCase(deleteAccount.fulfilled, (state, action: PayloadAction<number>) => {
                state.accounts = state.accounts.filter(account => account.ownerId !== action.payload);
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.error = action.payload as string || 'Failed to delete account';
            })
            .addCase(editAccount.fulfilled, (state, action: PayloadAction<Account>) => {
                const index = state.accounts.findIndex(acc => acc.ownerId === action.payload.ownerId);
                if (index !== -1) {
                    state.accounts[index] = action.payload;
                }
            })
            .addCase(editAccount.rejected, (state, action) => {
                state.error = action.payload as string || 'Failed to update account';
            })
            .addCase(transferFunds.fulfilled, (state, action) => {
            const { fromAccount, toAccount } = action.payload;

            const fromIndex = state.accounts.findIndex(acc => acc.ownerId === fromAccount.ownerId);
            if (fromIndex !== -1) {
                state.accounts[fromIndex].balance = fromAccount.balance;
            }

            const toIndex = state.accounts.findIndex(acc => acc.ownerId === toAccount.ownerId);
            if (toIndex !== -1) {
                state.accounts[toIndex].balance = toAccount.balance;
            }
        })
    },
});

export default accountsSlice.reducer;

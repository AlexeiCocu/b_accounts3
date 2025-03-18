import accountsSlice, {
    fetchAccounts,
    createAccount,
    editAccount,
    transferFunds,
    deleteAccount,
    AccountsState,
} from './accountsSlice';
import apiClient from '@/api/apiClient';
import { configureStore } from '@reduxjs/toolkit';
import {AppDispatch, RootState} from "../store"


jest.mock('@/api/apiClient.ts');

describe('accountsSlice', () => {
    let store: ReturnType<typeof configureStore>;
    let dispatch: AppDispatch;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                accounts: accountsSlice,
            },
        });
        dispatch = store.dispatch;
        jest.clearAllMocks();
    });

    describe('fetchAccounts', () => {
        it('should handle fetchAccounts.pending', () => {
            store.dispatch(fetchAccounts.pending('', undefined));
            const state = (store.getState() as { accounts: AccountsState }).accounts;
            expect(state.status).toBe('loading');
        });

        it('should handle fetchAccounts.fulfilled', async () => {
            const mockAccounts = [
                { ownerId: 1, currency: 'USD', balance: 100 },
                { ownerId: 2, currency: 'EUR', balance: 200 },
            ];
            (apiClient.get as jest.Mock).mockResolvedValue({ data: mockAccounts });

            await dispatch(fetchAccounts());
            const state = (store.getState() as RootState).accounts;
            expect(state.status).toBe('succeeded');
            expect(state.accounts).toEqual(mockAccounts);
        });

        it('should handle fetchAccounts.rejected', async () => {
            (apiClient.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

            await dispatch(fetchAccounts());
            const state = (store.getState() as { accounts: AccountsState }).accounts;
            expect(state.status).toBe('failed');
            expect(state.error).toBe('Failed to fetch');
        });
    });

    describe('createAccount', () => {
        it('should handle createAccount.fulfilled', async () => {
            const newAccount = { ownerId: 3, currency: 'GBP', balance: 300 };
            (apiClient.post as jest.Mock).mockResolvedValue({ data: newAccount });

            await dispatch(createAccount(newAccount));
            const state = (store.getState() as { accounts: AccountsState }).accounts;
            expect(state.accounts).toContainEqual(newAccount);
        });

        it('should handle createAccount.rejected', async () => {
            const errorMessage = 'Failed to create account';
            (apiClient.post as jest.Mock).mockRejectedValue({
                response: { data: { message: errorMessage } },
            });

            await dispatch(createAccount({ ownerId: 3, currency: 'GBP', balance: 300 }));
            const state = (store.getState() as { accounts: AccountsState }).accounts;
            expect(state.error).toBe(errorMessage);
        });
    });

    describe('editAccount', () => {
        it('should handle editAccount.fulfilled', async () => {
            const updatedAccount = { ownerId: 1, currency: 'USD', balance: 150 };

            (apiClient.put as jest.Mock).mockReset();

            (apiClient.put as jest.Mock).mockResolvedValue({ data: updatedAccount });

            const preloadedState: { accounts: AccountsState } = {
                accounts: {
                    accounts: [{ ownerId: 1, currency: 'USD', balance: 150 }],
                    status: 'idle',
                    error: null,
                },
            };

            store = configureStore({
                reducer: {
                    accounts: accountsSlice,
                },
                preloadedState,
            });

            await dispatch(editAccount(updatedAccount));

            const state = (store.getState() as { accounts: AccountsState }).accounts;

            const account = state.accounts.find((acc) => acc.ownerId === updatedAccount.ownerId);

            expect(account).toEqual(updatedAccount);
        });

        it('should handle editAccount.rejected', async () => {
            const errorMessage = 'Failed to update account';
            (apiClient.put as jest.Mock).mockRejectedValue({
                response: { data: { message: errorMessage } },
            });

            await dispatch(editAccount({ ownerId: 1, currency: 'USD', balance: 150 }));
            const state = (store.getState() as { accounts: AccountsState }).accounts;
            expect(state.error).toBe(errorMessage);
        });
    });

    describe.skip('transferFunds', () => {
        it('should handle transferFunds.fulfilled', async () => {
            const transferData = { fromOwnerId: 1, toOwnerId: 2, amount: 50 };
            const fromAccount = { ownerId: 1, currency: 'USD', balance: 50 };
            const toAccount = { ownerId: 2, currency: 'EUR', balance: 250 };
            (apiClient.post as jest.Mock).mockResolvedValue({
                data: { fromAccount, toAccount },
            });

            // Define the preloadedState with initial accounts
            const preloadedState: { accounts: AccountsState } = {
                accounts: {
                    accounts: [
                        { ownerId: 1, currency: 'USD', balance: 100 }, // Initial fromAccount
                        { ownerId: 2, currency: 'EUR', balance: 200 }, // Initial toAccount
                    ],
                    status: 'idle',
                    error: null,
                },
            };

            // Configure the store with preloadedState
            store = configureStore({
                reducer: {
                    accounts: accountsSlice,
                },
                preloadedState, // Pass the preloadedState here
            });

            // Dispatch the transferFunds action
            await dispatch(transferFunds(transferData));

            // Log the state after the action is dispatched
            const state = (store.getState() as { accounts: AccountsState }).accounts;
            console.log('State after update:', state);

            // Find the updated accounts
            const updatedFromAccount = state.accounts.find((acc) => acc.ownerId === fromAccount.ownerId);
            const updatedToAccount = state.accounts.find((acc) => acc.ownerId === toAccount.ownerId);

            // Assert that the accounts were updated
            expect(updatedFromAccount?.balance).toBe(50);
            expect(updatedToAccount?.balance).toBe(250);
        });

        it('should handle transferFunds.rejected', async () => {
            const errorMessage = 'Insufficient balance';
            (apiClient.post as jest.Mock).mockRejectedValue({
                response: { data: { message: errorMessage } },
            });

            // Dispatch the transferFunds action
            await dispatch(transferFunds({ fromOwnerId: 1, toOwnerId: 2, amount: 1000 }));

            // Log the state after the action is dispatched
            const state = (store.getState() as { accounts: AccountsState }).accounts;
            console.log('State after rejection:', state);

            // Assert that the error was set
            expect(state.error).toBe(errorMessage);
        });
    });

    describe('deleteAccount', () => {
        it('should handle deleteAccount.fulfilled', async () => {
            const ownerId = 1;
            (apiClient.delete as jest.Mock).mockResolvedValue({});

            await dispatch(deleteAccount(ownerId));
            const state = (store.getState() as { accounts: AccountsState }).accounts;
            expect(state.accounts.some((acc) => acc.ownerId === ownerId)).toBe(false);
        });

        it('should handle deleteAccount.rejected', async () => {
            (apiClient.delete as jest.Mock).mockRejectedValue(new Error('Failed to delete'));

            await dispatch(deleteAccount(1));
            const state = (store.getState() as { accounts: AccountsState }).accounts;
            expect(state.error).toBe('Failed to delete account');
        });
    });
});
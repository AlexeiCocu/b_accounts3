import {configureStore, EnhancedStore, ThunkDispatch, UnknownAction} from '@reduxjs/toolkit';
import accountsReducer from './features/accountsSlice';

export const store = configureStore({
    reducer: {
        accounts: accountsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = EnhancedStore<RootState>;

export type AppDispatch = ThunkDispatch<RootState, undefined, UnknownAction>;


import { Account } from '@/types';
import apiClient from "@/api/apiClient";
import axios from "axios";

export async function getAccounts(): Promise<Account[]> {
    try {
        const response = await apiClient.get('/api/accounts');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch accounts:', error);
        return [];
    }
}


export async function getCurrencies() {
    try{
        const response = await axios.get('https://latest.currency-api.pages.dev/v1/currencies.json');
        return response.data;
    }catch(error){
        console.error('Failed to fetch accounts:', error);
        return [];
    }
}
import axios from 'axios';
import { SafeTransaction } from '@/types/safe';

export const createSafeTransaction = async (data: any): Promise<SafeTransaction> => {
    const response = await axios.post('/api/safe-transactions', data);
    return response.data;
};

export const getSafeTransactions = async (): Promise<SafeTransaction[]> => {
    const response = await axios.get('/api/safe-transactions');
    return response.data;
};

export const getSafeTransaction = async (id: string): Promise<SafeTransaction> => {
    const response = await axios.get(`/api/safe-transactions/${id}`);
    return response.data;
};
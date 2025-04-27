export interface SafeAccount {
    id: string;
    name: string;
    description?: string;
    balance: number;
    created_at: string;
    updated_at: string;
}

export interface SafeTransaction {
    id: string;
    transaction_number: string;
    transaction_type: 'betweenAccounts' | 'fromSafe';
    sender_id: string;
    sender_name: string;
    receiver_id: string;
    receiver_name: string;
    amount: number;
    description?: string;
    created_at: string;
    updated_at: string;
}
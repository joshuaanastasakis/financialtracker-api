export interface ID {
    id:number;
}

export interface User extends ID {
    name: string,
    email: string,
    registration_code?:string,
    login_code?:string,
    registered?: boolean;
}

export interface Account extends ID {
    name: string;
    type: string;
    balance: number;
    owner_id: number;
}

export interface AccountType {
    title: string;
    category: string;
}

export interface Transaction extends ID {
    date: string;
    amount: number;
    description: string;
    to_account_id?: number;
    from_account_id?: number;
    user_id: number;
}



export type BlankTemplate<T> = {
    [K in keyof T]: any | null
}

/* FILTERS */
export const TransactionFilters = [
    'filter_from_date',
    'filter_to_date',
    'filter_min_amount',
    'filter_max_amount',
    'filter_to_account_id',
    'filter_from_account_id',
    'filter_user_id',
]

export const AccountFilters = [
    'filter_type',
    'filter_min_balance',
    'filter_max_balance',
    'filter_owner_id',
]

export const AccountTypeFilters = [
    'filter_titles',
]

export const AccountEditOptions = [
    'edit_name',
    'edit_type',
]

export type ResponseTemplate = {
    [key:string]:any
}
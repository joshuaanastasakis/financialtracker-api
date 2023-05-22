import express from 'express';

import { 
    Account, 
    AccountFilters,
    AccountTypeFilters,
    AccountEditOptions
} from '../models/types';
import { ResponseTemplate } from '../models/types';

let accountTypes: string[] = [];
let accounts: Account[] = [

]

function getLatestAccountID(): number | null {
    if (accounts.length===0) return null;
    let max = accounts[0].id;
    for (let i=0; i < accounts.length; i++) {
        if (accounts[i].id > max) max = accounts[i].id;
    }
    return max;
}

export function getAccounts (req: express.Request, res: express.Response) {
    let tAccounts = accounts;
    let filters: ResponseTemplate = {};
    for (let key in req.body) {
        console.log(key);
        if (AccountFilters.includes(key)) filters[key]=req.body[key];
    }
    
    if (filters['filter_type']) {
        tAccounts = tAccounts.filter(t => t.type >= req.body['filter_type']);
    }
    if (filters['filter_min_balance']) {
        tAccounts = tAccounts.filter(t => t.balance >= req.body['filter_min_balance'])
    }
    if (filters['filter_max_balance']) {
        tAccounts = tAccounts.filter(t => t.balance <= req.body['filter_max_balance'])
    }
    if (filters['filter_owner_id']) {
        tAccounts = tAccounts.filter(t => t.owner_id === req.body['filter_owner_id'])
    }
    
    res.status(200).json({data: tAccounts})
}

export function addAccount (req: express.Request, res: express.Response) {
    const latestAccountID = getLatestAccountID() || 0;
    if (accountTypes.includes(req.body['type'])) {
        let newAccount: Account = {...req.body, id: latestAccountID+1};
        accounts.push(newAccount);
        res.status(201).json({msg: "Account created successfully"})
    } else {
        res.status(400).json({error: `Account type ${req.body['type']} doesn't exist`})
    }
}

export function getAccount(req: express.Request, res: express.Response) {
    const account = accounts.find((t:Account) => t.id===(+req.params.id))
    if (account) res.status(200).json({data: account});
    else res.status(401).json({error: `Transaction with id ${req.params.id} not found`})
}

export function editAccount(req: express.Request, res: express.Response) {
    const account = accounts.find((t:Account, idx:number) => t.id===(+req.params.id))
    if (account) {
        // TODO: get edit options
        const index = accounts.indexOf(account);
        let filters: ResponseTemplate = {};
        for (let key in req.body) {
            console.log(key);
            if (AccountEditOptions.includes(key)) filters[key]=req.body[key];
        }

        if (filters['edit_name'] && filters['edit_name'] !== account.name) {
            accounts[index].name = filters['edit_name'];
        }
        if (filters['edit_type'] && filters['edit_type'] !== account.type && accountTypes.includes(filters['edit_type'])) {
            accounts[index].type = filters['edit_type'];
        }

        res.status(201).json({data: account});
    }
    else res.status(401).json({error: `Transaction with id ${req.params.id} not found`})
}

export function deleteAccount(req: express.Request, res: express.Response) {
    const search_id = +req.params.id;
    const account = accounts.find((t:Account) => t.id===search_id)
    if (account) {
        accounts = accounts.filter((t: Account) => t.id !==search_id);
        res.status(200).json({msg: `Account with ID ${search_id} successfully deleted`});
    }
    else res.status(401).json({error: `Account with ID ${search_id} not found`})
}

export function getAccountTypes (req: express.Request, res: express.Response) {
    let tAccountTypes = accountTypes;
    let filters: ResponseTemplate = {};

    for (let key in req.body) {
        console.log(key);
        if (AccountTypeFilters.includes(key)) {
            if (key==='filter_titles') filters[key]=req.body[key] as Array<string>;
        }
    }
    
    if (filters['filter_titles']) {
        tAccountTypes = tAccountTypes.filter(t => filters['filter_titles'].includes(t));
    }
    
    res.status(200).json({data: tAccountTypes})
}

export function addAccountType (req: express.Request, res: express.Response) {
    let newAccountType: string = req.body['title'];
    if (!accountTypes.includes(newAccountType) && newAccountType) {
        accountTypes.push(newAccountType);
        res.status(201).json({msg: "Account type created successfully"})
    } else {
        res.status(409).json({error: `Account type ${newAccountType} already exists`})
    }
}
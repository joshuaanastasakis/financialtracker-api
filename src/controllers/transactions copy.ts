import {
    ResponseTemplate,
    TransactionFilters, 
    Transaction,
} from '../models/types'
import express from 'express';

let transactions: Transaction[] = [

]

function getLatestTransactionID(): number | null {
    if (transactions.length===0) return null;
    let max = transactions[0].id;
    for (let i=0; i < transactions.length; i++) {
        if (transactions[i].id > max) max = transactions[i].id;
    }
    return max;
}

export function getTransactions(req: express.Request, res: express.Response) {
    let tTransactions = transactions;
    let filters: ResponseTemplate = {};
    for (let key in req.body) {
        console.log(key);
        if (TransactionFilters.includes(key)) filters[key]=req.body[key];
    }
    
    if (filters['filter_from_date']) {
        tTransactions = tTransactions.filter(t => t.date >= req.body['filter_from_date']);
    }
    if (filters['filter_to_date']) {
        tTransactions = tTransactions.filter(t => t.date <= req.body['filter_to_date']);
    }
    if (filters['filter_min_amount']) {
        tTransactions = tTransactions.filter(t => t.amount >= req.body['filter_min_amount'])
    }
    if (filters['filter_max_amount']) {
        tTransactions = tTransactions.filter(t => t.amount <= req.body['filter_max_amount'])
    }
    if (filters['filter_to_account_id']) {
        tTransactions = tTransactions.filter(t => t.to_account_id === req.body['filter_to_account_id'])
    }
    if (filters['filter_from_account_id']) {
        tTransactions = tTransactions.filter(t => t.from_account_id === req.body['filter_from_account_id'])
    }
    if (filters['filter_user_id']) {
        tTransactions = tTransactions.filter(t => t.user_id === req.body['filter_user_id'])
    }
    
    res.status(200).json({data: tTransactions})
}

export function addTransaction (req: express.Request, res: express.Response) {
    const latestTransactionID = getLatestTransactionID() || 0;
    let newTransaction: Transaction = {...req.body, id: latestTransactionID+1};
    transactions.push(newTransaction);
    res.status(201).json({msg: "Transaction created successfully"})
}

export function getTransaction(req: express.Request, res: express.Response) {
    const transaction = transactions.find((t:Transaction) => t.id===(+req.params.id))
    if (transaction) res.status(200).json({data: transaction});
    else res.status(401).json({error: `Transaction with ID ${req.params.id} not found`})
}

export function deleteTransaction(req: express.Request, res: express.Response) {
    const search_id = +req.params.id;
    const transaction = transactions.find((t:Transaction) => t.id===search_id)
    if (transaction) {
        transactions = transactions.filter((t: Transaction) => t.id !==search_id);
        res.status(200).json({msg: `Transaction with ID ${search_id} successfully deleted`});
    }
    else res.status(401).json({error: `Transaction with ID ${search_id} not found`})
}
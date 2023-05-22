import {
    ResponseTemplate,
    TransactionFilters, 
    Transaction,
    BlankTemplate
} from '../models/types'
import express from 'express';
import { MongoClient, ServerApiVersion, Collection, Db, Document } from 'mongodb';

const {
    DB, 
    USERS, 
    TRANSACTIONS, 
    ACCOUNTS, 
    ACCOUNTTYPES, 
} = require('../utils/db');

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

export async function getTransactions(req: express.Request, res: express.Response) {
    // compile accepted filters
    let filters: ResponseTemplate = {};
    for (let key in req.body) {
        console.log(key);
        if (TransactionFilters.includes(key)) filters[key]=req.body[key];
    }

    let mongofilters:BlankTemplate<Transaction> = <BlankTemplate<Transaction>>{};
    
    // compile filters
    if (filters['filter_from_date']) {
        mongofilters.date.$gte = filters['filter_from_date'];
    }
    if (filters['filter_to_date']) {
        mongofilters.date.$lte = filters['filter_to_date'];
    }
    if (filters['filter_min_amount']) {
        mongofilters.amount.$gte = filters['filter_min_amount'];
    }
    if (filters['filter_max_amount']) {
        mongofilters.amount.$lte = filters['filter_max_amount'];
    }
    if (filters['filter_to_account_id']) {
        mongofilters.to_account_id.$eq = filters['filter_to_account_id'];
    }
    if (filters['filter_from_account_id']) {
        mongofilters.from_account_id.$eq = filters['filter_from_account_id'];
    }
    if (filters['filter_user_id']) {
        mongofilters.amount.$eq = filters['filter_user_id'];
    }

    const cursor = TRANSACTIONS.find({}, mongofilters);

    let tTransactions:Document[] = [];
    for await (const doc of cursor) {
        tTransactions.push(doc);
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
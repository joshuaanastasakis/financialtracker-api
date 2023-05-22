import express from 'express';
import { Express } from 'express-serve-static-core';
import bodyParser from 'body-parser';

import { 
    getTransactions,
    addTransaction,
    getTransaction,
    deleteTransaction
} from '../controllers/transactions';

import { 
    getAccounts,
    getAccount,
    addAccount,
    deleteAccount,
    editAccount,

    getAccountTypes,
    addAccountType,
} from '../controllers/accounts';

import { 
    register_sendCode,
    // register_confirmCode,
    login
} from '../controllers/auth';

import {
    log
} from '../middleware/log'
import { Collection, CollectionInfo, Db, Document, MongoClient, ServerApiVersion, WithId } from 'mongodb';

const {
    DB, 
    USERS, 
    TRANSACTIONS, 
    ACCOUNTS, 
    ACCOUNTTYPES, 
} = require('./db');

export async function createServer(): Promise<Express> {
    const server = express();

    
    // middleware
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    
    server.use(log)

    server.route('/register')
    .post(register_sendCode);

    server.route('/register/confirm')
    // .post(register_confirmCode);

    server.route('/transactions')
    .get(getTransactions)
    .post(addTransaction);


    server.route('/transactions/:id')
    .get(getTransaction)
    .delete(deleteTransaction);

    server.route('/accounts')
    .get(getAccounts)
    .post(addAccount);

    server.route('/accounts/:id')
    .get(getAccount)
    .delete(deleteAccount)
    .put(editAccount);

    server.route('/accounttypes')
    .get(getAccountTypes)
    .post(addAccountType);

    server.route('/accounts/:id')
    .get(getAccount)
    .delete(deleteAccount);

    return server;
}

// https://masteringbackend.com/posts/expressjs-5-tutorial-the-ultimate-guide/
// https://medium.com/@had096705/build-authentication-with-refresh-token-using-nodejs-and-express-2b7aea567a3a
// https://jsramblings.com/authentication-with-node-and-jwt-a-simple-example/
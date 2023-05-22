import { User, Account, AccountType, Transaction } from '../models/types';

import { MongoClient, ServerApiVersion, Collection, Db } from 'mongodb';
const uri:string = process.env.MONGODB_DEV_URI as string;



class DB {
    db: Db;
    private _client: MongoClient;

    constructor() {
        this._client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        this.connect();
        this.db = this._client.db('Dev');
    }

    async connect() {
        await this._client.connect();
    }

    async close() {
        await this._client.close();
    }
}

const db = (new DB()).db;

module.exports = {
    DB: db,
    USERS: db.collection<User>("Users"),
    ACCOUNTS: db.collection<Account>("Accounts"),
    TRANSACTIONS: db.collection<Transaction>("Transactions"),
    ACCOUNTTYPES: db.collection<AccountType>("AccountTypes"),
}
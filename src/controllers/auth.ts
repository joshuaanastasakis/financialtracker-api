const jwt = require("jsonwebtoken");

import { Request, Response, NextFunction } from 'express';

import { mail } from '../utils/mail';
import { Document } from 'mongodb';

const {
    DB, 
    USERS, 
    TRANSACTIONS, 
    ACCOUNTS, 
    ACCOUNTTYPES, 
} = require('../utils/db');

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function getRandChar() {
    const index = Math.floor((Math.random() * chars.length) % chars.length);
    return chars[index];
}

function getRandCode() {
    const hyphenCount=3;
    let currCode: string = "";
    for (let i=0; i < hyphenCount+1; i++) {
        for (let j=0; j < 4; j++) {
            currCode += getRandChar();
        }
        if (i!==hyphenCount) currCode+='-';
    }
    return currCode;
}

function emailExists(email:string) {
    return USERS.findOne({ email: email }).length > 0;
}

function setRegistrationCode(id:number, code:string):boolean {
    return USERS.updateOne({ _id:id }, {$set: {registration_code: code}}).nModified===1 ? true : false;
}

function removeRegistrationCode(id:number) {
    return USERS.updateOne({ _id:id }, {$set: {registration_code: null}}).nModified===1 ? true : false;
}

function setLoginCode(id:number, code:string) {
    return USERS.updateOne({ _id:id }, {$set: {login_code: code}}).nModified===1 ? true : false;
}

function removeLoginCode(id:number) {
    return USERS.updateOne({ _id:id }, {$set: {login_code: null}}).nModified===1 ? true : false;
}

export function register_sendCode(req:Request, res:Response) {
    /* get email and name */
    const { email, name } = req.body;

    /* confirm email and name are both provided and are populated */
    if ((!email || email.length===0) || (!name || name.length===0)) {
        return res.status(400).json({ success:false, error:"missing email or username" });
    }

    /* validate email */

    /* check if user with email already exists (email will be unique key) */
    if (emailExists(email)) {
        return res.status(400).json({ success:false, error:"user with this email already exists" })
    }

    /* generate random code */
    const registration_code = getRandCode();
    console.log(`Registration code: ${registration_code}`);

    /* Add registration_code to mongodb */
    USERS.insertOne({
        name: name,
        email: email,
        registration_code: registration_code,
        registered: false,
    })
    .then((doc:Document) => {
        console.log(doc);
    })
    .catch((err:Error) => console.error(err));

    // if (insert.nInserted!==1) {
    //     return res.status(400).json({ success:false, error:"something went wrong, please try again" })
    // }

    /* send registration confirmation pin via email */
    // mail(email, registration_code);

    return res.status(200).json({ success:true, msg:`Code was sent to ${email}` })
}

// export function register_confirmCode(req:Request, res:Response) {
//     const { email, code } = req.body;
//     if (email && code && code===registration_code) {
//         // save user info to database
        
//         // reset registration code
//         registration_code=getRandCode();
//         return res.status(200).json({ success:true, msg:"code match successful" })
//     } else {
//         return res.status(400).json({ success:false, error:"code is incorrect" })
//     }
    
// }

export function login(req:Request, res:Response) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({success: false, error: "Enter valid credentials"});
    }
    const accessToken = jwt.sign({ email: email })
}

/* 
    Email PIN Authentication
    https://medium.com/@qqudusayo/node-email-code-confirmation-d12b185dd40c
*/

/* 
    JWT
    https://medium.com/@had096705/build-authentication-with-refresh-token-using-nodejs-and-express-2b7aea567a3a
*/
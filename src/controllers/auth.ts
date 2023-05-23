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

async function setRegistrationCode(id:number, code:string) {
    return (await USERS.updateOne({ _id:id }, {$set: {registration_code: code}})).nModified===1 ? true : false;
}

async function removeRegistrationCode(id:number) {
    return (await USERS.updateOne({ _id:id }, {$set: {registration_code: null}})).nModified===1 ? true : false;
    
}
async function setLoginCode(id:number, code:string) {
    return (await USERS.updateOne({ _id:id }, {$set: {login_code: code}})).nModified===1 ? true : false;
}

async function removeLoginCode(id:number) {
    return (await USERS.updateOne({ _id:id }, {$set: {login_code: null}})).nModified===1 ? true : false;
}

export async function register_sendCode(req:Request, res:Response) {
    /* get email and name */
    const { email, name } = req.body;

    /* confirm email and name are both provided and are populated */
    if ((!email || email.length===0) || (!name || name.length===0)) {
        return res.status(400).json({ success:false, error:"missing email or username" });
    }

    /* validate email */
    
    /* generate random code */
    const registration_code = getRandCode();
    console.log(`Registration code: ${registration_code}`);

    /* check if user with email already exists (email will be unique key) */
    const emailExists = await USERS.findOne({ email: email, isRegistered: false });
    if (emailExists) {
        console.log("Found email");
        const update = await USERS.updateOne({
            email: email,
        }, {
            $set: {registration_code: registration_code}
        });
    } else {
        /* Add registration_code to mongodb */
        USERS.insertOne({
            name: name,
            email: email,
            registration_code: registration_code,
            isRegistered: false,
        })
        .then((doc:Document) => {
            console.log(doc);
        })
        .catch((err:Error) => console.error(err));
    }

    


    /* send registration confirmation pin via email */
    // mail(email, registration_code);

    return res.status(200).json({ success:true, msg:`Code was sent to ${email}` })
}

export async function register_confirmCode(req:Request, res:Response) {
    const { email, code } = req.body;
    console.log(`Received email ${email} and code ${code}`)

    if (!email || !code) {
        return res.status(400).json({ success:false, error:"missing email and/or code" })
    }

    /* check if user exists and check code */
    const userExists = await USERS.findOne({ 
        email: email,
        registration_code: code, 
        isRegistered: false,
    });
    if (!userExists) {
        console.log("Found email");
        return res.status(400).json({ success:false, error:"code is incorrect" });
    }

    const update = await USERS.updateOne({
        email: email,
        registration_code: code,
        isRegistered: false,
    }, {
        $set: {registration_code: null, isRegistered: true}
    });

    console.log(update);

    // if (update.nModified === 0) {
    //     return res.status(200).json({ success:true, msg:"code match successful" })
    // } else {
    //     return res.status(400).json({ success:false, error:"something went wrong" })
    // }

    return res.status(200).json({ success:true, msg:"code match successful" })
    
}

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
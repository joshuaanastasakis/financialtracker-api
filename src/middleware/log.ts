import express from 'express';

export function log(req: express.Request, res: express.Response, next: express.NextFunction) {
    const date = (new Date(Date.now())).toLocaleDateString('en-CA', {
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric'
    });
    console.log(`${date}: ${req.path}`);
    next();
}
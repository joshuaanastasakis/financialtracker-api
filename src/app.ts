require('dotenv').config();
import { createServer } from './utils/server';
const port = 3000;

createServer()
.then(server => {
    server.listen(port, () => {
        console.info('Listening on http://localhost:3000');
    })
})
.catch(err => {
    console.error(`Error: ${err}`);
})
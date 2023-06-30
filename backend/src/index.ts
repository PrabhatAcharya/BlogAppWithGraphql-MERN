import express from 'express';
import { config } from 'dotenv';
import { Connection } from './database/connection';

config();
const app = express();
Connection().then(()=>{
app.listen(process.env.PORT,()=>{
    console.log('Mongodb Server Connected and listening to port '+process.env.PORT);
})
}).catch(error => console.log(error));

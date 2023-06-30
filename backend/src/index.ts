import express from 'express';
import { config } from 'dotenv';
import { Connection } from './database/connection';
import { graphqlHTTP } from 'express-graphql';

config();
const app = express();
app.use('/graphql',graphqlHTTP({schema:null, graphiql:true}))

Connection().then(()=>{

    app.listen(process.env.PORT,()=>{
    console.log('Mongodb Server Connected and listening to port '+process.env.PORT);
})
}).catch(error => console.log(error));

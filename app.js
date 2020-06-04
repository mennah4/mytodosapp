const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require("express-graphql");
const mongoose = require('mongoose');

const isAuth = require('./middleware/is-auth')
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index')
const app = express();

//const todos = []
app.use(bodyParser.json());

//middle ware for CORS setting the headers for every request sent to the server 
app.use((req, res, next) =>{
    //add headers to every requst, to allow CORS 
    res.setHeader('Access-Control-Allow-Origin', '*');//every host can send request to server 
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');//control the kindof requests to be sent, options: automatically sent by the browsers before post req
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');//controls which kind of header s we can set to the requests before sending them
    if (req.method === "OPTIONS"){
        return res.sendStatus(200);//to stop the dafault operation 
    }
    next();
});

//general app.use to check if the incoming requests r going tp be allowed by the middleware function
//if we pass it to th end oint all api will be restricted and checked with it, since we have one endpoint for the whole api
app.use(isAuth);

// app.get('/', (req, res, next) => {
//     res.send('hello world');
// })

//request body that has the gql data in it to send a post request
app.use('/graphql',
    graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true

    }));//where to find the schema or the resolvers whhic defines the endpoint, to wich the quesry will be excuted
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-z0nsq.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
, {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
    app.listen(8000);
}).catch(err =>{
    console.log(err);
});

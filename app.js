const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require("express-graphql");
const mongoose = require('mongoose');


const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index')
const app = express();

//const todos = []
app.use(bodyParser.json());



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
    app.listen(3000);
}).catch(err =>{
    console.log(err);
});

const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require('mongoose');
const Todo = require('./models/todo');

const app = express();

//const todos = []
app.use(bodyParser.json());

// app.get('/', (req, res, next) => {
//     res.send('hello world');
// })

//request body that has the gql data in it to send a post request
app.use('/graphql',
    graphqlHTTP({
        schema: buildSchema(`
        type Todo {
            _id: ID!
            title: String!
            description: String
            author: String!
            status: String!
            creationDate: String!
            dueDate: String!
        }

        input TodoInput{
            title: String!
            description: String
            author: String!
            status: String!
            creationDate: String!
            dueDate: String!
        }

        type RootQuery{
            todos: [Todo !]!
        }

        type RootMutation{
            createTodo(todoInput: TodoInput): Todo
        }

        schema{
            query:RootQuery
            mutation:RootMutation
        }
    `),
        rootValue: {//resolver functions need to have the same name as the schema
            todos: () => {
                return Todo.find().then(todos=>{
                    return todos.map(todo =>{
                        return {...todo._doc, _id: todo._doc._id.toString()} //translate id to string
                    });

                }).catch(err =>{
                    throw err;
                })
                //return todos
            },

            createTodo: (args) => {

                const todo = new Todo({
                    title: args.todoInput.title,
                    description: args.todoInput.description,
                    author: args.todoInput.author,
                    status: args.todoInput.status,
                    creationDate: new Date(args.todoInput.creationDate),
                    dueDate: new Date(args.todoInput.dueDate),

                })
                //todos.push(todo);

                return todo.save().then(result =>{
                    console.log(result);
                    //return result
                    return {...result._doc,  _id: todo.id}
                }).catch(err =>{
                    console.log(err);
                    throw err;
                })

                //return todo;
            }
        }, //js object which has all the resolver functions which need to match schema by name
        graphiql: true

    }));//where to find the schema or the resolvers whhic defines the endpoint, to wich the quesry will be excuted
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-z0nsq.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
, {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
    app.listen(3000);
}).catch(err =>{
    console.log(err);
});

const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql")

const app = express();

const todos = []
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
            dueDate: String
        }

        input TodoInput{
            title: String!
            description: String
            author: String!
            status: String!
            creationDate: String!
            dueDate: String
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
                return todos
            },

            createTodo: (args) => {
                const todo = {
                    _id: Math.random().toString(),
                    title: args.todoInput.title,
                    description: args.todoInput.description,
                    author: args.todoInput.author,
                    status: args.todoInput.status,
                    creationDate: args.todoInput.creationDate,
                    dueDate: args.todoInput.dueDate,

                };
                //console.log(todo)
                todos.push(todo);

                return todo;
            }
        }, //js object which has all the resolver functions which need to match schema by name
        graphiql: true

    }));//where to find the schema or the resolvers whhic defines the endpoint, to wich the quesry will be excuted

app.listen(3000);
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require('mongoose');
const Todo = require('./models/todo');
const User = require('./models/user'); 
const bcrypt = require('bcryptjs')

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

        type User{
            _id: ID!
            email: String!
            password:String
        }

        input TodoInput{
            title: String!
            description: String
            author: String!
            status: String!
            creationDate: String!
            dueDate: String!
        }

        input UserInput{
            email: String!
            password: String! 
        }

        type RootQuery{
            todos: [Todo !]!
        }

        type RootMutation{
            createTodo(todoInput: TodoInput): Todo
            createUser(userInput: UserInput): User
        }

        schema{
            query:RootQuery
            mutation:RootMutation
        }
    `),
        //password in the type is not requied cuz we shouldn't allow fething the password,
        //not nullable in the input cuz it should be a requirement for logging in
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
                    creator: '5ed0416803a5bd182e095f73'//store the object is of the todo creator

                })
                //todos.push(todo);
                let createdTodo;
                return todo
                .save()
                .then(result =>{
                    createdTodo = {...result._doc,  _id: todo.id}
                    return User.findById('5ed0416803a5bd182e095f73') // the is of the user related to this event
                    //console.log(result);
                    
                }).then(user => { //have the user for that id, if the user with the id does not exist throw an error
                    if(!user){
                        throw new Error('user not found')
                    }
                    user.createdTodos.push(todo);//add a todo to the user's created todos 
                    return user.save(); // save the user 
                }).
                then(result => {
                    //return result
                    return createdTodo;
                })
                .catch(err =>{
                    console.log(err);
                    throw err;
                })

                //return todo;
            },

            createUser: (args) =>{//async operation
                //chain of promises, where the resolver will return the hashed pasword, only then will the user be created, 
                //then it will be saved to the database
                return User.findOne({email: args.userInput.email})//ensures email is uniqu)
                .then(user =>{//if truish and ther is there
                    if(user){
                        throw new Error("User existis already")
                    }
                    //else return the hashed 
                    return bcrypt.hash(args.userInput.password, 12) 
                })
                
                .then(hashedPassword =>{
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });//the user module we imported
                    return user.save();//saving the user to the database
                })
                .then(result =>{//the resolved user
                    return{...result._doc, password:null, _id: result.id} //to not retrieve the password
                })
                .catch(err =>{
                    console.log(err)
                })
                
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

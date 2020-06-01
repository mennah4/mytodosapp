const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Todo {
    _id: ID!
    title: String!
    description: String
    author: String!
    status: String!
    creationDate: String!
    dueDate: String!
    creator: User!
}

type User{
    _id: ID!
    email: String!
    password:String
    createdTodos: [Todo!]
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

type AuthData{
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

type RootQuery{
    todos: [Todo !]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation{
    createTodo(todoInput: TodoInput): Todo
    createUser(userInput: UserInput): User
}

schema{
    query:RootQuery
    mutation:RootMutation
}
`);

//password in the type is not requied cuz we shouldn't allow fething the password,
//not nullable in the input cuz it should be a requirement for logging in
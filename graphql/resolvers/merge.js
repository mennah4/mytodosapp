const Todo = require('../../models/todo');
const User = require('../../models/user');
const {dateToString} = require('../../helpers/date')

//Refactoring: to return the event object instead of repeating it 
const transformTodo = (todo) =>{
    return{
        ...todo._doc, 
            _id: todo.id, 
            creationDate: new Date (todo._doc.creationDate).toISOString(),
            dueDate: dateToString(todo._doc.dueDate),
            creator:user.bind(this,todo.creator)//translate id to string
            //user is the user function, bind to make sure the function recieves the correct argument
    }
}


//function to fine by id the creator user of each event 
const user = (userId) =>{
    return User.findById(userId)//User module
    .then(user =>{
        return{
            ...user._doc, 
            _id: user.id, 
            createdTodos: todos.bind(this,user._doc.createdTodos)};
        //createdTodos will point at a function then bind to pass the todo id as an argument 
    })
    .catch(err =>{
        throw err
    })
}

//function to populate all the todos created by a user
const todos = todoIds => {
    //find a todo where is id of the event is with the array of todo ids
    return Todo.find({_id: {$in: todoIds}})
    .then( todos =>{
        return todos.map(todo =>{//transform eact todo into an object
            //override the creator fied to point at user from user function then pass the creator feild
            //setting up that creator function doesn't hold a value but will call  function when trying to access it 
            //can be done by hoisting
            return transformTodo(todo);
        });
    })
    .catch(err =>{
        throw err
    })

}

exports.todos = todos;
exports.user = user;

exports.transformTodo = transformTodo;

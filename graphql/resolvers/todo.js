const Todo = require('../../models/todo');
const User = require('../../models/user');
const {dateToString} = require('../../helpers/date');
const { user } = require('./merge');
const {transformTodo} = require('./merge')


module.exports ={//resolver functions need to have the same name as the schema
    todos: () => {
        return Todo.find()
        //make sure each todo has it's user information fo that we need to fethch the whole object not just the id
        //populate any todo that has any relation ex the ref key
        //.populate('creator')
        .then(todos =>{
            return todos.map(todo =>{
                return transformTodo(todo);
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
            createdTodo = transformTodo(result);
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
} //js object which has all the resolver functions which need to match schema by name
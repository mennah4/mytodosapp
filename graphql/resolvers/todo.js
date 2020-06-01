const Todo = require('../../models/todo');
const User = require('../../models/user');
const { transformTodo } = require('./merge')


module.exports = {//resolver functions need to have the same name as the schema
    todos: async () => {
        try {
            const todos = await Todo.find();
            //make sure each todo has it's user information fo that we need to fethch the whole object not just the id
            //populate any todo that has any relation ex the ref key
            //.populate('creator')

            return todos.map(todo => {
                return transformTodo(todo);
                //return todos
            });
        }



        catch (err) {
            throw err;
        }

    },

    createTodo: async (args, req) => {

        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        const todo = new Todo({
            title: args.todoInput.title,
            description: args.todoInput.description,
            author: args.todoInput.author,
            status: args.todoInput.status,
            creationDate: new Date(args.todoInput.creationDate),
            dueDate: new Date(args.todoInput.dueDate),
            //creator: '5ed0416803a5bd182e095f73'//store the object is of the todo creator
            //can now get the user id from the middleware
            creator: req.userId
        })
        //todos.push(todo);
        let createdTodo;
        try {
            const result = await todo.save()
            createdTodo = transformTodo(result);
            const creator = await User.findById(req.userId); // the is of the user related to this event
            //console.log(result);

            //have the user for that id, if the user with the id does not exist throw an error



            if (!creator) {
                throw new Error('user not found')
            }
            creator.createdTodos.push(todo);//add a todo to the user's created todos 
            await creator.save(); // save the user 


            return createdTodo;

        } catch (err) {
            console.log(err);
            throw err;
        }

        //return todo;
    },
} //js object which has all the resolver functions which need to match schema by name
const Todo = require('../../models/todo');
const User = require('../../models/user'); 
const bcrypt = require('bcryptjs')

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
            return {
                ...todo._doc, 
                _id: todo.id, 
                creationDate: new Date(todo._doc.creationDate).toISOString(),
                dueDate: new Date(todo._doc.dueDate).toISOString(),
                creator:user.bind(this,todo.creator)}
        })
    })
    .catch(err =>{
        throw err
    })

}

module.exports ={//resolver functions need to have the same name as the schema
    todos: () => {
        return Todo.find()
        //make sure each todo has it's user information fo that we need to fethch the whole object not just the id
        //populate any todo that has any relation ex the ref key
        //.populate('creator')
        .then(todos =>{
            return todos.map(todo =>{
                return {
                    ...todo._doc, 
                    _id: todo._doc._id.toString(),
                    creationDate: new Date(todo._doc.creationDate).toISOString(),
                    dueDate: new Date(todo._doc.dueDate).toISOString(),
                    creator:user.bind(this,todo._doc.creator)} //translate id to string
                    //user is the user function, bind to make sure the function recieves the correct argument
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
            createdTodo = {...result._doc,  
                _id: todo.id, 
                creationDate: new Date(todo._doc.creationDate).toISOString(),
                dueDate: new Date(todo._doc.dueDate).toISOString(),
                creator: user.bind(this, result._doc.creator)}
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
} //js object which has all the resolver functions which need to match schema by name
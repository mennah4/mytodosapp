const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    createdTodos: [
        {
            type: Schema.Types.ObjectId,//list of ids for created todos by the user
            ref:'Todo'//set up a relation and tell mongoos data is related, needed when fetching 
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
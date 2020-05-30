const User = require('../../models/user'); 
const bcrypt = require('bcryptjs');

module.exports ={//resolver functions need to have the same name as the schema
    

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
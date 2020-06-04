const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

module.exports = {//resolver functions need to have the same name as the schema


    createUser: async (args) => {//async operation
        //chain of promises, where the resolver will return the hashed pasword, only then will the user be created, 
        //then it will be saved to the database
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })//ensures email is uniqu)
            if (existingUser) {
                throw new Error("User existis already")
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });//the user module we imported
            const result = await user.save();//saving the user to the database

            //the resolved user
            return {
                ...result._doc,
                password: null,
                _id: result.id
            } //to not retrieve the password

        } catch (err) {
            throw err;
        }

    },

    login: async ({ email, password }) => {
        //1-validate the email and the password combination is correct
        const user = await User.findOne({ email: email });//fine one user to the email we r getting as an argument
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        //2-generate the token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'somesupersecretkey',
            {
                expiresIn: '1h'
            }
        );
        //3-return the token to the user
        return { userId: user.id, token: token, tokenExpiration: 1 };

    }
} //js object which has all the resolver functions which need to match schema by name
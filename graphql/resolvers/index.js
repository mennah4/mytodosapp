const authResolver = require('./auth');
const todoResolver = require('./todo')

const rootResolver = {//resolver functions need to have the same name as the schema
    
    ...authResolver,
    ...todoResolver


}; //js object which has all the resolver functions which need to match schema by name

module.exports = rootResolver;
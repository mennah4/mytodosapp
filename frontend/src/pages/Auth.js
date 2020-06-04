import React, { Component } from 'react';
import "./Auth.css"

class AuthPage extends Component {
    state = {
        isLogin: true
    } 

    constructor(props){
        super(props);
        this.emailEl = React.createRef();//using references instead of 2 ways binding
        this.passwordEl = React.createRef();//2 different propertied stored in 2 differrent references
    }

    switchModeHandler = () => {
        //rework the state depending on the perv state object
        this.setState(prevState =>{
            return {isLogin: !prevState.isLogin}
        })
    }
    submitHandler = (event) =>{//tart reading the values 
        //To make sure no request get sent
        event.preventDefault();//when he form is submitted, the from will send a request to the url it is running on, to prevent that from happening
        const email = this.emailEl.current.value;//cuurent prop will now be refering to the actual element
        const password = this.passwordEl.current.value;
        //validation
        if(email.trim().length === 0 || password.trim().length === 0){//if empty email or password
            return;
        }

        //request body for login
        let requestBody = {
            query: `
            query{
                login(email : "${email}", password: "${password}"){
                    userId
                    token
                    tokenExpiration
                }
            }`
        };

        //if it is not login override the requestBody to send the signup request
        if(!this.state.isLogin){
            //The rquest body for signup
            requestBody ={
                query:`
                mutation{
                    createUser(userInput: {email: "${email}", password: "${password}"}){
                        _id
                        email
                    }
                }`
            }
        //send a request to the backend if the check passes
        console.log(email, password);
        }
        
        fetch('http://localhost:8000/graphql', {
            //passing a js object to configure the request
            method: "POST", //always post with graphql
            body: JSON.stringify(requestBody),
            headers: {//in which format r we sening the reques, let the backend know we r sending json data
                'Content-Type': 'application/json',//makes sure it parses the request as json input
            }
        }).then(res =>{
            if(res.status !== 200 && res.status !== 201){
                throw new Error("failed ")
            }
            return res.json();//extract and parse the response body
        }).then(resData =>{
            console.log(resData)
        })
        .catch(err =>{
            console.log(err);
        });
    }
    render (){
        return(
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" ref={this.emailEl}/>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl}/>
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
        <button type="button" onClick = {this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
                </div>
            </form>
        );
        
    }
}
export default AuthPage;
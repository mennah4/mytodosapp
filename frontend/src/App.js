
import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import TodosPage from './pages/Todos';
import Navigaion from './components/Navigation/Navigation'

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <React.Fragment>
      <Navigaion/>
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/todos" component={TodosPage} />
          </Switch>
        </main>
      </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
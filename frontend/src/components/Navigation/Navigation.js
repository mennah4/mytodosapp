import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css'

const mainNavigation = props =>(
    <header className="main-navigation">
        <div className="main-navigation__logo">
        <h1>My todos</h1>
        </div>
        <nav className="main-navigation__items">
            <ul>
                <li><NavLink to="/auth">Autherntication</NavLink></li>
                <li><NavLink to="/todos">Todos</NavLink></li>
            </ul>
        </nav>
        
    </header>
    
)
export default mainNavigation;
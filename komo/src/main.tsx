import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {About} from "./views/About";


const Main = () => {
    return (<React.StrictMode>
            <Router>
                <App/>
                <Switch>
                    <Route path="/about" component={About}/>
                    <Route path="/contact" component={About}/>
                    <Route path="/contact/new" component={About}/>
                    <Route path="/contact" component={About}/>
                </Switch>
            </Router>
        </React.StrictMode>)
}
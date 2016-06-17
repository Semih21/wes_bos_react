var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers');

/*
  import componenents
*/

import App from './components/App';
import Header from './components/Header';
import Inventory from './components/Inventory';
import AddFishForm from './components/AddFishForm';
import Order from './components/Order';
import Fish from './components/Fish';
import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';


/*
  Routes
*/
var routes = (
  <Router history ={createBrowserHistory()}>
    <Route path='/' component={StorePicker}/>
    <Route path='/store/:storeId' component={App}/>
    <Route path='*' component={NotFound}/>
  </Router>
)

ReactDOM.render(routes, document.getElementById('main'));

var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers');

/*
  import componenents
*/

import Header from './components/Header';
import Inventory from './components/Inventory';
import AddFishForm from './components/AddFishForm';
import Order from './components/Order';
import Fish from './components/Fish';
import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';

//firebase

var Rebase = require('re-base');
var base = Rebase.createClass('https://crackling-heat.firebaseio.com/');
var Catalyst = require('react-catalyst');

/*
  App
  <App />
*/
var App = React.createClass({
  mixins: [Catalyst.LinkedStateMixin],
  getInitialState: function(){
    return {
      fishes: {},
      order: {}
    }
  },

  componentDidMount: function(){
    base.syncState(this.props.params.storeId + '/fishes', {
      context:this,
      state: 'fishes'
    });

    var localStorageRef = localStorage.getItem('order-'+ this.props.params.storeId);

    if(localStorageRef){
      //update componenent state to reflect what is in localStorage
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  },

  componentWillUpdate: function(nextProps, nextState){
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  },

  addToOrder: function(key){
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({order: this.state.order})
  },

  removeFromOrder(key){
   delete this.state.order[key];
   this.setState({
     order : this.state.order
   });
 },

  addFish: function(fish){
    var timestamp = (new Date()).getTime();
    // update the state object
    this.state.fishes['fish-' + timestamp] = fish;
    // set the state
    this.setState({fishes: this.state.fishes});
  },

  removeFish: function(key){
    if(confirm('Are you sure you want to remove this fish?')){
      this.state.fishes[key] = null;
      this.setState({
        fishes: this.state.fishes
      });
    }
  },

  loadSamples: function(){
    this.setState({
      fishes: require('./sample-fishes')
    });
  },

  renderFish: function(key){
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>
  },

  render: function(){
    return(
      <div className='catch-of-the-day'>
        <div className='menu'>
          <Header tagline='Fresh Seafood Market'/>
          <ul className='list-of-fishes'>
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
          <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
          <Inventory addFish={this.addFish} removeFish={this.removeFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState}/>
      </div>
    )
  }
});


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

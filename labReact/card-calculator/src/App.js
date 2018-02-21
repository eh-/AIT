import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var suitVals = {
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
	'6': 6,
	'7': 7,
	'8': 8,
	'9': 9,
	'10': 10,
	'J': 10,
	'Q': 10,
	'K': 10,
	'A': 11,
}

class Message extends Component{
	render(){
		return (<div>{this.props.value}</div>);
	}
}

class App extends Component {
	constructor(){
		super();
		this.state = {
			total: 0
		}
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(evt){
		let suits = evt.target.value.split(',');
		let newtotal = 0;
		for(let i = 0; i < suits.length; i++){
			if(suitVals.hasOwnProperty(suits[i]))
				newtotal += suitVals[suits[i]];
		}
		this.setState({
			total: newtotal,
		});
	}
	
  render() {
    return (
      <div className="App">
        <input onChange={this.handleChange} type='text'/>
				= {this.state.total}
      </div>
    );
  }
}

export default App;

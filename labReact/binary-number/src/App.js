import React, { Component } from 'react';
import './App.css';

var numBits = 8;

class Bit extends Component{
	render(){
		return(<div className='bits' onClick={this.props.onClick}>{this.props.val}</div>);
	}
	
}

class App extends Component {
	constructor(){
		super();
		var bitVals = [];
		for(let i = 0; i < numBits; i++){
			bitVals.push(0);
		}
		this.state = {
			bitVals: bitVals,
			total: 0
		}
	}
	
  render() {
		var divs = [];
		for(let i = numBits - 1; i >= 0; i--){
			divs.push(<Bit onClick={() => {this.handleClick(i)}} bitPosi={i} val={this.state.bitVals[i]} />);
		}
    return (
      <div className="App">
			{divs}
			<div className='bits'>=</div>
			<div className='bits'>{this.state.total}</div>
      </div>
    );
  }
	
	handleClick(position){
		var currBitVals = this.state.bitVals;
		var currTotal = this.state.total;
		if(this.state.bitVals[position] === 0){
			currBitVals[position] = 1;
			currTotal += Math.pow(2, position);
		}
		else if(this.state.bitVals[position] === 1){
			currBitVals[position] = 0;
			currTotal -= Math.pow(2, position);
		}
		this.setState({
			bitVals: currBitVals,
			total: currTotal,
		});
	}
}

export default App;

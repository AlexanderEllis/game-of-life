import React, { Component } from 'react';
import './App.css';

class Tile extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.props.handleClick(this.props.index);
  }
  render() {
    let type = this.props.type === 1 ? 'alive' : 'dead';
    return(
      <div className={type + ' tile'} onClick={this.handleClick}></div>
    );
  }
}

class Board extends Component {
  constructor(props) {
    super(props);
    this.printState = this.printState.bind(this);
  }
  printState() {
    let currentBoard = this.props.board;
    
    let displaying = [];
    for (let i = 0; i < currentBoard.length; i++) {
      displaying.push(<Tile type={currentBoard[i]} index={i} handleClick={this.props.handleClick} key={i}/>);
    }
    return displaying; 
  }
  render() {
    let size = this.props.size;
    let dimensions = size * 14;
    let display = this.printState();
    return (
      <div>
        <p>Generation {this.props.generation}</p>
        <div id="container" style={{'width': dimensions, 'height': dimensions}}>{display}</div>
      </div>
    )
  }
}

class App extends Component {k
  constructor(props) {
    super(props);
    const size = 50;
    let firstBoard = this.resetBoard(size);
    let firstState = {
      board: firstBoard,
      size: size,
      generations: 0,
      running: false
    }
    this.state = firstState;
    
    this.resetBoard = this.resetBoard.bind(this);
    this.neighbors = this.neighbors.bind(this);
    this.createNextBoard = this.createNextBoard.bind(this);
    this.toggleGame = this.toggleGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.clearBoard = this.clearBoard.bind(this);

    this.startGame();
  }

  clearBoard() {
    let blankBoard = new Array(this.state.size * this.state.size).fill(0);
    this.setState({
      board: blankBoard,
      size:this.state.size,
      generations: 0,
      running: false
    });
  }
  
  handleClick(index) {
    console.log('hey');
    let currentBoard = this.state.board;
    currentBoard[index] = currentBoard[index] === 1 ? 0 : 1;
    this.setState({
      board: currentBoard,
      size: this.state.size,
      generations: this.state.generations,
      running: this.state.running
    })
  }

  resetBoard(size) {  // Since this resets the state, I'm also going to call it to create the first state.
    let newBoard = [];
    let length = size * size;
    for (let i = 0; i < length; i++) {
      newBoard[i] = Math.floor(Math.random() * 2);
    }
    return newBoard;
  }

  neighbors (index) {
    let currentBoard = this.state.board;
    let sum = 0;
    const width = this.state.size;
    if (index >= width) { // There are spots above
      if (index % width > 0) { // There could be a top left
        sum += currentBoard[index - width - 1];
      }
      if (index % width < width - 1) { // There could be a top right
        sum += currentBoard[index - width + 1];
      }
      sum += currentBoard[index - width];
    }
    if (index <= currentBoard.length - width - 1) {
      if (index % width > 0) {
        sum += currentBoard[index + width - 1];
      }
      if (index % width < width - 1) {
        sum += currentBoard[index + width + 1];
      }
      sum += currentBoard[index + width]
    }
    if (index % width > 0) {
      sum += currentBoard[index - 1];
    }
    if (index % width < width - 1) {
      sum += currentBoard[index + 1];
    }
    return sum;
  }
  
  createNextBoard() {
    const currentBoard = this.state.board;
    var newBoard = [];
    for (let i = 0; i < currentBoard.length; i++) {
      let localNeighbors = this.neighbors(i);
      let alive = 0;
      if (currentBoard[i] === 1 && (localNeighbors === 2 || localNeighbors === 3)) {
        alive = 1;
      }
      else if (currentBoard[i] === 0 && localNeighbors === 3) {
        alive = 1;
      }
      newBoard[i] = alive;
    }
    return newBoard;
  } 

  startGame() {
    setInterval(() => {
      if (this.state.running) {
        let newBoard = this.createNextBoard();
        this.setState({
          board: newBoard,
          size: this.state.size,
          generations: this.state.generations + 1,
          running: this.state.running
        }); 
      }
    }, 200);
  }

  toggleGame() {
    this.setState({
      board: this.state.board,
      size: this.state.size,
      generations: this.state.generations,
      running: !this.state.running
    })
  }

  resetGame() {
    let freshBoard = this.resetBoard(this.state.size);
    this.setState({
      board: freshBoard,
      size: this.state.size,
      generations: 0,
      running: false
    })
  }
  
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Conway's Game of Life</h2>
        </div>
        <div className="App-intro">
          <button value="start" onClick={this.toggleGame}>Start/Stop</button>
          <button onClick={this.clearBoard}>Clear</button>
          <button onClick={this.resetGame}>Reset</button>
          <Board size={this.state.size}
                 board={this.state.board}
                 generation={this.state.generations}
                 handleClick={this.handleClick}/>
        </div>
      </div>
    );
  }
}

export default App;

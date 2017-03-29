import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Tile extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    
  }
}

class Board extends Component {
  constructor(props) {
    super(props);
  }
  printState() {
    let size = this.props.size;
    let currentBoard = this.props.board;
    
    let displaying = [];
    let result = '';
    for (let i = 0; i < currentBoard.length; i++) {
      let placeholder = currentBoard[i] === 0 ? '_' : '0';
      result += ' ' + placeholder + ' ';
      if (i > 0 && i % size === size - 1) {
        result += ''
        displaying.push(<p>{result}</p>);
        result = '';
      }
    }
    return displaying; 
  }
  render() {
    let size = this.props.size;
    let display = this.printState();
    return (
      <div>
        <p>We see that there will be a board of {size}</p>
        <p>here's the board:</p>
        <p>{display}</p>
      </div>
    )
  }
}

class App extends Component {k
  constructor(props) {
    super(props);
    const size = 25;
    let firstBoard = this.resetBoard(size);
    let firstState = {
      board: firstBoard,
      size: size,
      generations: 1,
      running: false
    }
    this.state = firstState;
    
    this.resetBoard = this.resetBoard.bind(this);
    this.neighbors = this.neighbors.bind(this);
    this.createNextBoard = this.createNextBoard.bind(this);
    this.toggleGame = this.toggleGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.resetGame = this.resetGame.bind(this);

    this.startGame();
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
    const width = this.state.size;
    const currentBoard = this.state.board;
    var newBoard = [];
    for (let i = 0; i < currentBoard.length; i++) {
      let localNeighbors = this.neighbors(i);
      let alive = 0;
      if (currentBoard[i] == 1 && (localNeighbors == 2 || localNeighbors == 3)) {
        alive = 1;
      }
      else if (currentBoard[i] === 0 && localNeighbors == 3) {
        alive = 1;
      }
      newBoard[i] = alive;
    }
    return newBoard;
  } 

  startGame() {
    var interval = setInterval(() => {
      if (this.state.running) {
        let currentBoard = this.state.board;
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
          <button onClick={this.resetGame}>Reset</button>
          <Board size={this.state.size} board={this.state.board} />
        </div>
      </div>
    );
  }
}

export default App;

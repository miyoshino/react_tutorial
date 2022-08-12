import React, {useState, useEffect} from 'react';
import './App.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


function Board(props){

  function renderSquare(value){
    return(
      <Square value={props.squares[value]} onClick={()=>props.onClick(value)}/>
    );
  };

  return(
    <div class = "inner">
      <div>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game(){
  const [history, setHistory] = useState([{squares: Array(9).fill(null)}]);
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState("");
  const [stepNumber, setStepNumber] = useState(0);
  const [vector,setVector ] = useState(Array(10).fill(null));

  function jumpTo(step){
    setStepNumber(step);
    setXIsNext((step%2) === 0);
  }
  const moves = history.map((step, move) => {
    const xv = ((vector[move-1] % 3 | 0) +1);
    const yv = ((vector[move-1] / 3 | 0) +1);
    const desc = move ? 'Go to move #' + move +  ' ：'+ ((move % 2 )? 'X' : 'O' )+ '( ' + xv+ ', ' + yv + ')':'Go to game start'; 
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  function handleClick(value){
    const hist = history.slice(0, stepNumber + 1);
    const current = hist[hist.length - 1];

    if (calculateWinner(current.squares) || current.squares[value]) {
      return;
    }
    const newSquares = current.squares.slice();
    newSquares[value] = xIsNext? 'X' : 'O';
    setXIsNext(!xIsNext);
    setStepNumber(hist.length);
    setHistory(hist.concat([{squares: newSquares}]));
  };

  useEffect(()=>{
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);
    if(winner === 2){
      setStatus('Tie game');
    }else if(winner){
      setStatus("Winner : " + winner);
    }else{
      setStatus('Next player: ' + (xIsNext ? 'X' : 'O'));
    }
  });
  const vector_copy = vector.slice();
  
  return(
    <div className="game">
    <div className="game-board">
      <Board squares={history[stepNumber].squares} onClick={(i)=>{handleClick(i);
        vector_copy[stepNumber] = i;
        setVector(vector_copy);}}/>
    </div>
    <div className="game-info">
      <div>{ status }</div>
      <ol>{moves}</ol>
    </div>
  </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if((squares[0] != null)&&(squares[1] != null)&&
  (squares[2] != null)&&(squares[3] != null)&&(squares[4] != null)&&
  (squares[5] != null)&&(squares[6] != null)&&(squares[7] != null)&&
  (squares[8] != null)){
    return 2;
  }
  return null;
}

export default Game;
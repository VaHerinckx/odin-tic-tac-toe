let player1Name;
let player2Name;
let board = [];
const form = document.getElementById("player-names");
const textDisplay = document.querySelector(".result-display")
let player;
let roundHit = 0;
let hitCount = 1;
let player1;
let player2;

//Create a new game and save the new player names when button is clicked
form.addEventListener("submit", function (event) {
  event.preventDefault();
  document.addEventListener("click", clickHandler);
  hitCount = 1;

  const player1Input = document.querySelector("#player1").value;
  const player2Input = document.querySelector("#player2").value;
  player1Name = player1Input === "" ? "Player 1" : player1Input;
  player2Name = player2Input === "" ? "Player 2" : player2Input;
  gameInstance()
});

const clickHandler = function (event) {
  if (event.target.classList.contains("grid-cell")) {
    changeCell(event.target);
    playRound();}
}


//Change the value of a cell if clicked + checks if the grid has a winner
document.addEventListener("click", clickHandler);

//Function containing the initialization of the code
function gameInstance() {
  board = createGameboard();
  displayBoard();
  player1 = createPlayer(player1Name, "X");
  player2 = createPlayer(player2Name, "O");
  textDisplay.textContent = `It's ${player1.name}'s turn to play`
  player = player1;
}

//Create the array of objects that will constitute the gameboard
function createGameboard() {
  const newBoard = [];
  for (let i = 0; i < 3; i++) {
    newBoard[i] = [];
    for (let j = 0; j < 3; j++) {
      newBoard[i].push(Cell())
    }
  }
  return newBoard
}

//Create the instance of a new player + assign them their mark (X or O)
function createPlayer (name, marker) {
  return { name, marker };
}

//Generate a cell object for the gameboard
function Cell() {
  let value = "";
  const changeValue = (marker) => {
    value = marker;
  };
  const getValue = () => value;
  return {
    changeValue,
    getValue
  };
}
//Display the generated gameboard on the webpage
function displayBoard () {
  let grid = document.querySelector(".grid")
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let gridCell = document.createElement("div")
      gridCell.classList.add("grid-cell")
      gridCell.setAttribute("data-columns", j)
      gridCell.setAttribute("data-rows", i)
      gridCell.textContent = board[i][j].getValue()
      grid.appendChild(gridCell);
    }
  }
}

// Play a round and stop game if there's a winner or if it's a tie!
function playRound() {
  if (!checkGrid()) {
    if (hitCount == 10) {
      textDisplay.textContent = "It's a tie!";
      document.removeEventListener("click", clickHandler);
    }
    player = (hitCount % 2 === 0 ? player2 : player1);
    textDisplay.textContent = `It's ${player.name}'s turn to play`
    roundHit = 0;
  }
  else {
    textDisplay.textContent = `${player.name} is the winner!`;
    document.removeEventListener("click", clickHandler);
  }
}

//Check if the grid is in a state to declare a winner!
function checkGrid() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i + j < 2 || (i == 1 && j==1)) { //Exclude checking on all the cells that are not at the end of a series
        continue;
      }
      if (board[i][j].getValue() === "") {//Exclude checking the empty cells as we don't want 3 empty cells in a row to trigger the end of the game
        continue;
      }
      if(j==2) { //Check if a player manager to put 3 in the same row
        if (board[i][j].getValue() === board[i][j-1].getValue() && board[i][j].getValue() === board[i][j-2].getValue()) {
          return player
        }
      }
      if (i==2) { //Check if a player manager to put 3 in the same column
        if (board[i][j].getValue() === board[i-1][j].getValue() && board[i][j].getValue() === board[i-2][j].getValue()) {
          return player
        }
      }
      if (i==2 && j==0) { //Check if a player manager to put 3 in right diagonal
        if (board[i][j].getValue() === board[i-1][j+1].getValue() && board[i][j].getValue() === board[i-2][j+2].getValue()) {
          return player
        }
      }
      if (i==2 && j==2) { //Check if a player manager to put 3 in left diagonal
        if (board[i][j].getValue() === board[i-1][j-1].getValue() && board[i][j].getValue() === board[i-2][j-2].getValue()) {
          return player
        }
      }
    }
  }
  return false;
}
//Change the content of the cell when clicked + the object within the array
function changeCell(cell) {
  if (cell.textContent === "") {
    cell.textContent = player.marker;
    board[cell.getAttribute("data-rows")][cell.getAttribute("data-columns")].changeValue(player.marker);
    roundHit +=1;
    hitCount +=1;
  }
}

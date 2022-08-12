//create new object
//object name-key and value-document...
const state = {
  gameElement: document.querySelector(".game"),
  //create an array
  //cells:[null,null,null,null,null,null,null,null,null]
  //create an array of 9 null elements
  //initialize
  //the array is when a clicked cell occurs
  cells: Array(9).fill(null),
  //another array for the symbols clicked
  symbols: ["o", "x"], //so when clicked it will reversed to o
  //two symbols o and x and one turn for each player
  //idea to reverse the element of the array each time it is clicked

  //store winnining combinations array that contains arrays
  winningCombinations: [
    [0, 1, 2], //top row of cells
    [3, 4, 5], //middle row of cells
    [6, 7, 8], //bottom row of cells
    [0, 3, 6], //left row of cells
    [1, 4, 7], //mid row of cells
    [2, 5, 8], //right row of cells
    [0, 4, 8], //left diag
    [2, 4, 6] //right diag
  ],
  gameFinished: false
};

function drawBoard() {
  //const var1 = true;
  //const var2 = 1;
  //console.log(var1 === var2);//these have to be explicitly the same
  //console.log(var1 == var2);//are these two similar enought

  //const var1 = 10;
  //const var2 = '10';
  //console.log(var1 === var2);//these have to be explicitly the same
  //console.log(var1 == var2);//are these two similar enought

  //console.log("DrawBoard has run!"); // to ensure that fn runs
  //const gameElement = document.querySelector(".game");

  state.gameElement.innerHTML = ""; // reset HMTML back to empty, create empty string to avoid adding my create

  //create each cell-grid
  for (let i = 0; i < 9; i++) {
    //define and pull the div from html
    const cell = document.createElement("div");
    //add to classList of element cell
    cell.classList.add("cell");

    //check if the cell has a data, if it is null or x or o
    if (state.cells[i]) {
      //does the cell have an x or an o? if so , this code runs
      const cellSymbol = document.createElement("p"); //<p></p> class="symbol" tag for paragraph
      cellSymbol.innerText = state.cells[i];
      cellSymbol.classList.add("symbol");
      cell.append(cellSymbol);

      //if it is null the allows to click on the square
    } else {
      //otherwise it must be empty, so run this next section

      //make things happend
      //first arg =action sting that listens for
      //2nd arg
      //when use clicks on cell
      //i.e event listener when an action happens
      //when cells is clicked
      cell.addEventListener("click", function () {
        if (state.gameFinished) {
          return; //if game finishes, then do not execute any other code
          //return nothing
        }

        //console.log(`cell ${i} was clicked `);
        //change the null in array of state object

        //reverse the element of the attribute array of object state
        //when cells is clicked, reverse symbol to the 1st item in the array

        state.symbols.reverse();
        state.cells[i] = state.symbols[0];
        //console.log(state.cells);

        //state.cells[i] = "x";
        //console.log(`Cell ${i} was clicked`);
        //console.log(`I added an x to the cells array at index ${i}`);
        //console.log(state.cells); //print the array chanes
        //function to draw on screen
        drawBoard();

        //within if call the function
        if (checkForWinner()) {
          //winner code goes here
          state.gameFinished = true;
          //console.log("Somebody win");
          drawMessage("You are the winner"); //function to replicate and draw banner of html
          return;
		}
		
        if (checkForDraw()) {
          
		  drawMessage("It is a draw");
		  state.gameFinished = true;
        }
        //if (checkForDraw()) {
        //  drawMessage("Draw!");
        //  state.gameFinished = true;
        //}
      });
    }

    //create the cell
    //gameElement.append(cell);
    state.gameElement.append(cell);
  }
}


function checkForWinner() {
  //check all winning combinations and compare with current state of array
  //check whether we have xxs or oos
  //return false;
  //check back back array and change the index to what is contained
  //x or o instead of indices
  return state.winningCombinations.some(function (combo) {
    const cells = combo.map(function (index) {
      return state.cells[index]; //paass the indices

      // console.log("winning combo array", cells);
    });
    //check that it does not include null and Set does gives back
    //an array with unique values, i.e. an array with x
    //deletes duplicates
    //  the array does not have a null
    //  && and
    //  all of the vaules are the same
    return !(cells.includes(null)) && new Set(cells).size === 1;
  });
}

 function checkForDraw() {
	return state.cells.every(function (cell) {
		return cell !== null;
    });
  }
  //  return state.cells.every((cell) => cell !== null);
  //} //check my state cells array

  //function checkForDraw() {
  //  return state.cells.every((cell) => cell !== null);

  //call the function to create the cell

function drawMessage(message) {
  const banner = document.createElement("div");
  banner.classList.add("banner");

  const h1 = document.createElement("h1");
  //h1.innerText = " You won!";
   h1.innerText = message;

  banner.append(h1);
  state.gameElement.append(banner);
}

drawBoard();

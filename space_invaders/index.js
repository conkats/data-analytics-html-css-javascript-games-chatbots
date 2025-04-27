//lecture 9

//define the state and behaviour needed -class/objects
const state ={
	numCells: (600/40) * (600/40),//15*15
	cells:[],
	shipPosition: 217,
	alienPosition: [
	3, 4, 5, 6, 7, 8, 9, 10,11,
    18,19,20,21,22,23,24,25,26,
    33,34,35,36,37,38,39,40,41,
    48,49,50,51,52,53,54,55,56
	],//based on the cell indices
	score:0
}

const setupGame = (element) =>{
  state.element = element
   // draw the grid-board
  drawGrid()
  // draw the spaceship
  drawShip()
  // draw the aliens
  drawAliens()
  // draw the scoreboard
  drawScoreboard()
}

const drawGrid = () => {
	//create container div
	const grid = document.createElement('div')
	grid.classList.add('grid')
    //insert grid into the app
	state.element.append(grid)
	//loop through a certain number of cells.
	for (let i=0; i<state.numCells; i++){
		const cell = document.createElement('div')
		//cell.classList.add('cell')
		state.cells.push(cell)
		//insert cell into grid
		grid.append(cell)
	}
}

const drawShip = () =>{
	//find starting point
	//add class to cell to add background image.
	state.cells[state.shipPosition].classList.add('spaceship')
}

const controlShip = (event) =>{
	if (state.gameover) return
	//demonstrate
	 // console.log(event)
	if (event.code === "ArrowLeft") {
		moveShip('left');
	} else if (event.code === 'ArrowRight'){
		moveShip('right');
	} else if (event.code === 'Space'){
		fire()
	}
}

const moveShip = (direction) => {
	// remove class, update position, add class.
  // grid boundaries using modulo (left side multiples of 15 using the module %, right side (15 minus 1))
  state.cells[state.shipPosition].classList.remove('spaceship');
  if (direction === 'left' &&  state.shipPosition % 15 !==0 ) {
	state.shipPosition--;
  } else if (direction === 'right' && state.shipPosition % 15 !==14){
    state.shipPosition++;
  }
  state.cells[state.shipPosition].classList.add('spaceship');
}

const fire = () => {
   // assing an interval to add and remove big image for a laser increasing up the grid
  // clear interval when laser reaches the top.
  // laser starts at ship position
  //using the setInterval function which calls a function at a specified interval
  let interval
  let laserPosition = state.shipPosition;
  
  interval = setInterval(() => {
	  //initially remover the laser image from cells
	  state.cells[laserPosition].classList.remove('laser')
	  //then move up the grid
	  laserPosition-=15
	  //before we do anything, check we're located in the grid
	  if (laserPosition < 0){
		  //method clears a timer set with setInterval() method
		  clearInterval(interval)
		  return
	  }
	  
	  //if there's an alien, BOOM!
	  //clear interval, remove alien image, remove alien from positions, set a timeout for a boom emoji
	  if (state.alienPosition.includes(laserPosition)){
		  clearInterval(interval)
		  state.alienPosition.splice(state.alienPosition.indexOf(laserPosition),1)//???
		  state.cells[laserPosition].classList.remove('alien')
		  state.cells[laserPosition].classList.add('hit')
		  state.score++
		  state.scoreElement.innerText = state.score
		  setTimeout(() => {
			  state.cells[laserPosition].classList.remove('hit')
		  }, 200) 
		  return
		  
	  }
	  
	  //add image
	   state.cells[laserPosition].classList.add('laser')
  }, 100)
}

const drawAliens = () => {
	//loop through cells, remove and add class name to corresponding cell.
	state.cells.forEach((cell,index) => {
		//reset : if cell index is an alien position, then remove item
		if (cell.classList.contains('alien')){
			cell.classList.remove('alien');
		}
		//update: if cell index is an alien position, add alien class
		if (state.alienPosition.includes(index)){
		cell.classList.add('alien')
		}
 })
}

const play = () => {
	//start the aliens motion
	let interval
	
	//set starting direction
	let direction = 'left'
	
	//set interval to repeat updating alien positions and drawing them
	interval = setInterval(() => {
		let movement
		//if left
		if (direction ==='left') {
			if (atSide('left')){
				//go down a row and reverse direction to the right
				movement = 15 -1
				direction = 'right'
			} else {
				//continue right
				movement = 1
			}
		//if right
		} else if (direction ==='right') {
			if (atSide('right')){
				//go down a row and reverse direction to the right
				movement = 15 + 1
				direction = 'left'
			}else {
				//continue right
				movement = -1
			}
		}
	//update alien positions
	state.alienPosition = state.alienPosition.map(position => position + movement)
	//redraw alliens
	drawAliens()
	//check game state (and stop the aliens, and stop the ship)
	checkGameState(interval)
	},800)
	
	//start the ability to move and fire
	window.addEventListener('keydown', controlShip)
	//start the aliens moving!
}


const atSide = (side) => {
	if (side==='left') {
	//check if there are any aliens with a position in right hand column? (multiple of 15)
	return state.alienPosition.some(position => position % 15 === 0)
		
	}else if (side === 'right'){
	//check if there are any aliens with a position in left hand column? (multiple of 15)
	return state.alienPosition.some(position => position % 15 === 14)
	}
}

const checkGameState = (interval) =>
{
	//if thre are no more aliens
	if (state.alienPosition.length === 0){
		//stop aliens
		clearInterval(interval)
		//set game state
		state.gameover = true
		//show win message
		drawMessage("You WON!")
		
		//if aliens reach the bottor row..ish	
	} else if (state.alienPosition.some(position => position >= state.shipPosition)){
		//stop aliens
		clearInterval(interval)
		//set game state
		state.gameover=true
		//make ship go boom
		state.cells[state.shipPosition].classList.remove('spaceship')
		state.cells[state.shipPosition].classList.add('hit')
		//show lose message
		drawMessage("!!GAME OVER!!")
		
	}
}

const drawMessage = (message) => {
	//add message element with class
	const messageElem = document.createElement('div')
	messageElem.classList.add('message')
	
	//append h1 on HTML with text
	const h1 = document.createElement('h1')
	h1.innerText =message
	messageElem.append(h1)
	
	//append element 1 to the app
	state.element.append(messageElem)
}	

const drawScoreboard = () => {
  const heading = document.createElement("h1")
  heading.innerText = 'Space Invaders'
  const paragraph1 = document.createElement("p")//for paragraph element in html
  paragraph1.innerText = 'Press SPACE to shoot.'
  const paragraph2 = document.createElement("p")
  paragraph2.innerText = 'Press ← and → to move'
    const paragraph3 = document.createElement("p")
  paragraph3.innerText = 'Press ↓ to start moving/firing'
  const scoreboard = document.createElement('div')
  scoreboard.classList.add('scoreboard')
  const scoreElement = document.createElement('span')
  scoreElement.innerText = state.score
  const heading3 = document.createElement('h3')
  heading3.innerText = 'Score: '
  heading3.append(scoreElement)
  scoreboard.append(heading, paragraph1, paragraph2, paragraph3, heading3)

  state.scoreElement = scoreElement
  state.element.append(scoreboard)
}

//query the page for the element
const appElement = document.querySelector('.app')
//insert app into the game
setupGame(appElement)
//play!
play()
// constants
const TOP_ROW_INDEX = 0
const BOTTOM_ROW_INDEX = 5
const RIGHTMOST_COLUMN_INDEX = 6
const MAX_COLUMNS = 7
const MAX_ROWS = 6

// resets the connect4 board
function newBoard() {
	let board = []
	for (let rows = 0; rows < MAX_ROWS; rows++) {
		let newRow = []
		for (let columns = 0; columns < MAX_COLUMNS; columns++) {
			newRow.push({ color: null })
		}
		board.push(newRow)
	}
	return board
}

// game state
let user1Color = null
let user2Color = null
let currentTurnColor = null
let gameBoard = newBoard()

// set up readline to get user input
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

rl.on('close', function() {
	console.log('\nGG!')
	process.exit(0)
})

// BOARD STYLING
const boxPadding = '|               '
const rowPadding = new Array(8).join(boxPadding) + '|\n'
const boxBorder =
	'  |---------------------------------------------------------------------------------------------------------------|\n'

// appends column labels to board
const appendLetters = output => {
	for (let i = 0; i < 7; i++) {
		output += '        ' + (i + 1) + '       '
	}
	output += '\n'
	return output
}

// prints the board with column numbers
function printBoard(board) {
	let boardOutput = '\n'
	boardOutput = appendLetters(boardOutput)
	// top bar
	boardOutput += boxBorder

	for (let row = 0; row < MAX_ROWS; row++) {
		// upper box spacing
		boardOutput += '  ' + rowPadding
		boardOutput += '  '
		for (let column = 0; column < MAX_COLUMNS; column++) {
			// i = row, j= column
			let spot = board[row][column]
			if (!spot.color) {
				boardOutput += boxPadding
			} else {
				let padding = Math.max(11 - spot.color.length, 0)
				boardOutput += '|     ' + spot.color + new Array(padding).join(' ')
			}
		}
		boardOutput += '|  ' + '\n'
		boardOutput += '  ' + rowPadding

		boardOutput += boxBorder
	}

	boardOutput = appendLetters(boardOutput)
	console.log(boardOutput)
}

// change whose turn it is
function changeTurn() {
	if (currentTurnColor === user1Color) {
		currentTurnColor = user2Color
	} else {
		currentTurnColor = user1Color
	}
}

// add a tile onto the board
function addTile(columnIndex) {
	for (let row = BOTTOM_ROW_INDEX; row >= TOP_ROW_INDEX; row--) {
		if (gameBoard[row][columnIndex].color === null) {
			gameBoard[row][columnIndex].color = currentTurnColor
			return
		}
	}
}

// check if all columns are filled
function boardIsFilled() {
	for (let columnIndex = 0; columnIndex < MAX_COLUMNS; columnIndex++) {
		if (gameBoard[TOP_ROW_INDEX][columnIndex].color === null) {
			return false
		}
	}
	return true
}

// each row has 4 possible 4 in a row, check each
function getHorizontal4InARow() {
	for (let row = 0; row < MAX_ROWS; row++) {
		for (let window = 0; window < 4; window++) {
			if (
				gameBoard[row][window].color &&
				gameBoard[row][window + 1].color &&
				gameBoard[row][window + 2].color &&
				gameBoard[row][window + 3].color
			) {
				let colorTypeSet = new Set()
				colorTypeSet.add(gameBoard[row][window].color)
				colorTypeSet.add(gameBoard[row][window + 1].color)
				colorTypeSet.add(gameBoard[row][window + 2].color)
				colorTypeSet.add(gameBoard[row][window + 3].color)
				if (colorTypeSet.size === 1) {
					return true
				}
			}
		}
	}
	return false
}

// each column has 3 possible 4 in a row, check each
function getVertical4InARow() {
	for (let column = 0; column < MAX_COLUMNS; column++) {
		for (let window = 0; window < 3; window++) {
			if (
				gameBoard[window][column].color &&
				gameBoard[window + 1][column].color &&
				gameBoard[window + 2][column].color &&
				gameBoard[window + 3][column].color
			) {
				let colorTypeSet = new Set()
				colorTypeSet.add(gameBoard[window][column].color)
				colorTypeSet.add(gameBoard[window + 1][column].color)
				colorTypeSet.add(gameBoard[window + 2][column].color)
				colorTypeSet.add(gameBoard[window + 3][column].color)
				if (colorTypeSet.size === 1) {
					return true
				}
			}
		}
	}
	return false
}

// check the 12 possible left to right diagonal 4 in a rows
function checkBackSlash4InARow() {
	// only the left 4 columns can get left to right diagonal connect 4s
	for (let column = 0; column < 4; column++) {
		// only the first 3 rows can get left to right diagonal connect 4s
		for (let row = 0; row < 3; row++) {
			if (
				gameBoard[row][column].color &&
				gameBoard[row + 1][column + 1].color &&
				gameBoard[row + 2][column + 2].color &&
				gameBoard[row + 3][column + 3].color
			) {
				let colorTypeSet = new Set()
				colorTypeSet.add(gameBoard[row][column].color)
				colorTypeSet.add(gameBoard[row + 1][column + 1].color)
				colorTypeSet.add(gameBoard[row + 2][column + 2].color)
				colorTypeSet.add(gameBoard[row + 3][column + 3].color)
				if (colorTypeSet.size === 1) {
					return true
				}
			}
		}
	}
	return false
}

// check the 12 possible right to left diagonal 4 in a row
function checkForwardSlash4InARow() {
	// only the right 4 columns can get right to left diagonal connect 4s
	for (let columnCount = 0; columnCount < 4; columnCount++) {
		let column = RIGHTMOST_COLUMN_INDEX - columnCount
		// only the first 3 rows can get right to left diagonal connect 4s
		for (let row = 0; row < 3; row++) {
			if (
				gameBoard[row][column].color &&
				gameBoard[row + 1][column - 1].color &&
				gameBoard[row + 2][column - 2].color &&
				gameBoard[row + 3][column - 3].color
			) {
				let colorTypeSet = new Set()
				colorTypeSet.add(gameBoard[row][column].color)
				colorTypeSet.add(gameBoard[row + 1][column - 1].color)
				colorTypeSet.add(gameBoard[row + 2][column - 2].color)
				colorTypeSet.add(gameBoard[row + 3][column - 3].color)
				if (colorTypeSet.size === 1) {
					return true
				}
			}
		}
	}
	return false
}

// check if there is a 4 in a row
function fourInARowExists() {
	return (
		getHorizontal4InARow() ||
		getVertical4InARow() ||
		checkBackSlash4InARow() ||
		checkForwardSlash4InARow()
	)
}

// process a tile being dropped by the user
function makeMove(column) {
	try {
		// convert to a number
		column = Number(column)
	} catch {
		// do nothing when caught
	}
	if (!column || typeof column !== 'number' || column < 1 || column > 7) {
		console.log('Invalid input')
		return
	}
	if (gameBoard[TOP_ROW_INDEX][column - 1].color !== null) {
		console.log('Column is full, please try again')
		return
	}

	// add tile to board
	addTile(column - 1)
	printBoard(gameBoard)

	if (fourInARowExists()) {
		console.log(currentTurnColor + ' wins!')
		rl.close()
		return
	}
	if (boardIsFilled()) {
		console.log(' DRAW - TIE - CATS GAME')
		rl.close()
		return
	}
	changeTurn()
}

// allows us to loop and get input moves from the user
async function getInput() {
	const column = await new Promise(resolve => {
		rl.question(
			`${
				currentTurnColor === user1Color ? user1Color : user2Color
			}- select a column:`,
			function(column) {
				resolve(column)
			}
		)
	})
	makeMove(column)
	getInput()
}

// allows us to get the player colors
async function startGame() {
	const player1Color = await new Promise(resolve => {
		rl.question(`Enter in player 1's color: `, function(color) {
			user1Color = color
			resolve(color)
		})
	})
	await new Promise(resolve => {
		rl.question(`Enter in player 2's color: `, function(color) {
			user2Color = color
			resolve()
		})
	})
	currentTurnColor = player1Color
	printBoard(gameBoard)
	getInput()
}

// call startGame to begin game
startGame()

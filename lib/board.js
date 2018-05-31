const sleep = require('sleep')

const BOARD_DIMENSION = 8

const DIRECTIONS = {
  'LEFT': {
    'x': -1,
    'y': 0
  },
  'UPPER_LEFT': {
    'x': -1,
    'y': -1
  },
  'UP': {
    'x': 0,
    'y': -1
  },
  'UPPER_RIGHT': {
    'x': 1,
    'y': -1
  },
  'RIGHT': {
    'x': 1,
    'y': 0
  },
  'LOWER_RIGHT': {
    'x': 1,
    'y': 1
  },
  'DOWN': {
    'x': 0,
    'y': 1
  },
  'LOWER_LEFT': {
    'x': -1,
    'y': 1
  }
}

const INIT_BOARD =  [
  [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 2, 1, 0, 0, 0 ],
  [ 0, 0, 0, 1, 2, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ]
]

const verifyDimensions = (row, column) => {
  return BOARD_DIMENSION > row && row >= 0 && BOARD_DIMENSION > column && column >= 0
}

const isInitBoard = (board) => compareBoard(board, INIT_BOARD)

const leftCountOfMoves = (board) => {
  count = 0

  board.forEach(row => row.forEach(element => {
    if(element === 0){
      count += 1
    }
  }))

  return count
}

const compareBoard = (board, board2) => {
  let equal = true
  board.forEach((row, row_index) => {
    const row2 = board2[row_index]
    if(row.length !== row2.length || !row.every((v, i) => v === row2[i])){
      equal = false
    }
  })

  return equal
}

const transformBoard = (board) => {
  let matrix = []
  board.forEach((element, index) => {
    if(index % BOARD_DIMENSION === 0){
      matrix.push([])
    }
    matrix[matrix.length-1].push(element)
  })

  return matrix
}


const validateBoard = (board, id) => {
  let moves = {}
  board.forEach((row, row_index) => {
    row.forEach((element, column_index) => {
      if(element === id){
        Object.keys(DIRECTIONS).forEach(movement => {
          let current_row = row_index + DIRECTIONS[movement].y
          let current_column = column_index + DIRECTIONS[movement].x
          let defined = false

          while(!defined){
            //verify dimensions
            if(verifyDimensions(current_row, current_column)){
              //if first one is blank or mine
              let found_element = board[current_row][current_column]

              if(found_element === 0 || found_element === id){
                defined = true
              } else {
                // calculate current_row and current_column for looakahed_element
                current_row = current_row + DIRECTIONS[movement].y
                current_column = current_column + DIRECTIONS[movement].x
                //verify dimensions
                if(verifyDimensions(current_row, current_column)){
                  //look ahead for the next one
                  let lookahead_element = board[current_row][current_column]

                  //if element is blank, I have found a move
                  if(lookahead_element === 0){
                    position = (current_row * BOARD_DIMENSION) + current_column
                    // maybe a dicionary of positions, at the end only them are possibles moves
                    if(moves[position] !== undefined){
                      moves[position].directions.push({
                        'last_x': column_index,
                        'last_y': row_index,
                        movement
                      })

                    } else {
                      moves[position] = {
                        'x': current_column,
                        'y': current_row,
                        'directions': [{
                          'last_x': column_index,
                          'last_y': row_index,
                          movement
                        }],
                        position
                      }
                    }

                    defined = true
                  } else if(lookahead_element === id){
                    defined = true
                  }
                } else {
                  defined = true
                }
              }
            } else {
              defined = true
            }
          }
        })
      }
    })
  })

  return moves
}

const applyMoveBoard = (board, id, move) => {
  //generate copy of board
  let newBoard = board.map(row => row.slice(0))
  // console.log('move', move)
  const init_column = move.x
  const init_row = move.y

  move.directions.forEach(direction => {
    const movement = direction.movement
    let last_column = direction.last_x
    let last_row = direction.last_y

    while(last_column !== init_column || last_row !== init_row){
      last_column += DIRECTIONS[movement].x
      last_row += DIRECTIONS[movement].y

      newBoard[last_row][last_column] = id
    }
  })

  return newBoard
}

module.exports = {
  transformBoard,
  compareBoard,
  validateBoard,
  applyMoveBoard,
  isInitBoard,
  leftCountOfMoves
}

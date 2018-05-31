const b = require('./board')

const positionalMatrix = [
  [100, -20, 10, 5, 5, 10, -20, 100],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [100, -20, 10, 5, 5, 10, -20, 100],
]

const positional = (board, id) => {
  let result = 0
  board.forEach((row, row_index) => {
    row.forEach((element, column_index) => {
      if(element === id){
        result += positionalMatrix[row_index][column_index]
      } else if(element === 0){
        result += 0
      } else {
        result -= positionalMatrix[row_index][column_index]
      }
    })
  })

  return result
}

const absolute = (board, id) => {
  let result = 0
  board.forEach((row, row_index) => {
    row.forEach((element, column_index) => {
      if(element === id){
        result += 1
      } else if(element === 0){
        result += 0
      } else {
        result -= 1
      }
    })
  })

  return result
}

const mobilityMatrix = [[0, 0], [0, 7], [7, 0], [7, 7]]

const mobility = (board, id) => {
  const enemey_id = id === 1 ? 2 : 1
  let result = 0

  const my_moves = b.validateBoard(board, id).length
  const enemy_moves = b.validateBoard(board, enemey_id).length

  let my_corners = 0
  let enemy_corners = 0

  mobilityMatrix.forEach(corner => {
    if(board[corner[0]][corner[1]] === id){
      my_corners += 1
    } else if(board[corner[0]][corner[1]] === enemey_id){
      enemy_corners += 1
    }
  })

  // console.log('my_corners', my_corners)
  // console.log('enemy_corners', enemy_corners)
  // console.log('my_moves', my_moves)
  // console.log('enemy_moves', enemy_moves)

  result = ((my_moves - enemy_moves)/(my_moves + enemy_moves))

  if(isNaN(result)){
    return 10 * (my_corners - enemy_corners)
  }

  return result + 10 * (my_corners - enemy_corners)
}

module.exports = {
  positional,
  absolute,
  mobility
}

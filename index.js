const sleep = require('sleep')
const argv = require('yargs').argv

const URL = 'http://'.concat(argv.ip).concat(':').concat(argv.port)
const socket = require('socket.io-client')(URL)

const b = require('./lib/board')
const m = require('./lib/minimax')

let root = {}, bestChild = {}, countOfMoves = 0

const rand_int = (min, max) => Math.floor(Math.random() * (max - min)) + min

socket.on('connect', function(){
  console.log("Signing in as", argv.user)

  socket.emit('signin', {
    user_name: argv.user,
    tournament_id: argv.tid,
    user_role: 'player',
  })

  socket.on('ok_signin', function(){
    console.log("Successfully signed in!")
  })

  socket.on('ready', function(data){
    const gameID = data.game_id
    const playerTurnID = data.player_turn_id
    const boardArray = data.board
    const boardMatrix = b.transformBoard(boardArray)
    const enemey_id = playerTurnID === 1 ? 2 : 1

    // if its the first time, use a pregenerated root
    if(Object.keys(root).length === 0 && root.constructor === Object){
      root = {
        board: boardMatrix,
        score: 0,
        position: -1,
        childs: []
      }
    } else {
      // find new root from best child
      let newRootIndex = m.foundNewRootIndex(bestChild, boardMatrix)

      root = bestChild.childs[newRootIndex]
      if(root === undefined){
        //maybe its a new game
        root = {
          board: boardMatrix,
          score: 0,
          position: -1,
          childs: []
        }
      }
    }

    // console.log('LAST BOARD', boardMatrix)
    // console.log('ROOT BOARD\n', root.board)

    countOfMoves = b.leftCountOfMoves(boardMatrix)

    let bestScore = 0

    if(countOfMoves <= 14){
      bestScore = m.minimax(
        root,
        countOfMoves,
        true,
        playerTurnID,
        enemey_id,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        countOfMoves
      )
    } else {
      bestScore = m.minimax(
        root,
        6,
        true,
        playerTurnID,
        enemey_id,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        countOfMoves
      )
    }

    bestChild = root.childs[root.childs.findIndex(child => child.score === bestScore)]

    // console.log('BEST CHILD', bestChild)
    let move = bestChild.position
    console.log('move', move)

    const play = {
      tournament_id: argv.tid,
      player_turn_id: playerTurnID,
      game_id: gameID,
      movement: move,
    }

    socket.emit('play', play)
  })

  socket.on('finish', function(data){
    console.log('finish')
    const gameID = data.game_id
    const playerTurnID = data.player_turn_id
    const winnerTurnID = data.winner_turn_id
    const board = data.board

    // TODO: Your cleaning board logic here

    const player_ready = {
      tournament_id: argv.tid,
      player_turn_id: playerTurnID,
      game_id: gameID
    }

    socket.emit('player_ready', player_ready)
  })
})

import fs  from 'fs'
import debug from 'debug'

const logerror = debug('tetris:error')
const loginfo = debug('tetris:info')

var Player = require('./player');
var Board = require('./board');
var Piece = require('./piece');


const initApp = (app, params, cb) => {
  const { host, port } = params

    app.on('request', (req, res) => {
      const file = req.url === '/bundle.js' ?
        '/../../build/bundle.js' :
        '/../../index.html'
        fs.readFile(__dirname + file, (err, data) => {
          if (err) {
            logerror(err)
              res.writeHead(500)
              return res.end('Error loading index.html')
          }
          res.writeHead(200)
            res.end(data)
        })
    })

  app.listen({ host, port }, () => {
    loginfo(`tetris listen on ${params.url}`)
      cb()
  })
}


let players = [] 


const startGame = (socket, player) => {
  console.log(player.board.grid)
    socket.emit('action', { type : 'board', payload : player.board.grid}) 
}

const mainLoop = (socket, player) => {
  player.board.moveDown(); 
  socket.emit('action', { type : 'board', payload : player.board.grid}) 

}

const initEngine = (io) => {
  io.on('connection', (socket) => {
    loginfo(`Socket connected: ${socket.id}`)
      socket.on('action', (action) => {
        if (action.type === 'newplayer') {
          console.log("NEW PLAYER INC")
            var player = new Player(socket.id, action.name)
            players.push(player)
            startGame(socket, player)
            mainLoop(socket, player)
        }
      })
  })
}



const handleInput = (msg) => {
  switch (msg) {
    case 'LEFT':
    case 'RIGHT':
    default:
  }
}

const receiveInput = (io) => {
  io.on('connection', (socket) => {
    loginfo(`Socket connected: ${socket.id}`)
      socket.on('action', (action) => {
        if (action.type === 'input') {
          console.log('input received')
            handleInput(action.msg)
        }
      })
  })
}





const http = require('http')
const Promise = require('promise')

export const create = (params) => {

  const promise = new Promise((resolve, reject) => {
    const app = http.createServer()
      initApp(app, params, () => {
        const io = require('socket.io')(app)
          const stop = (cb) => {
            io.close()
              app.close(() => {
                app.unref()
              })
            loginfo('Engine stopped.')
              cb()
          }

        //  handleGame(io)
        initEngine(io)
          resolve({ stop })
      })
  })
  return promise
}

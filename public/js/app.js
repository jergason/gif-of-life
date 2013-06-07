(function() {
  "use strict"

  function initBoard(widthAndHeight) {
    var board = []
    var row
    for (var i = 0; i < widthAndHeight; i++) {
      row = []
      for (var j = 0; j < widthAndHeight; j++) {
        if ((i === 2 && j < 5 && j > 1) || (i == 3 && j < 4 && j > 0)) {
          row.push(1)
        }
        else {
          row.push(0)
        }
      }
      board.push(row)
    }
    return board
  }

  function initTable(widthAndHeight) {
    var table = document.createElement("table")
    var row
    var cell

    for (var i = 0; i < widthAndHeight; i++) {
      row = document.createElement("tr")
      row.className = i
      for (var j = 0; j < widthAndHeight; j++) {

        cell = document.createElement("td")
        cell.className = j
        row.appendChild(cell)
      }
      table.appendChild(row)
    }

    return table
  }

  function isAlive(cell) {
    return (cell === 1)
  }

  function updateBoard(board) {
    var nextTickBoard = JSON.parse(JSON.stringify(board))

    for (var y = 0; y < board.length; y++) {
      for (var x = 0; x < board.length; x++) {
        var cell = board[y][x]
        var neighbors = getNumberOfNeighbors(board, x, y)
        var alive = isAlive(board[y][x])

        if (alive) {
          // die out if we have not enough neighbors
          if (neighbors < 2) {
            nextTickBoard[y][x] = 0
          }
          else if (neighbors === 2 || neighbors === 3) {
            nextTickBoard[y][x] = 1
          }
          else {
            //overcrowded so it dies out
            nextTickBoard[y][x] = 0
          }
        }
        // cell is dead, can only come alive if you have 3 children
        else {
          if (neighbors === 3) {
            nextTickBoard[y][x] = 1
          }
          else {
            nextTickBoard[y][x] = 0
          }
        }
      }
    }
    return nextTickBoard
  }

  function getNumberOfNeighbors(board, x, y) {
    var neighbors = 0
    var surroundings = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0], [1, 0],
      [-1, 1], [0, 1], [1, 1]
    ]

    for (var i = 0; i < surroundings.length; i++) {
      var ySurrounding = surroundings[i][0] + y
      var xSurrounding = surroundings[i][1] + x
      if (isInBounds(board, ySurrounding, xSurrounding)) {
        neighbors += board[ySurrounding][xSurrounding]
      }
    }
    return neighbors
  }

  function isInBounds(board, y, x) {
    var yLen = board.length
    var xLen = board[0].length
    return ((0 <= x && x < xLen) && (0 <= y && y < yLen))
  }

  function renderBoardToTable(board, $table, imageList) {
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board.length; j++) {
        if (board[i][j]) {
          renderCell(i, j, $table, imageList)
        }
        else {
          renderNothing(i, j, $table)
        }
      }
    }
  }

  function renderCell(y, x, $table, imageList) {
    var $col = $table.find('tr.' + y)
    var $row = $col.find('td.' + x)

    $row.html(getRandomImage(imageList))
  }

  function renderNothing(y, x, $table) {
    var $col = $table.find('tr.' + y)
    var $row = $col.find('td.' + x)

    $row.html('')
  }

  function getRandomImage(imageList) {
    var randNum = Math.ceil(Math.random() * imageList.length)
    return imageList[randNum]
  }

  function initImages(cellWidth, cellHeight) {
    var imageList = [
      "beard_slap",
      "bellyflop",
      "cat_ping_pong",
      "chew",
      "chuck_forrest",
      "cookie",
      "cupcakedog-war-flashbacks",
      "dancing",
      "diving",
      "dramatic_meercat",
      "ernie",
      "fish_hit",
      "folded-cat",
      "gandalf",
      "happy-baby",
      "happy",
      "ill_bet",
      "jumping-dog",
      "kicked_in_junk",
      "laughing",
      "rage",
      "regret_nothing_chicken",
      "sloth-only-dreams-now",
      "sloth",
      "sour",
      "upset",
      "walrus",
      "wut"
    ]

    return imageList.map(function(i) {
      var img = new Image()
      img.src = 'img/' + i + '.gif'
      img.width = cellWidth
      img.height = cellHeight
      return img
    })
  }

  $(function() {
    var BOARD_NUM_CELLS = 8
    var TABLE_WIDTH_HEIGHT = 1000
    var CELL_WIDTH_HEIGHT = TABLE_WIDTH_HEIGHT / BOARD_NUM_CELLS
    var imageList = initImages(CELL_WIDTH_HEIGHT, CELL_WIDTH_HEIGHT)
    var board = initBoard(BOARD_NUM_CELLS)
    var table = initTable(BOARD_NUM_CELLS)
    var $table = $(table)
    renderBoardToTable(board, $table, imageList)
    $("div.the-tables").append($table)
    // TODO: attach some click handlers to the cells to turn on and off automatically
    function advance() {
      board = updateBoard(board)
      renderBoardToTable(board, $table, imageList)
    }

    var interval = setInterval(advance, 2000)
  })
})();

const grid_size = 4
let cell_size = 110
const grid_gap = 10

var isBreakPoint = function (bp) {
    var bps = [319, 360, 510],
        w = $(window).width(),
        min, max
    for (var i = 0, l = bps.length; i < l; i++) {
      if (bps[i] === bp) {
        min = bps[i-1] || 0
        max = bps[i]
        break
      }
    }
    return w > min && w <= max
}



export default class Grid {
	#cells
	constructor(gridElement) {
		gridElement.style.setProperty('--grid-size', grid_size)
		gridElement.style.setProperty('--cell-size', `${cell_size}px`)
		gridElement.style.setProperty('--grid-gap',`${grid_gap}px`)
		if (isBreakPoint(510)) {
			gridElement.style.setProperty('--cell-size', 70 + "px")
		}
		if (isBreakPoint(360)) {
			gridElement.style.setProperty('--cell-size', 60 + "px")
		}
		this.#cells = createCellElement(gridElement).map((cellElement, index) => {
			return new Cell(
				cellElement,
				index % grid_size, // Тут вычисляется X позиция нашей клетки.
				Math.floor (index / grid_size) // Тут вычисляется Y позиция нашей клетки.
			) 
		
		})
		console.log (this.#cells)
	}
	get cells() {
		return this.#cells
	  }
	
	  get cellsByRow() {
		return this.#cells.reduce((cellGrid, cell) => {
		  cellGrid[cell.y] = cellGrid[cell.y] || []
		  cellGrid[cell.y][cell.x] = cell
		  return cellGrid
		}, [])
	  }
	
	  get cellsByColumn() {
		return this.#cells.reduce((cellGrid, cell) => {
		  cellGrid[cell.x] = cellGrid[cell.x] || []
		  cellGrid[cell.x][cell.y] = cell
		  return cellGrid
		}, [])
	  }
	  
	  get #emptyCells() {
		return this.#cells.filter(cell => cell.tile == null)
	  }
	
	  randomEmptyCell() {
		const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
		return this.#emptyCells[randomIndex]
	  }


}


class Cell 	{
	#cellElement
	#x
	#y
	#tile
	#mergeTile
	constructor(cellElement, x, y) {
		this.#cellElement = cellElement
		this.#x = x
		this.#y = y
		console.log(this.#x, this.#y)
	} 

	get x() {
		return this.#x
	}
	get y() {
		return this.#y
	}
	
	get tile() {
		return this.#tile;
	}

	set tile(value) {
		this.#tile = value
		if (value == null) return
		this.#tile.x = this.#x
		this.#tile.y = this.#y
	  }

	get mergeTile() {
		return this.#mergeTile
	}

	set mergeTile(value) {
		this.#mergeTile = value
		if (value == null) return
		this.#mergeTile.x = this.#x
		this.#mergeTile.y = this.#y
	}

	canAccept(tile) {
		return (
		  this.tile == null ||
		  (this.mergeTile == null && this.tile.value === tile.value)
		)
	  }
	mergeTiles() {
		if (this.tile == null || this.mergeTile == null) return
		this.tile.value = this.#tile.value + this.mergeTile.value 
		this.mergeTile.remove()
		this.mergeTile = null
	}
}

function createCellElement(gridElement) {
	const cells = []
	for (let i=0; i < grid_size * grid_size; i++) {
		const cell = document.createElement('div')
		cell.classList.add('cell')
		cells.push(cell)
		gridElement.append(cell)
	}
	return cells
}

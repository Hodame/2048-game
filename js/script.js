// ИМПОРТ ФАЙЛОВ СЕТКИ А ТАКЖЕ ПЛИТОК.
import Grid from "./grid.js"
import Tile from "./tile.js"

// ПОЛУЧЕНИЕ В ПЕРЕМЕННУЮ ИГРОВОЕ ПОЛЕ И АКТИВАЦИЯ ФУНКЦИЙ СОЗДАНИЕ ДВУХ ПЛИТОК.
const gameBoard = document.getElementById('game-board')
const grid = new Grid(gameBoard)
console.log (grid.randomEmptyCell())
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)  
setupInput()

// ИНИЦИАЛИЗАЦИЯ УПРАВЛЕНИЯ.
function setupInput () {
	window.addEventListener('keydown', handleInput, {once: true})
	window.addEventListener("swiped", handleMobileInput, { once: true });
}

// УПРАВЛЕНИЕ ПОД МОБИЛЬНЫЕ УСТРОЙСТВА.
async function handleMobileInput(e) {
  switch (e.detail.dir) {
    case "up":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "down":
      e.preventDefault();
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "left":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "right":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }
  grid.cells.forEach((cell) => cell.mergeTiles());

  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
	newTile.waitForTransition(true).then(() => {
	document.querySelector(".game-over").classList.add("over")
	})
	const restart = document.querySelector('.restart')
	restart.addEventListener('click', (e) => {
		window.location.reload()
	})
	return
  }
  setupInput()
}

// УПРАВЛЕНИЕ НА КЛАВИАТУРЕ.
async function handleInput (e) {
	 switch(e.key) {
		case "ArrowUp":
			if (!canMoveUp()) {
				setupInput()
				return
			}
			await moveUp()
			break
		case "ArrowDown":
			if (!canMoveDown()) {
				setupInput()
				return
			}
			await moveDown()
			break
		case "ArrowLeft":
			if (!canMoveLeft()) {
				setupInput()
				return
			}
			await moveLeft()
			break
		case "ArrowRight":
			if (!canMoveRight()) {
				setupInput()
				return
			}
			await moveRight()
			break
		case "w":
			if (!canMoveUp()) {
				setupInput()
				return
			}
			await moveUp()
			break
		case "s":
			if (!canMoveDown()) {
				setupInput()
				return
			}
			await moveDown()
			break
		case "a":
			if (!canMoveLeft()) {
				setupInput()
				return
			}
			await moveLeft()
			break
		case "d":
			if (!canMoveRight()) {
				setupInput()
				return
			}
			await moveRight()
			break
		default: 
		setupInput()
		return
	 }

	grid.cells.forEach(cell => cell.mergeTiles())

	const newTile = new Tile(gameBoard)
	grid.randomEmptyCell().tile = newTile

	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		newTile.waitForTransition(true).then(() => {
		document.querySelector(".game-over").classList.add("over")
		})
		const restart = document.querySelector('.restart')
		restart.addEventListener('click', (e) => {
			window.location.reload()
		})
		return
	  }

	 setupInput()
}

// ФУНКЦИИ ЗАПУСКА ЛОГИКИ УПРАВЛЕНИЯ.
function moveLeft() {
	return slideTiles(grid.cellsByColumn)
  }
  
  function moveRight() {
	return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
  }
  
  function moveUp() {
	return slideTiles(grid.cellsByRow)
  }
  
  function moveDown() {
	return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
  }
	
  
// ПРОВЕРКИ НА ВОЗМОЖНОСТЬ ДВИГАТЬ ПЛИТКИ В РАЗНЫЕ СТОРОНЫ.
  function canMoveLeft() {
	return	canMove(grid.cellsByColumn)
  }
  function canMoveRight() {
	return	canMove(grid.cellsByColumn.map(column => [...column].reverse()))
  }
  function canMoveUp() {
	return	canMove(grid.cellsByRow)
  }
  function canMoveDown() {
	return	canMove(grid.cellsByRow.map(row => [...row].reverse()))
  }
  function canMove(cells) {
	return cells.some(group => {
	  return group.some((cell, index) => {
		if (index === 0) return false
		if (cell.tile == null) return false
		const moveToCell = group[index - 1]
		return moveToCell.canAccept(cell.tile)
	  })
	})
  }

// ФУНКЦИЯ КОТОРАЯ БУДЕТ ЗАПУСКАТЬ ДВИЖЕНИЕ ИГРОВОГО ПОЛЯ ПРИ НАЖИТИЯ НА КНОПКИ УПРАВЛЕНИЯ.
function slideTiles(cells) {
	return Promise.all(
	cells.flatMap(group => {
		const promises = []
		for (let i = 1; i < group.length; i++) {
			const cell = group[i]
			if (cell.tile == null) continue
			let lastValidCell
			for (let j = i - 1; j >= 0; j--) {
				const moveToCell = group[j]
				if (!moveToCell.canAccept(cell.tile)) break
				lastValidCell = moveToCell
			}
			if (lastValidCell != null) {
				promises.push(cell.tile.waitForTransition())
				if (lastValidCell.tile != null) {
					lastValidCell.mergeTile = cell.tile
				} else {
					lastValidCell.tile = cell.tile
				}
				cell.tile = null
			}
		}
		return promises
	}));
}

// ОТКЛЮЧЕНИЕ ПРОКРУТКИ СТРАНИЦЫ НА СТРЕЛОЧКИ.
window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// ИНТЕРВАЛ КОТОРЫЕ БУДЕТ ОБНОВЛЯТЬ ОКНО С КОЛИЧЕСТВОМ ОЧКОМ.
setInterval(score, 10)

function score() {
	let tiles = document.querySelectorAll('.tile')
	let sum = []
	const score = document.querySelector('.up__score span')
	tiles.forEach(e => {
		sum.push(Number(e.innerHTML))
	});

	
	score.innerHTML = sum.reduce((a,b ) => a + b)
}

// ОТКРЫТИЕ И СКРЫТИЕ ТЕКСТА С ИНФОРМАЦИЕЙ.
const openBtn = document.querySelector(".open-button__text")
const about = document.querySelector('.about')
const body = document.querySelector('body')
const wrapper = document.querySelector('.wrapper')
openBtn.addEventListener('click', (e) => {
	about.classList.toggle('open')
	body.classList.toggle('lock')
	if (about.classList.contains('open')) {
		about.style.maxHeight = about.scrollHeight  + 'px'
		openBtn.innerHTML = "Убрать текст"
	} else {
		about.style.maxHeight = 0
		openBtn.innerHTML = "Показать текст"

	}
})

// КНОПКА ЗАПУСКА НОВОЙ ИГРЫ (ПЕРЕЗАГРУЗКА СТРАНИЦЫ).
const newGameBtn = document.querySelector('.new-game__body')

newGameBtn.addEventListener('click', (e) => {
	window.location.reload()
})
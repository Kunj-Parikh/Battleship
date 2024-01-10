const gameContainer = document.getElementById("game-container")
const shipContainer = document.querySelector('.ship-container')
const rotateButton = document.querySelector('#rotate-button')
const shipArr = Array.from(shipContainer.children)
let angle = [0, 0, 0, 0, 0]

function rotat_all() {
    angle.forEach((e, i, arr) => arr[i] = arr[i] === 0 ? 90 : 0)
    for (let i = 0; i < 5; i++) {
        shipArr[i].style.transform = `rotate(${angle[i]}deg)`
    }

}
const side = 10;
function createBoard(color, user) {
    const board = document.createElement('div')
    board.classList.add('boards')
    board.style.backgroundColor = color
    board.id = user
    for(let i = 0; i<side*side; i++) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.id = i
        board.append(block)
    }
    gameContainer.append(board)
}

createBoard('gray', 'p')
createBoard('green', 'c')

class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
    }
}

const ship1 =  new Ship('ship1', 2)
const ship2 =  new Ship('ship2', 2)
const ship3 =  new Ship('ship3', 3)
const ship4 =  new Ship('ship4', 3)
const ship5 =  new Ship('ship5', 4)

const ships = [ship1, ship2, ship3, ship4, ship5]

function addShipPiece(ship) {
    const cBlocks = document.querySelectorAll('#c div')
    let randomBool = Math.random() < 0.5
    let isHorizontal = randomBool
    let rsi = Math.floor(Math.random()*side*side)

    /* boolean ensuring starting pos is valid */ 
    let validStart = isHorizontal ? rsi <= side*side - ship.length ? rsi : side*side-ship.length : // horizontal check
        rsi <= side*side-side*ship.length ? rsi : rsi - ship.length*side+side // vertical check
    
    let shipBlocks = []
    // Custom ship-generating algorithm cuz the one in the video doesn't work lol
    let pushH_t = Math.floor(Math.random() * side) * side
    let pushH_o = Math.floor(Math.random() * (side+1-ship.length))
    let pushH = pushH_t + pushH_o

    let pushV_t = Math.floor(Math.random() * (side+1 - ship.length)) * side
    let pushV_o = Math.floor(Math.random() * side)
    let pushV = pushV_t + pushV_o
    for(let i = 0; i < ship.length; i++) {
        if(isHorizontal) {
            console.log(i+pushH)
            shipBlocks.push(cBlocks[i+pushH])
        } else {
            console.log(i*side+pushV)
            shipBlocks.push(cBlocks[i*side+pushV])
        }
    }

    let valid

    if (isHorizontal) {
        shipBlocks.every((_s, i) => 
            valid = shipBlocks[0].id % side !== side - (shipBlocks.length - (i+1)))
    }
    else {
        shipBlocks.every((_s, i) => 
            valid = shipBlocks[0].id < 90 + (side * i + 1))
    }

    const notTaken = shipBlocks.every(s => !s.classList.contains('taken<3'))

    if (valid && notTaken) {
        shipBlocks.forEach(s => {
            s.classList.add(ship.name)
            s.classList.add('taken<3')
        })
    } 
    else {
        addShipPiece(ship)
    }
}
ships.forEach(s => addShipPiece(s))

rotateButton.addEventListener('click', rotat_all)
shipArr[0].addEventListener('click', () => {
    angle[0] = angle[0] == 0 ? 90 : 0
    shipArr[0].style.transform = `rotate(${angle[0]}deg)`
})
shipArr[1].addEventListener('click', () => {
    angle[1] = angle[1] == 0 ? 90 : 0
    shipArr[1].style.transform = `rotate(${angle[1]}deg)`
})
shipArr[2].addEventListener('click', () => {
    angle[2] = angle[2] == 0 ? 90 : 0
    shipArr[2].style.transform = `rotate(${angle[2]}deg)`
})
shipArr[3].addEventListener('click', () => {
    angle[3] = angle[3] == 0 ? 90 : 0
    shipArr[3].style.transform = `rotate(${angle[3]}deg)`
})
shipArr[4].addEventListener('click', () => {
    angle[4] = angle[4] == 0 ? 90 : 0
    shipArr[4].style.transform = `rotate(${angle[4]}deg)`
})

// const optionShips = Array.from(optionContainer.children)
// optionShips.forEach(optionShip => optionShip)
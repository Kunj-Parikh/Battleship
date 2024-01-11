const gameContainer = document.getElementById("game-container")
const shipContainer = document.querySelector('.ship-container')
const rotateButton = document.querySelector('#rotate-button')
const shipArr = Array.from(shipContainer.children)
class Ship {
    constructor(name, length, angle) {
        this.name = name;
        this.length = length;
        this.angle = angle;
    }
    /**
     * @param {any} angle
     */
    set setAng(angle) {
        this.angle = angle
    }

    get getAng() {
        return this.angle
    }
}

const ship1 = new Ship('ship1', 2, 0)
const ship2 = new Ship('ship2', 2, 0)
const ship3 = new Ship('ship3', 3, 0)
const ship4 = new Ship('ship4', 3, 0)
const ship5 = new Ship('ship5', 4, 0)
const ships = [ship1, ship2, ship3, ship4, ship5]

function rotat_all() {
    for (let i = 0; i < ships.length; i++) {
        if (ships[i].getAng === 0) ships[i].setAng = 90
        else ships[i].setAng = 0
    } 
    for (let i = 0; i < 5; i++) {
        shipArr[i].style.transform = `rotate(${ships[i].getAng}deg)`
    }   
}
const side = 10;
function createBoard(color, user) {
    const board = document.createElement('div')
    board.classList.add('boards')
    board.style.backgroundColor = color
    board.id = user
    for (let i = 0; i < side * side; i++) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.id = i
        board.append(block)
    }
    gameContainer.append(board)
}

createBoard('gray', 'p')
createBoard('green', 'c')

let notDropped

function addShipPiece(user, ship, startId) {
    const pBlocks = document.querySelectorAll('#p div')
    user === 'p' ? console.log('p') : console.log('c')
    const cBlocks = document.querySelectorAll(`#${user} div`)
    // console.log(cBlocks)
    let randomBool = Math.random() < 0.5
    let isHorizontal = user === 'p' ? ship.getAng === 0 : randomBool
    let rsi = Math.floor(Math.random() * side * side)

    if (startId) {
        var pushH = startId
        var pushV = startId
    } else {
        var pushH_t = Math.floor(Math.random() * side) * side
        var pushH_o = Math.floor(Math.random() * (side + 1 - ship.length))
        var pushH = pushH_t + pushH_o

        var pushV_t = Math.floor(Math.random() * (side + 1 - ship.length)) * side
        var pushV_o = Math.floor(Math.random() * side)
        var pushV = pushV_t + pushV_o
    }

    /* boolean ensuring starting pos is valid */
    // let validStart = isHorizontal ? startIdx <= side * side - ship.length ? startIdx : side * side - ship.length : // horizontal check
    //     startIdx <= side * side - side * ship.length ? startIdx : startIdx - ship.length * side + side // vertical check

    let shipBlocks = []
    // Custom ship-generating algorithm cuz the one in the video doesn't work lol
        if (startId) {
            for (let i = 0; i < ship.length; i++) {
                if (isHorizontal) {
                    pushH = Number(pushH)
                    shipBlocks.push(pBlocks[i + (pushH)])
                    console.log(pBlocks[i+(pushH)])

                } else {
                    pushV = Number(pushV)
                    shipBlocks.push(pBlocks[i * side + pushV])
                    console.log(pBlocks[i*side+pushV])
                }
            }
        }
        else {
        for (let i=0; i<ship.length; i++) {
            if (isHorizontal) {
                shipBlocks.push(cBlocks[i+pushH])
            } else {
                shipBlocks.push(cBlocks[i*side+pushV])
            }
        }
    }
    
    let valid

    if (isHorizontal) {
        shipBlocks.every((_s, i) =>
            valid = shipBlocks[0].id % side !== side - (shipBlocks.length - (i + 1)))
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
        if (user === 'c') addShipPiece('c', ship)
        if (user === 'p') {
            console.log('player dropped')
            notDropped = true
        }
    }
}

ships.forEach(s => addShipPiece('c', s))

let curr_ship
const shipArrCopy = Array.from(shipContainer.children)
const pBlocks = document.querySelectorAll('#p div')
shipArrCopy.forEach(s => s.addEventListener('dragstart', testDragged))
pBlocks.forEach(b => {
    b.addEventListener('dragover', dragOver)
    b.addEventListener('drop', dropShip)
})

function testDragged(e) {
    notDropped = false
    curr_ship = e.target
}

function dragOver(e) {
    e.preventDefault()
    // e.originalEvent.dataTransfer.dropEffect = 'copy'
}

function dropShip(e) {
    const startID = e.target.id
    const ship = ships[curr_ship.id]
    console.log(ship)
    console.log(startID)
    addShipPiece('p', ship, startID)
    if(!notDropped) {
        // curr_ship.removeEventListener('dragover', testDragged)
        curr_ship.setAttribute('draggable', false)
        curr_ship.remove()
    }
}


rotateButton.addEventListener('click', rotat_all)
shipArr[0].addEventListener('click', () => {
    ships[0].setAng = ships[0].getAng === 0 ? 90 : 0
    shipArr[0].style.transform = `rotate(${ships[0].getAng}deg)`
})
shipArr[1].addEventListener('click', () => {
    ships[1].setAng = ships[1].getAng === 0 ? 90 : 0
    shipArr[1].style.transform = `rotate(${ships[1].getAng}deg)`
})
shipArr[2].addEventListener('click', () => {
    ships[2].setAng = ships[2].getAng === 0 ? 90 : 0
    shipArr[2].style.transform = `rotate(${ships[2].getAng}deg)`
})
shipArr[3].addEventListener('click', () => {
    ships[3].setAng = ships[3].getAng === 0 ? 90 : 0
    shipArr[3].style.transform = `rotate(${ships[3].getAng}deg)`
})
shipArr[4].addEventListener('click', () => {
    ships[4].setAng = ships[4].getAng === 0 ? 90 : 0
    shipArr[4].style.transform = `rotate(${ships[4].getAng}deg)`
})
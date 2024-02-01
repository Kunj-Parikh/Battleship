const gameContainer = document.getElementById('game-container')
const shipContainer = document.querySelector('.ship-container')
const rotateButton = document.querySelector('#rotate-button')
const startButton = document.querySelector('#start-button')
const infoDisplay = document.querySelector('#info')
const turnDisplay = document.querySelector('#turn-display')

const spButton = document.querySelector('#spButton')
const mpButton = document.querySelector('#mpButton')

let shipArr = Array.from(shipContainer.children)
let gameMode = ''
let curPlayer = 'user'
let playerNum = 0
let ready = false
let enemyReady = false
let allShipsPlaced = false
let shotFired = -1
let gameOver = false

spButton.addEventListener('click', startSp)
mpButton.addEventListener('click', startMp)


class Ship {
    constructor(name, length, angle) {
        this.name = name
        this.length = length
        this.angle = angle
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
const ship2 = new Ship('ship2', 3, 0)
const ship3 = new Ship('ship3', 3, 0)
const ship4 = new Ship('ship4', 4, 0)
const ship5 = new Ship('ship5', 5, 0)
const ships = [ship1, ship2, ship3, ship4, ship5]

const side = 10
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
const cBlocks = document.querySelectorAll('#c div')
const pBlocks = document.querySelectorAll('#p div')

function startSp() {
    gameMode = 'sp'
    ships.forEach(s => addShipPiece('c', s))

    startButton.addEventListener('click', playSp)
}

let socket
function startMp() {
    socket = io()

    gameMode = 'mp'
    socket.on('pNum', num => {
        if (num === -1) {
            infoDisplay.innerHTML = 'Full! For now'
        } else {
            playerNum = Number(num)
            if (playerNum === 1) {
                curPlayer = "enemy"
            }
            // console.log(`${playerNum} connected`)

            socket.emit('check-players')
        }
    })
    socket.on('pCon', num => {
        // console.log(`Player ${num} has joined/left :D`)
        joinLeave(num)
    })
    socket.on('eReady', num => {
        enemyReady = true
        pReady(num)
        if (ready) playMp(socket)
    })

    socket.on('check-players', players => {
        players.forEach((e, i) => {
            if (e.connected) joinLeave(i)
            if (e.ready) {
                pReady(i)
                if (i !== playerNum) enemyReady = true
            }
        })
    })

    startButton.addEventListener('click', () => {
        if (allShipsPlaced) playMp(socket)
        else infoDisplay.innerHTML = 'Please place your ships.'
    })

    cBlocks.forEach(s => {
        s.addEventListener('click', handleClick)
    })

    socket.on('fire', id => {
        enemyGo(id)
        shotFired = id;
        const s = pBlocks[id]
        socket.emit('fire-reply', s.classList)
        console.log(`client hear fire: id: ${id}`)
        playMp(socket)
    })

    socket.on('fire-reply', cl => {
        console.log(`client hear fire-reply: cl: ${cl}`)
        revealSquare(shotFired, cl)
        playMp(socket)
    })


    // let isJoin = true
    function joinLeave(num) {
        let pNum = Number(num) + 1
        console.log('changing con')
        document.getElementById(`con${pNum}`).classList.toggle('juice')
        document.getElementById(`p${pNum}-con`).style.fontWeight = 'bold'
        if (Number(num) === playerNum) {
            // console.log(`.p${playerNum}`)
            // console.log(`.p${playerNum + 1}-tag`)
            document.querySelector(`#p${playerNum + 1}-tag`).style.fontWeight = 'bold'
        }
        // isJoin = !isJoin
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

function rotat_all() {
    for (let i = 0; i < ships.length; i++) {
        if (ships[i].getAng === 0) ships[i].setAng = 90
        else ships[i].setAng = 0
    }
    for (let i = 0; i < shipArr.length; i++) {
        console.log('transforming ' + i)
        shipArr[i].style.transform = `rotate(${ships[shipArr[i].id].getAng}deg)`
    }
}


let notDropped

function getValidity(blocks, isHorizontal, startId, ship) {
    console.log('blocks: ' + blocks)
    console.log('isHorizontal: ' + isHorizontal)
    console.log('startId: ' + startId)
    console.log('ship: ' + ship)
    if (startId || startId === 0) {
        var pushH = startId
        var pushV = startId
    }
    else {
        var pushH_t = Math.floor(Math.random() * side) * side
        var pushH_o = Math.floor(Math.random() * (side + 1 - ship.length))
        var pushH = pushH_t + pushH_o

        var pushV_t = Math.floor(Math.random() * (side + 1 - ship.length)) * side
        var pushV_o = Math.floor(Math.random() * side)
        var pushV = pushV_t + pushV_o
    }


    let shipBlocks = []
    if (startId || startId === 0) {
        for (let i = 0; i < ship.length; i++) {
            if (isHorizontal) {
                pushH = Number(pushH)
                shipBlocks.push(blocks[i + (pushH)])
                // console.log(blocks[i + (pushH)])

            } else {
                pushV = Number(pushV)
                shipBlocks.push(blocks[i * side + pushV])
                console.log(blocks[i * side + pushV])
            }
        }
    }
    else {
        for (let i = 0; i < ship.length; i++) {
            if (isHorizontal) {
                shipBlocks.push(blocks[i + pushH])
            } else {
                shipBlocks.push(blocks[i * side + pushV])
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

    const notTaken = shipBlocks.every(s => (!s.classList.contains('taken<3') && !s.classList.contains('miss')))

    return { shipBlocks, valid, notTaken }
}



function addShipPiece(user, ship, startId) {

    // let validStart = isHorizontal ? startIdx <= side * side - ship.length ? startIdx : side * side - ship.length : // horizontal check
    //     startIdx <= side * side - side * ship.length ? startIdx : startIdx - ship.length * side + side // vertical check

    // const pBlocks = document.querySelectorAll('#p div')
    //user === 'p' ? console.log('p') : console.log('c')
    const uBlocks = document.querySelectorAll(`#${user} div`)
    let randomBool = Math.random() < 0.5
    let isHorizontal = user === 'p' ? ship.getAng === 0 : randomBool
    // let rsi = Math.floor(Math.random() * side * side)

    const { shipBlocks, valid, notTaken } = getValidity(uBlocks, isHorizontal, startId, ship)

    if (valid && notTaken) {
        shipBlocks.forEach(s => {
            s.classList.add(ship.name)
            s.classList.add('taken<3')

        })
    }
    else {
        if (user === 'c') addShipPiece('c', ship)
        if (user === 'p') {
            notDropped = true
        }
    }
}


let curr_ship
let shipArrCopy = Array.from(shipContainer.children)
shipArrCopy.forEach(s => s.addEventListener('dragstart', testDragged))
pBlocks.forEach(b => {
    b.addEventListener('dragover', dragOver)
    b.addEventListener('drop', dropShip)
    b.addEventListener('click', returnShip)
})

function testDragged(e) {
    notDropped = false
    curr_ship = e.target
}

function dragOver(e) {
    e.preventDefault()
}

function dropShip(e) {
    const startID = e.target.id
    const ship = ships[curr_ship.id]
    // console.log(shipName)
    // console.log(ship)
    // console.log(curr_ship.id)
    // console.log(startID)
    addShipPiece('p', ship, startID)
    shipArr.splice(curr_ship.id, 1)
    shipArrCopy.splice(curr_ship.id, 1)
    if (!notDropped) {
        // curr_ship.removeEventListener('dragover', testDragged)
        curr_ship.setAttribute('draggable', false)
        curr_ship.remove()
    }
    if (!shipContainer.querySelector('.ship')) allShipsPlaced = true
}

var pushBack = 0
function returnShip(e) {
    console.log(e.target.classList)
    if (e.target.classList.contains("taken<3")) {
        let shipName = e.target.classList[1]
        // -- let shipPreview = e.target.c
        //e.target.classList.remove(shipName)
        pBlocks.forEach((b) => {
            if (b.classList.contains(shipName)) {
                b.classList.remove(shipName, "taken<3")
            }
        })

        let shipNum = shipName.substring(4, 5)
        const newShip = document.createElement('div')
        newShip.id = shipNum - 1
        newShip.classList.add(`${shipName}-preview`)
        newShip.classList.add(`${shipName}`)
        newShip.classList.add('ship')
        newShip.draggable = true
        shipContainer.appendChild(newShip)
        shipArr = Array.from(shipContainer.children)
        shipArrCopy = Array.from(shipContainer.children)

        ships[newShip.id].setAng = 0

        // Check for buggy code below(probably fixed but maybe some bug still remains???)
        for (let i = 0; i < shipArr.length; i++) {
            let new_elm = shipArr[i].cloneNode(true)
            shipArr[i].parentNode.replaceChild(new_elm, shipArr[i])
            new_elm.addEventListener('click', () => {
                ships[new_elm.id].setAng = ships[new_elm.id].getAng === 0 ? 90 : 0
                new_elm.style.transform = `rotate(${ships[new_elm.id].getAng}deg)`
            })
            shipArr[i] = new_elm
            shipArrCopy[i] = new_elm
        }

        shipArrCopy.forEach(s => s.addEventListener('dragstart', testDragged))
    }
}


let playerTurn

function playSp() {
    if (playerTurn === undefined) {
        const allBoardBlocks = document.querySelectorAll('#c div')
        allBoardBlocks.forEach(b => b.addEventListener('click', handleClick))

        if (shipContainer.children.length !== 0) {
            infoDisplay.textContent = 'Please place your ships.'
        } else {
            const allBoardBlocks = document.querySelectorAll('#c div')
            allBoardBlocks.forEach(b => b.addEventListener('click', handleClick))
            playerTurn = true
            turnDisplay.textContent = 'Your turn'
            infoDisplay.textContent = 'Game has started.'
        }

    }
}

function playMp(socket) {
    if (gameOver) return
    if (!ready) {
        socket.emit('pReady')
        ready = true
        pReady(playerNum)
    }

    if (enemyReady) {
        if (curPlayer === 'user') {
            turnDisplay.innerHTML = 'Your turn'
        }
        if (curPlayer === 'enemy') {
            turnDisplay.innerHTML = 'Opponent\'s turn'
        }
    }

}

let isReady = true
function pReady(num) {
    // console.log('changing red')
    let pNum = Number(num) + 1
    document.getElementById(`red${pNum}`).classList.toggle('juice')
    document.getElementById(`p${pNum}-red`).style.fontWeight = 'bold'
    // isReady = !isReady
}


let pHits = []
let cHits = []
let pTotal = []
let cTotal = []
// Player/Computer Sunk Ships (P/CSS)
let pss = []
let css = []

function handleClick(e) {
    let eSq
    if (gameMode === 'mp') {
        if (curPlayer === 'user' && ready && enemyReady) {
            console.log('if condition has activated!')
            // console.log('e ' + e)
            shotFired = e.target.id
            console.log(`client emit fire, shotFired: ${shotFired}`)
            eSq = document.querySelectorAll('#c div')[shotFired]
            console.log(`shotFired: ${shotFired}`)
            socket.emit('fire', shotFired)
        }
    } else eSq = e
    if (!gameOver) {
        if (gameMode === 'sp') {
            if (pTotal.includes(e.target.id)) {
                infoDisplay.textContent = 'You have already shot there. Try again.'
                return
            } else revealSquare(e)
            pTotal.push(e.target.id)
            playerTurn = false

            const cBlocks = document.querySelectorAll('#c div')
            cBlocks.forEach(b => b.replaceWith(b.cloneNode(true)))
            cBlocks.forEach(s => {
                s.addEventListener('click', handleClick)
            })

            setTimeout(enemyGo, 1000)
        }
        else if (gameMode === 'mp') {
            // const socket = io()
            // socket.emit('fire', eSq.id)
            if (pTotal.includes(eSq.id)) {
                infoDisplay.textContent = 'You have already shot there. Try again.'
                return
            } else revealSquare(eSq)
            pTotal.push(eSq.id)
            playerTurn = false

            const cBlocks = document.querySelectorAll('#c div')
            cBlocks.forEach(b => b.replaceWith(b.cloneNode(true)))
            cBlocks.forEach(s => {
                s.addEventListener('click', handleClick)
            })
            // setTimeout(enemyGo, 1000)
        }
    }
}

function revealSquare(e, cl) {
    // console.log(`preliminary: ${e}`)
    console.log(`shotFired: ${shotFired}`)
    var eSq = -1
    console.log(cl)

    // console.log('eSq: ' + e)
    // console.log(obj)
    if (shotFired !== -1) {
        eSq = document.querySelectorAll('#c div')[shotFired]
        console.log(`eSq has been defined as: ${eSq}`)
        console.log('reveal square executed')
        console.log(shotFired)
    } else {
        eSq = e
        console.log(`eSq has been defined as: ${eSq}`)
    }
    if (gameMode === 'sp') {
        if (eSq.target.classList.contains('taken<3')) {
            eSq.target.classList.add("shot")

            infoDisplay.textContent = `Computer ship has been shot, at position (${e.target.id % 10 + 1}, ${Math.floor(e.target.id / 10) + 1})`
            let classes = Array.from(eSq.target.classList)
            classes = classes.filter(n => n !== 'block')
            classes = classes.filter(n => n !== 'shot')
            classes = classes.filter(n => n !== 'taken<3')
            pHits.push(...classes)
            console.log(classes)
            checkScore('p', pHits, pss) 
        } else {
            infoDisplay.textContent = 'You missed!'
            eSq.target.classList.add('miss')
        }

    }
    else if (gameMode === 'mp' && (cl !== undefined)) {
        var obj = Object.values(cl)
        console.log(eSq)
        if (obj.includes('taken<3')) {
            eSq.classList.add("shot")
            infoDisplay.textContent = `Enemy ship has been shot, at position (${eSq.id % 10 + 1}, ${Math.floor(eSq.id / 10) + 1})`
            let classes = Array.from(cl)
            classes = classes.filter(n => n !== 'block')
            classes = classes.filter(n => n !== 'shot')
            classes = classes.filter(n => n !== 'taken<3')
            pHits.push(...classes)
            checkScore('p', pHits, pss)
        } else {
            infoDisplay.textContent = 'You missed!'
            eSq.classList.add('miss')
        }
        curPlayer = 'enemy'
    }
    
}

function enemyGo(sq) {
    console.log(sq)
    console.log(`gameMode: ${gameMode}`)
    if (!gameOver) {
        turnDisplay.textContent = "Computer's turn"
        infoDisplay.textContent = 'Computer thinking...'
        setTimeout(() => {
            if (gameMode === 'sp') {
                console.log('generate')
                sq = Math.floor(Math.random() * side * side)
            // Reload sq until it is not in cTotal
            while (cTotal.includes(sq)) {
                console.log('re-generate')
                sq = Math.floor(Math.random() * side * side)
            }
        }
            cTotal.push(sq)
            const pBlocks = document.querySelectorAll('#p div')
            // console.log(`pBlocks: ${pBlocks}. sq: ${sq}`)
            if (pBlocks[sq].classList.contains('taken<3') && pBlocks[sq].classList.contains('shot')) { // Something here 
                console.log('retry')
                enemyGo()
                return
            } else if (pBlocks[sq].classList.contains('taken<3') && !pBlocks[sq].classList.contains('shot')) {
                console.log('hit')
                pBlocks[sq].classList.add('shot')
                infoDisplay.textContent = `Computer shot your ship at position ${pBlocks[sq].id}`
                let classes = Array.from(pBlocks[sq].classList)
                classes = classes.filter(n => n !== 'block')
                classes = classes.filter(n => n !== 'shot')
                classes = classes.filter(n => n !== 'taken<3')
                cHits.push(...classes)
                checkScore('c', cHits, css)
            } else {
                // console.log('miss')
                infoDisplay.textContent = `Computer missed at position ${pBlocks[sq].id}`
                pBlocks[sq].classList.add('miss')
            }

        }, 1000)

        setTimeout(() => {
            playerTurn = true
            turnDisplay.textContent = 'Your turn'
            infoDisplay.textContent = 'Please take your turn'
            const cBlocks = document.querySelectorAll('#c div')
            cBlocks.forEach(b => b.addEventListener('click', handleClick))
        }, 2000)
        curPlayer = 'user'
    }
}

function checkScore(usr, usr_hits, usr_ss) {
    function checkShip(sname, length) {
        if (usr_hits.filter(hit => hit === sname).length === length) {
            infoDisplay.textContent = `${usr} has sunk the opponent's ship named ${sname}!`
            if (usr === 'p') {
                pHits = usr_hits.filter(ship => ship !== sname)
            } else if (usr === 'c') {
                cHits = usr_hits.filter(ship => ship !== sname)
            }
            usr_ss.push(sname)
        }
    }

    ships.forEach(s => checkShip(s.name, s.length))

    if (pss.length === 5) {
        infoDisplay.textContent = "You won by sinking all of the computer's ships"
        gameOver = true
    }
    if (css.length === 5) {
        infoDisplay.textContent = 'Computer sunk all your ships. How could you lose to such a trash program.'
        gameOver = true
    }
}
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

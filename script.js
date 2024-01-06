const shipContainer = document.querySelector('.ship-container');
const rotateButton = document.querySelector('#rotate-button');
const ship1 = document.querySelector('.ship1-preview');
const ship2 = document.querySelector('.ship2-preview');
const ship3 = document.querySelector('.ship3-preview');
const ship4 = document.querySelector('.ship4-preview');
const ship5 = document.querySelector('.ship5-preview'); /* idk if this is the best way to this(create 5 variables for each ship?) */
const shipArr = {ship1, ship2, ship3, ship4, ship5}

let angle1 = 0;
let angle2 = 0;
let angle3 = 0;
let angle4 = 0;
let angle5 = 0;

function rotat_all() {
    angle1 = angle1 === 0 ? 90 : 0
    angle2 = angle2 === 0 ? 90 : 0
    angle3 = angle3 === 0 ? 90 : 0
    angle4 = angle4 === 0 ? 90 : 0
    angle5 = angle5 === 0 ? 90 : 0
    angles = [angle1, angle2, angle3, angle4, angle5]
    const shipArr = Array.from(shipContainer.children)
    for(let i=0; i<5; i++) {
        shipArr[i].style.transform = `rotate(${angles[i]}deg)`
    }

}

rotateButton.addEventListener('click', rotat_all)
ship1.addEventListener('click', ()=> {
    angle1 = angle1 == 0 ? 90 : 0
    ship1.style.transform = `rotate(${angle1}deg)`
})
ship2.addEventListener('click', ()=> {
    angle2 = angle2 == 0 ? 90 : 0
    ship2.style.transform = `rotate(${angle2}deg)`
})
ship3.addEventListener('click', ()=> {
    angle3 = angle3 == 0 ? 90 : 0
    ship3.style.transform = `rotate(${angle3}deg)`
})
ship4.addEventListener('click', ()=> {
    angle4 = angle4 == 0 ? 90 : 0
    ship4.style.transform = `rotate(${angle4}deg)`
})
ship5.addEventListener('click', () => {
    angle5 = angle5 == 0 ? 90 : 0
    ship5.style.transform = `rotate(${angle5}deg)`
})

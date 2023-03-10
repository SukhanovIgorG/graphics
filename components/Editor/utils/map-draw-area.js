import { directionOff } from "./map-directions"
import { vectorOff } from "./map-directions-vector"
import { drawLineOff } from "./map-draw-line"

const drawArea = document.querySelector('.draw-textures')

function drawAreaOff() {
    drawArea.classList.remove('active')
    drawArea.firstElementChild.classList.remove('red-text')
    drawArea.firstElementChild.classList.add('blue-grey-text')
}

function drawAreaOn() {
    directionOff()
    vectorOff()
    drawLineOff()
    drawArea.classList.add('active')
    drawArea.firstElementChild.classList.add('red-text')
    drawArea.firstElementChild.classList.remove('blue-grey-text')
}

drawArea.addEventListener('click', () => {
    event.preventDefault()
    if (drawArea.classList.contains('active')) {
        drawAreaOff()
    } else {
        drawAreaOn()
    }
})

export { drawArea, drawAreaOff, drawAreaOn }

import { drawLineOff } from './map-draw-line'
import { directionOn, directionOff } from './map-directions'
import { directionAttribute } from './map-direction-att'

const vector = document.querySelector('.vector')

function vectorOff() {
    directionAttribute.vector = false
    directionAttribute.dasharray = 0
    vector.classList.remove('active')
    vector.firstElementChild.classList.remove('red-text')
    vector.firstElementChild.classList.add('blue-grey-text')
}

function vectorOn() {
    drawLineOff()
    directionOn()
    directionAttribute.vector = true
    directionAttribute.dasharray = 10
    vector.classList.add('active')
    vector.firstElementChild.classList.add('red-text')
    vector.firstElementChild.classList.remove('blue-grey-text')
}

vector.addEventListener('click', () => {
    event.preventDefault()
    if (vector.classList.contains('active')) {
        vectorOff()
    } else {
        vectorOn()
    }
})

export { vector, vectorOff, vectorOn }

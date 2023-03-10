import {options} from './map-options'
import { drawLineOff } from './map-draw-line'
import { vectorOff } from './map-directions-vector'
import { drawAreaOff} from './map-draw-area'
import { directionTypeOff } from './map-direction-type'

let preColor = options.color
let preWidth = options.width
let preDash = options.dasharray
const directions = document.querySelector('.directions')

function directionOff() {
    directions.classList.remove('active')
    directions.firstElementChild.classList.remove('red-text')
    directions.firstElementChild.classList.add('blue-grey-text')
    options.color = preColor
    options.width = preWidth
    options.dasharray = preDash
    vectorOff()
    directionTypeOff()
}

function directionOn() {
    drawLineOff()
    drawAreaOff()
    directions.classList.add('active')
    directions.firstElementChild.classList.add('red-text')
    directions.firstElementChild.classList.remove('blue-grey-text')
    options.width = 1
    options.dasharray = 0
    options.color = 'black'
}

directions.addEventListener('click', () => {
    event.preventDefault()
    if (directions.classList.contains('active')) {
        directionOff()
    } else {
        directionOn()
    }
})

export { directions, directionOff, directionOn }

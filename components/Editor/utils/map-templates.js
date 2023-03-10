import { options } from './map-options.js'
import { drawAreaOff } from './map-draw-area'
import { drawLineOff } from './map-draw-line'
import { directionOff } from './map-directions'

let prevEl = null

function setOptions (el) {
    let temp = el.dataset.template
    if (prevEl) {
        prevEl.classList.remove('active')
        el.classList.add('active')
        prevEl = el
    } else {
        el.classList.add('active')
        prevEl = el
    }
    if (temp == 'room') {
        options.fill = 'rgba(255, 255, 0, 0.3)'
        options.width = '1'
        options.color = 'black'
        options.dasharray = 0
    }
    if (temp == 'invisible') {
        options.fill = 'rgba(0, 255, 255, 0.1)'
        options.width = '1'
        options.color = 'black'
        options.dasharray = 10
    }
    if (temp == 'hollow') {
        options.fill = 'url(#diagonalHatch)'
        options.width = '1'
        options.color = 'black'
        options.dasharray = 0
    }
    if (temp == 'floor') {
        options.fill = 'none'
        options.width = '1'
        options.color = 'black'
        options.dasharray = 0
    }
    if (temp == 'base') {
        options.fill = 'none'
        options.width = '1'
        options.color = 'black'
        options.dasharray = 10
    }
}

export default function () {
    let tempBtns = document.querySelectorAll('#template li')
    tempBtns.forEach(el =>
        el.addEventListener('click', () => {
            drawAreaOff()
            drawLineOff()
            directionOff()
            setOptions(el)
        })
        )
}


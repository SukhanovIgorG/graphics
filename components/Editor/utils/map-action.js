import {drawLineOff} from './map-draw-line'
import {directionOff} from './map-directions'
import {vectorOff} from './map-directions-vector'
import {drawAreaOff} from './map-draw-area'

function actionOn() {
    action_btn.classList.add('active')
    action_btn.firstElementChild.classList.add('red-text')
    action_btn.firstElementChild.classList.remove('green-text')
    action_btn.firstElementChild.innerHTML = 'pause'
}

function actionOff() {
    action_btn.classList.remove('active')
    action_btn.firstElementChild.classList.remove('red-text')
    action_btn.firstElementChild.classList.add('green-text')
    action_btn.firstElementChild.innerHTML = 'play_arrow'
    directionOff()
    vectorOff()
    drawLineOff()
    drawAreaOff()
}

let action_btn = document.querySelector('.start_draw')
action_btn.addEventListener('click', () => {
    if (action_btn.classList.contains('active')) {
        actionOff()
    } else {
        actionOn()
    }
})

export { action_btn, actionOn, actionOff }

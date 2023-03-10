import { options } from './map-options.js'

export default function () {
    let wall = document.querySelector('.wrapper_walls')
    wall?.addEventListener('click', ()=>{
        if (wall.classList.contains('active')) {
            wall.classList.remove('active')
            wall.firstElementChild.classList.remove('red-text')
            wall.firstElementChild.classList.add('blue-grey-text')
            options.fill = 'rgba(0, 0, 0, 0.03)'
            options.dasharray = 0
        } else {
            wall.classList.add('active')
            wall.firstElementChild.classList.add('red-text')
            wall.firstElementChild.classList.remove('blue-grey-text')
            options.fill = 'none'
            options.dasharray = 10
        }
    })
}


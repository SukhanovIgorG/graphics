import { directionAttribute } from './map-direction-att'

let prevEl = null
const logoBtn = document.querySelector('.direct-type i')
const defaultLogo = 'device_hub'

export const directTypeColor = {
    walk: 'black',
    bus: 'green',
    train: 'blue'
}

export function directionTypeOff() {
    logoBtn.textContent = defaultLogo
    logoBtn.classList.remove('red-text')
    logoBtn.classList.add('blue-grey-text')
    directionAttribute.type = 'walk'
    directionAttribute.color = directTypeColor['walk']
}

function setType (el) {
    let type = el.dataset.dirtype
    let logo = el.querySelector('i').textContent
    if (prevEl) {
        prevEl.classList.remove('active')
        el.classList.add('active')
        prevEl = el
    } else {
        el.classList.add('active')
        prevEl = el
    }
    directionAttribute.type = type
    directionAttribute.color = directTypeColor[type]
    console.log(directTypeColor[type])
    logoBtn.textContent = logo
    logoBtn.classList.remove('blue-grey-text')
    logoBtn.classList.add('red-text')
}

export default function () {
    let Btns = document.querySelectorAll('#direct-type li')
    Btns.forEach(el =>
        el.addEventListener('click', () => setType(el))
        )
}


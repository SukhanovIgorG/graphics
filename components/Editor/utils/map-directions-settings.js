import { _group, _directions, _lines } from './map-set-object.js'
import { closeLableSettings } from './map-lable-settings.js'
import { setMapHistory } from './map-history.js'
import { directTypeColor } from './map-direction-type.js'

// Разворачиваем путь
function inversion (target, circle) {
    if (circle.dataset.vector == 'start') {
        _directions[target.dataset.group][circle.dataset.object].data_vector = 'finish'
        circle.dataset.vector = 'finish'
    } else if (circle.dataset.vector == 'finish') {
        circle.dataset.vector = 'start'
        _directions[target.dataset.group][circle.dataset.object].data_vector = 'start'
    }
}

function createModalWindow() {
    const lX = event.pageX
    const lY = event.pageY
    const col = document.createElement('div')
    col.className = 'col edit_lable_mod'
    col.style.width = 'auto'
    col.style.position = 'absolute'
    col.style.top = `${lY}px`
    col.style.left = `${lX + 100}px`
    col.style.backgroundColor = 'rgba(255, 255, 255, .5)'
    const objSettings = document.querySelector('.edit_direction_item').content.cloneNode(true)
    const wrapper = document.querySelector('.push')
    col.appendChild(objSettings)
    wrapper.appendChild(col)
}

function ShowModalForDirections(event) {
    if ( event.target !== null ) {
    event.preventDefault()
    closeLableSettings()
    createModalWindow()

    const currentDirectGroup = event.currentTarget
    const direction = currentDirectGroup.firstChild
    const path = currentDirectGroup.querySelector('path')
    const stroke = path.getAttribute('stroke')
    const dasharray = path.getAttribute('stroke-dasharray')
    const circles = currentDirectGroup.querySelectorAll('circle')

    // --- проверка состояния
    if ( dasharray == 0 ) {
        document.querySelector('#two').setAttribute('checked', 'true')
    } else if ( dasharray > 0 ) {
        document.querySelector('#one').setAttribute('checked', 'true')
    }
    if ( stroke  == 'black') {
        document.querySelector('#walk').setAttribute('checked', 'true')
    } else if ( stroke == 'green') {
        document.querySelector('#bus').setAttribute('checked', 'true')
    } else if ( stroke == 'blue') {
        document.querySelector('#train').setAttribute('checked', 'true')
    }

    const settings = document.querySelector('#direction-settings')

    settings.onclick = (e)=> {
        if ( e.target.id !== '' ) {
            if (e.target.id == 'one') {
                path.setAttribute('stroke-dasharray', '10')
                circles[0].setAttribute('data-vector', 'finish')
                circles[circles.length-1].setAttribute('data-vector', 'start')
                _directions[direction.dataset.group]['stroke-dasharray']='10'
            }
            if (e.target.id == 'two') {
                path.setAttribute('stroke-dasharray', '0')
                circles.forEach(circle=>{circle.setAttribute('data-vector', 'none')})
                _directions[direction.dataset.group]['stroke-dasharray']='0'
            }
            if (e.target.id == 'walk') {
                path.setAttribute('stroke', directTypeColor['walk'])
                _directions[direction.dataset.group]['stroke'] = directTypeColor['walk']
            }
            if (e.target.id == 'bus') {
                path.setAttribute('stroke', directTypeColor['bus'])
                _directions[direction.dataset.group]['stroke'] = directTypeColor['bus']
            }
            if (e.target.id == 'train') {
                path.setAttribute('stroke', directTypeColor['train'])
                _directions[direction.dataset.group]['stroke'] = directTypeColor['train']
            }
            if (e.target.id == 'inversion') {
                path.getAttribute('stroke-dasharray') == 0 ?
                M.toast({ html: `<span>Изменить направление можно только у одностороннего пути!</span>`, classes: 'rounded pulse bad' })
                :
                inversion(direction, circles[0])
                inversion(direction, circles[circles.length - 1])
            }
        }
    }
    setMapHistory()
    }
}

export { ShowModalForDirections }

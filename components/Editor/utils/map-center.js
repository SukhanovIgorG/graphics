import { CreateTag } from './map-create-tag.js'
import { snapToGrid } from './map-snap-to-grid.js'
import { panned, svgWrapper, panZoom } from './map-new.js'
import { ccb } from './map-ccb.js'
import { qcb } from './map-qcb.js'
import {svg} from "./map-size";

const CreateCenter = (x, y) => {
    let pX = x
    let pY = y
    let snap = snapToGrid([pX, pY])
    let point = CreateTag('circle', {
        'cx': snap[0],
        'cy': snap[1],
        'id': 'center_point'
    })
    let centerY = CreateTag('text', {
        'x': 0 - (snap[1] - 14),
        'y': snap[0] + 4.5,
        'id': 'y_text'
    })
    let centerX = CreateTag('text', {
        'x': snap[0] + 14,
        'y': snap[1] + 4.5,
        'id': 'x_text'
    })
    centerX.textContent = `${snap[0]}`
    centerY.textContent = `${snap[1]}`
    centerY.setAttribute('transform', 'rotate(-90)')
    panned.appendChild(point)
    panned.appendChild(centerY)
    panned.appendChild(centerX)
    point.addEventListener('mousedown', DragCenter)
    panZoom.pan({ x: -snap[0]/2, y: -snap[1]/2 });
}

function DragCenter() {
    let point = event.target
    let transformM = window.getComputedStyle(panned).getPropertyValue("transform").match(/(-?[0-9\.]+)/g)
    let snap = []
    if (!event.ctrlKey && qcb.classList.contains('active') == false && ccb.classList.contains('active') == false) {
        moveAt(event)
        function moveAt(event) {
            let dX = (event.clientX - svgWrapper.offsetLeft - svgWrapper.offsetParent.offsetLeft - transformM[4]) / transformM[0]
            let dY = (event.clientY - svgWrapper.offsetTop - svgWrapper.offsetParent.offsetTop + scrollY - transformM[5]) / transformM[3]
            snap = snapToGrid([dX, dY])
            point.setAttribute('cx', `${snap[0]}`)
            point.setAttribute('cy', `${snap[1]}`)
            y_text.setAttribute('x', `${0 - (snap[1] - 14)}`)
            y_text.setAttribute('y', `${snap[0] + 4.5}`)
            y_text.textContent = `${snap[1]}`
            x_text.setAttribute('x', `${snap[0] + 14}`)
            x_text.setAttribute('y', `${snap[1] + 4.5}`)
            x_text.textContent = `${snap[0]}`
        }
        document.onmousemove = function (event) {
            moveAt(event)
        }
        document.onmouseup = function (event) {
            document.onmousemove = null
            document.onmouseup = null
        }
    } else if (event.ctrlKey) {
        let point = event.target
        if (point.classList.contains('active')) {
            point.classList.remove('active')
        } else {
            point.classList.add('active')
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (location.pathname.includes('edit')) {
        fetch(`./getmap/${location.pathname.substr(location.pathname.length - 24)}`, {
            method: 'get'
        }).then(res => res.json())
            .then(response => {
                CreateCenter(response.center[0], response.center[1])
            }).catch((err) => {
                console.log(err)
            })
    } else {
        CreateCenter(0, 0)
    }
})

export { CreateCenter }

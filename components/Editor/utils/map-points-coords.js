import { CreateTag } from './map-create-tag.js'
import { panned } from './map-new.js'

function createCoords() {
    if (event.ctrlKey) {
        let pX = event.target.getAttribute('cx')
        let pY = event.target.getAttribute('cy')
        let centerY = CreateTag('text', {
            'x': 0 - (+pY - 14),
            'y': +pX + 4.5,
            'id': 'y_coord'
        })
        let centerX = CreateTag('text', {
            'x': +pX + 14,
            'y': +pY + 4.5,
            'id': 'x_coord'
        })
        centerX.textContent = `${+pX}`
        centerY.textContent = `${+pY}`
        centerY.setAttribute('transform', 'rotate(-90)')
        panned.appendChild(centerY)
        panned.appendChild(centerX)
    }
}

function removeCoords() {
    let y_c = document.querySelectorAll('#y_coord')
    let x_c = document.querySelectorAll('#x_coord')
    if (y_c) {
        for (let i = 0; i < y_c.length; i++) {
            y_c[i].remove()
        }
    }
    if (x_c) {
        for (let i = 0; i < x_c.length; i++) {
            x_c[i].remove()
        }
    }
}

export { createCoords, removeCoords }

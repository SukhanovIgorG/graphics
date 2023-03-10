import { qcb } from './map-qcb.js'
import { CreateName, z, DragPoint } from './map-new.js'
import { _group, _directions } from './map-set-object.js'
import { CreateTag } from './map-create-tag.js'
import { Reorder } from './map-reorder.js'
import { retPath } from './map-ret-path.js'

const ccb = document.querySelector('.ccb')

ccb.addEventListener('click', () => {
    event.preventDefault()
    if (ccb.classList.contains('active')) {
        ccb.classList.remove('active')
        ccb.firstElementChild.classList.remove('red-text')
        ccb.firstElementChild.classList.add('blue-grey-text')
    } else {
        ccb.classList.add('active')
        if (qcb.classList.contains('active')) {
            qcb.classList.remove('active')
            qcb.firstElementChild.classList.remove('red-text')
            qcb.firstElementChild.classList.add('blue-grey-text')
        }
        ccb.firstElementChild.classList.add('red-text')
        ccb.firstElementChild.classList.remove('blue-grey-text')
    }
})

const CreateCCB = (item) => {
    if (item.dataset.type == 'L' && item.id !== 'point_dir') {
        let group = item.parentNode
        let path = group.querySelector('path')
        let pointMain = CreateTag('circle', {
            'cx': (+item.getAttributeNS(null, 'cx') + 20).toString(),
            'cy': (+item.getAttributeNS(null, 'cy') + 20).toString(),
            'id': 'point',
            'data-object': CreateName(),
            'data-group': `${group.dataset.main}`,
            'data-type': 'C'
        })
        group.insertBefore(pointMain, item)
        let pointSecond = CreateTag('circle', {
            'cx': (+item.getAttributeNS(null, 'cx') + 40).toString(),
            'cy': (+item.getAttributeNS(null, 'cy') + 40).toString(),
            'id': 'point',
            'data-object': CreateName(),
            'data-group': `${group.dataset.main}`,
            'data-type': ''
        })
        group.insertBefore(pointSecond, item)
        item.dataset.type = ''
        Reorder(group)
        path.setAttributeNS(null, 'd', `${retPath(_group[item.dataset.group])}${z}`) //z
        pointMain.addEventListener('mousedown', DragPoint)
        pointSecond.addEventListener('mousedown', DragPoint)
    }
}

export { ccb, CreateCCB }

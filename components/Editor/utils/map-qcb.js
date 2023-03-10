import { ccb } from './map-ccb.js'
import { CreateName, z, DragPoint } from './map-new.js'
import { _group, _directions } from './map-set-object.js'
import { CreateTag } from './map-create-tag.js'
import { Reorder } from './map-reorder.js'
import { retPath } from './map-ret-path.js'

const qcb = document.querySelector('.qcb')

qcb.addEventListener('click', () => {
    event.preventDefault()
    if (qcb.classList.contains('active')) {
        qcb.classList.remove('active')
        qcb.firstElementChild.classList.remove('red-text')
        qcb.firstElementChild.classList.add('blue-grey-text')
    } else {
        qcb.classList.add('active')
        if (ccb.classList.contains('active')) {
            ccb.classList.remove('active')
            ccb.firstElementChild.classList.remove('red-text')
            ccb.firstElementChild.classList.add('blue-grey-text')
        }
        qcb.firstElementChild.classList.add('red-text')
        qcb.firstElementChild.classList.remove('blue-grey-text')
    }
})

const CreateQCB = (item) => {
    let objName = CreateName()
    if (item.dataset.type == 'L' /* && item.id !== 'point_dir' */) {
        let group = item.parentNode
        let path = group.querySelector('path')
        let point = CreateTag('circle', {
            'cx': (+item.getAttributeNS(null, 'cx') + 20).toString(),
            'cy': (+item.getAttributeNS(null, 'cy') + 20).toString(),
            'id': 'point',
            'data-object': objName,
            'data-group': `${group.dataset.main}`,
            'data-type': 'Q'
        })
        group.insertBefore(point, item)
        item.dataset.type = ''
        Reorder(group)
        path.setAttributeNS(null, 'd', `${retPath(_group[item.dataset.group])}${z}`) //z
        point.addEventListener('mousedown', DragPoint)
    }
}

export { qcb, CreateQCB }

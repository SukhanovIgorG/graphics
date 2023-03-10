import { directions } from './map-directions.js'
import { _group, _directions } from './map-set-object.js'

const Reorder = (group) => {
    let points = group.querySelectorAll('circle')
    let dataObj = directions.classList.contains('active') ? _directions : _group
    let label = dataObj[group.dataset.main].label == undefined ? null : dataObj[group.dataset.main].label
    let doors = dataObj[group.dataset.main].doors == undefined ? [] : dataObj[group.dataset.main].doors
    let fill = dataObj[group.dataset.main].fill == undefined ? null : dataObj[group.dataset.main].fill
    let stroke = dataObj[group.dataset.main].stroke == undefined ? null : dataObj[group.dataset.main].stroke
    let stroke_dasharray = dataObj[group.dataset.main]['stroke-dasharray'] == undefined ? null : dataObj[group.dataset.main]['stroke-dasharray']
    let stroke_width = dataObj[group.dataset.main]['stroke-width'] == undefined ? null : dataObj[group.dataset.main]['stroke-width']
    delete dataObj[group.dataset.main]
    let reordered = {}
    for (let i = 0; i < points.length; i++) {
        reordered[points[i].dataset.object] = {
            'cx': +points[i].getAttributeNS(null, 'cx'),
            'cy': +points[i].getAttributeNS(null, 'cy'),
            'id': 'point',
            'data_object': points[i].dataset.object,
            'data_type': points[i].dataset.type
        }
    }
    dataObj[group.dataset.main] = reordered
    dataObj[group.dataset.main]['label'] = label
    dataObj[group.dataset.main]['doors'] = doors
    dataObj[group.dataset.main]['fill'] = fill
    dataObj[group.dataset.main]['stroke'] = stroke
    dataObj[group.dataset.main]['stroke-dasharray'] = stroke_dasharray
    dataObj[group.dataset.main]['stroke-width'] = stroke_width
}

export { Reorder }

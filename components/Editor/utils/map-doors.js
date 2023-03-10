import { _group, _directions, setObject } from './map-set-object.js'

const addDoor = (point, obj) => {
    point.classList.add('door')
    _directions[point.dataset.group][point.dataset.object]['door'] = obj.dataset.group
    Object.keys(_group[obj.dataset.group]).find(key => key == 'doors') ?
        _group[obj.dataset.group].doors[point.dataset.object] = [+point.getAttribute('cx'), +point.getAttribute('cy')]
        : _group[obj.dataset.group]['doors'] = {
            [point.dataset.object]: [+point.getAttribute('cx'), +point.getAttribute('cy')]
        }
}

const removeDoor = (point) => {
    point.classList.remove('door')
    if (_directions[point.dataset.group][point.dataset.object].door !== null && _directions[point.dataset.group][point.dataset.object].door !== undefined) {
        delete _group[_directions[point.dataset.group][point.dataset.object].door].doors[point.dataset.object]
        delete _directions[point.dataset.group][point.dataset.object].door
    }
}

const removeDoorPoint = (point) => {
    Object.keys(setObject(point.dataset.main)[point.dataset.main].doors).map(key => {
        for (const keyone in _directions) {
            for (const keytwo in _directions[keyone]) {
                if (keytwo == key) {
                    delete _directions[keyone][keytwo].door
                    document.querySelector(`[data-object=${key}]`).classList.remove('door')
                }
            }
        }
    })
}

export { addDoor, removeDoor, removeDoorPoint }

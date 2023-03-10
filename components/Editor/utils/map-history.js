import { _group, _directions, _lines } from './map-set-object.js'

const counter = document.querySelector('.history_counter')
let store = {}

const setMapHistory = () => {
    counter.removeAttribute('data-count')
    let center = document.querySelector('#center_point')
    let map = {
        name: document.querySelector('#map-name').value,
        info: document.querySelector('#map-info').value.replace(/^\s*/, '').replace(/\s*$/, ''),
        floor: document.querySelector('#map-floor').value,
        center: [+center.getAttribute('cx'), +center.getAttribute('cy')],
        rooms: {},
        lables: {},
        directions: _directions,
        lines: _lines,
    }
    for (const key in _group) {
        const element = _group[key]
        _group[key].hasOwnProperty('shift_x') ? map.lables[key] = element : map.rooms[key] = element
    }

    if(store.hist == null){
        let hist = []
        hist.push(map)
        store.hist = hist
    } else {
        let oldArr = store.hist
        let histCopy =  JSON.parse(JSON.stringify(oldArr))
        if(histCopy.length>99){
            histCopy.splice(1, 1)
            histCopy.push(map)
            store.hist = histCopy
        } else {
            histCopy.push(map)
            store.hist = histCopy
        }
    }
}

export { setMapHistory, counter, store }

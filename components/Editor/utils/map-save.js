import { _group, _directions, _lines, _areas } from './map-set-object.js'
import Device from "./classes/Device";

const saveMap = () => {
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
        areas: _areas,
    }
    if(!map.name.trim()){
        let toastHTML = `<span>Заполните поле название карты!</span>`
        M.toast({ html: toastHTML, classes: 'rounded pulse bad' })
        return
    }

    for (const key in _group) {
        const element = _group[key]
        _group[key].hasOwnProperty('shift_x') ? map.lables[key] = element : map.rooms[key] = element
    }

    const geturl = () => {
        if (location.pathname.includes('edit')) {
            return `./${location.pathname.substr(location.pathname.length - 24)}`
        } else {
            return './save'
        }
    }

    fetch(`${geturl()}`, {
        method: 'post',
        body: JSON.stringify(map),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response, rej) => {
        if (response.status == 200) {
            let toastHTML = `<span>Сохранено!</span>`
            M.toast({ html: toastHTML, classes: 'rounded pulse ok' })
        } else {
            console.log(response.response)
            let toastHTML = `<span>Сохранение не удалось!</span>`
            M.toast({ html: toastHTML, classes: 'rounded pulse bad' })
        }

    }).catch((err) => {
        console.log(err);
    })

    Device.saveAll()
        .then(() => {
            let toastHTML = `<span>Устройства сохранены!</span>`
            M.toast({ html: toastHTML, classes: 'rounded pulse ok' })
        }).catch((err) => {
            let toastHTML = `<span>Сохранение устройств не удалось!</span>`
            M.toast({ html: toastHTML, classes: 'rounded pulse bad' })
            console.log(err);
        })
}

export { saveMap }

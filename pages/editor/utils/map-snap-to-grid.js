import { options } from './map-options.js'

const snapToGrid = (coords) => {
    let temp = null
    if (coords.length) {
        temp = [coords[0] % options.snap, coords[1] % options.snap]
        coords[0] -= temp[0] < options.snap / 2 ? temp[0] : temp[0] - options.snap
        coords[1] -= temp[1] < options.snap / 2 ? temp[1] : temp[1] - options.snap
        return coords
    }
}

export { snapToGrid }

let _group = {}
let _directions = {}
let _lines = {}
let _areas = {}

const setObject = (name) => {
    let groupObj = Object.keys(_group)
    let directionsObj = Object.keys(_directions)
    let linesObj = Object.keys(_lines)
    let areasObj = Object.keys(_areas)
    return groupObj.find(values => values == name) ? _group
        : directionsObj.find(values => values == name) ? _directions
        : linesObj.find(values => values == name) ? _lines
        : areasObj.find(values => values == name) ? _areas
        : null
    }

const setGroup = (lables, rooms)=>{
    _group = Object.assign({}, lables, rooms)
}

const setDirections = (directions)=>{
    _directions = Object.assign({}, directions)
}

const setLines = (line)=>{
    _lines = Object.assign({}, line)
}

const setAreas = (area)=>{
    _areas = Object.assign({}, area)
}

export { _group, _directions, _lines, _areas, setObject, setGroup, setDirections, setLines, setAreas }

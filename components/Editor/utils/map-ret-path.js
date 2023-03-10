const retPath = (points) => {
    let d = ''
    for (const key in points) {
        if (key !== 'label'
            && key !== 'doors'
            && key !== 'stroke'
            && key !== 'stroke-width'
            && key !== 'stroke-dasharray'
            && key !== 'fill') {
            const point = points[key]
            d += `${point.data_type}${point.cx},${point.cy} `
        }
    }
    return d
}

export { retPath }

import { ming } from './map-new.js'

const CreateTag = (tagName, tagAttr) => {
    let tag = document.createElementNS(ming, tagName)
    for (let attr in tagAttr) {
        tag.setAttribute(attr, tagAttr[attr])
    }
    return tag
}

export { CreateTag }

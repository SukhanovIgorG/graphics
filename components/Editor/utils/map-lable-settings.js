import { _group } from './map-set-object.js'

let targetLabel = null

function rotateLabel() {
    _group[targetLabel.dataset.group][targetLabel.dataset.object].rotate = +this.value
    targetLabel.setAttribute('transform', `rotate(${this.value})`)
}

function resizeLabel() {
    _group[targetLabel.dataset.group][targetLabel.dataset.object].width = +this.value
    targetLabel.setAttribute('width', this.value)
}

function closeLableSettings() {
    document.querySelector('.edit_lable_mod') ? document.querySelector('.edit_lable_mod').remove() : null
    targetLabel = null
}

function ShowModal() {
    if ( event.target !== null ) {
    event.preventDefault()
    closeLableSettings()
    targetLabel = event.target
    let lX = event.pageX
    let lY = event.pageY
    let col = document.createElement('div')
    col.className = 'col edit_lable_mod'
    col.style.width = '170px'
    col.style.position = 'absolute'
    col.style.top = `${lY}px`
    col.style.left = `${lX}px`
    col.style.backgroundColor = 'rgba(255, 255, 255, .5)'
    let objSettings = document.querySelector('.edit_lable').content.cloneNode(true)
    let wrapper = document.querySelector('.push')
    col.appendChild(objSettings)
    wrapper.appendChild(col)
    let rotate = col.querySelector('#rotate')
    let width = col.querySelector('#label_width')
    rotate.setAttribute('value', `${_group[event.target.dataset.group][event.target.dataset.object].rotate}`)
    width.setAttribute('value', `${_group[event.target.dataset.group][event.target.dataset.object].width}`)
    rotate.addEventListener('change', rotateLabel)
    width.addEventListener('change', resizeLabel)
    }
}

export { ShowModal, closeLableSettings }

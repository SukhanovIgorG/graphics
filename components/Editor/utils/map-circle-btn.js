import { svgWrapper } from './map-new.js'

export default function (){
    let hideCircleBtn = document.querySelector('.hide_circle')
    hideCircleBtn.addEventListener('click', () => {
        event.preventDefault()
        if (svgWrapper.classList.contains('hide_circle')) {
            svgWrapper.classList.remove('hide_circle')
            hideCircleBtn.firstElementChild.innerHTML = 'blur_on'
            hideCircleBtn.firstElementChild.classList.remove('red-text')
            hideCircleBtn.firstElementChild.classList.add('blue-grey-text')
        } else {
            svgWrapper.classList.add('hide_circle')
            hideCircleBtn.firstElementChild.innerHTML = 'blur_off'
            hideCircleBtn.firstElementChild.classList.add('red-text')
            hideCircleBtn.firstElementChild.classList.remove('blue-grey-text')
        }
    })
}


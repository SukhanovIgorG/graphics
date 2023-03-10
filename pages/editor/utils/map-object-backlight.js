export default function () {
    const backlightBtn = document.querySelector('.backlight')
    backlightBtn.addEventListener('click', () => {
        event.preventDefault()
        let backlighTrigger = document.querySelector('circle.active')
        if (backlighTrigger) {
            let backlighPoints = document.querySelectorAll('circle.active')
            for (let i = 0; i < backlighPoints.length; i++) {
                const backlighPoint = backlighPoints[i]
                if (document.querySelector(`#${backlighPoint.dataset.group}`).getAttribute('fill') == 'none') {
                    document.querySelector(`#${backlighPoint.dataset.group}`).setAttribute('fill', 'url(#backlight)')
                } else if (document.querySelector(`#${backlighPoint.dataset.group}`).getAttribute('fill') == 'url(#backlight)') {
                    document.querySelector(`#${backlighPoint.dataset.group}`).setAttribute('fill', 'none')
                }
            }
        } else {
            var toastHTML = `<span>Необходимо выделить точку на объекте!</span>`
            M.toast({ html: toastHTML, classes: 'rounded pulse bad' })
        }
    })
}

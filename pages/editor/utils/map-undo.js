import { renderHistory } from './map-render-history.js'
import { counter, store } from './map-history.js'

export default function () {
    let undoBtn = document.querySelector('.undo')

    undoBtn.addEventListener('click', (event) => {
        event.preventDefault()
        if (counter.dataset.count == null) {
            let history = store.hist
            if (history) {
                let newCounter = history.length - 1
                let object = history[newCounter]
                counter.dataset.count = newCounter
                renderHistory(object)
            }
        } else if (+counter.dataset.count != 0) {
            let history = store.hist
            let newCounter = counter.dataset.count - 1
            if (history) {
                let object = history[newCounter]
                counter.dataset.count = newCounter
                renderHistory(object)
            }
        } else if (+counter.dataset.count == 0) {
            let toastHTML = `<span>Последняя запись!</span>`
            M.toast({ html: toastHTML, classes: 'rounded pulse bad' })
        }
    })
}

import { renderHistory } from './map-render-history.js'
import { counter, store } from './map-history.js'

export default function (){
    let redoBtn = document.querySelector('.redo')

    redoBtn.addEventListener('click', (event) => {
        event.preventDefault()
        if (counter.dataset.count != null) {
            let history = store.hist
            let newCounter = +counter.dataset.count + 1
            if (history) {
                let object = history[newCounter]
                if (object) {
                    counter.dataset.count = newCounter
                    renderHistory(object)
                } else {
                    let toastHTML = `<span>Первая запись!</span>`
                    M.toast({ html: toastHTML, classes: 'rounded pulse ok' })
                }
            }
        } else {
            let toastHTML = `<span>Нет записей</span>`
            M.toast({ html: toastHTML, classes: 'rounded pulse permanent' })
        }
    })
}


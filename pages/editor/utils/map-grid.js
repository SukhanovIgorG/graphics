import { options } from './map-options.js'

export default function (){
    let gridBtns = document.querySelectorAll('#grid_cell a')
    let gridControl = document.querySelector('#grid_control')
    for (let i = 0; i < gridBtns.length; i++) {
        const gridBtn = gridBtns[i]
        gridBtn.addEventListener('click', () => {
            let activeGrid = document.querySelector('#grid_cell .active')
            activeGrid.classList.remove('active')
            gridBtn.parentNode.classList.add('active')
            options.grid == true ? gridControl.setAttribute('fill', `url(#grid${gridBtn.textContent})`) : gridControl.setAttribute('fill', `none`)
            options.snap = gridBtn.textContent == "Нет" ? 1 : +gridBtn.textContent
        })
    }

    let borderShowBtn = document.querySelector('.hide_grid')
    borderShowBtn.addEventListener('click', () => {
        event.preventDefault()
        if (options.grid == true) {
            options.grid = false
            gridControl.setAttribute('fill', `none`)
            borderShowBtn.firstElementChild.innerHTML = 'border_clear'
            borderShowBtn.firstElementChild.classList.add('red-text')
            borderShowBtn.firstElementChild.classList.remove('blue-grey-text')
        } else {
            options.grid = true
            gridControl.setAttribute('fill', `url(#grid${options.snap})`)
            borderShowBtn.firstElementChild.innerHTML = 'border_all'
            borderShowBtn.firstElementChild.classList.remove('red-text')
            borderShowBtn.firstElementChild.classList.add('blue-grey-text')
        }
    })
}

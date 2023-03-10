const toolsBlock = document.querySelector('.tools')

const Blur = () => {
    let toolButtons = toolsBlock.querySelectorAll('a')
    for (let i = 0; i < toolButtons.length; i++) {
        const toolButton = toolButtons[i];
        toolButton.blur()
    }
}

export { Blur }
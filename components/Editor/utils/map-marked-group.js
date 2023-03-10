const MarkedGroup = () => {
    if (event.ctrlKey) {
        let path = event.target.parentElement
        path.classList.contains('active') ? path.classList.remove('active') : path.classList.add('active')
    }
}

export { MarkedGroup }

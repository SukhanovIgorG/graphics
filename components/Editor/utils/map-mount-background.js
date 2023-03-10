const imageLoader = document.querySelector('.file_photo')
const mount = document.querySelector('.mount_background')
const mount_width = document.querySelector('.mount_width')
const mount_left = document.querySelector('.mount_left')
const mount_top = document.querySelector('.mount_top')
const mount_container = document.querySelector('.mount_container')
const mount_btn = document.querySelector('.mount_btn')
const mount_close = document.querySelector('.mount_close')

export default function () {
    imageLoader.addEventListener('change', handleImage, false)
    mount_btn.addEventListener('click', containerShow)
    mount_close.addEventListener('click', containerShow)

    function containerShow(){
        mount_container.classList.toggle('active')
    }

    function handleImage(e) {
        let reader = new FileReader()
        let image = new Image()
        reader.onload = function (event) {
            mount.setAttribute('href', event.target.result)
            mount.setAttribute('width', 0)
            mount.setAttribute('x', 0)
            mount.setAttribute('y', 0)
            image.src = event.target.result
            image.addEventListener("load", function () {
                mount.setAttribute('width', image.width)
                mount_width.value = image.width > 5000 ? 4500 : image.width
                mount_left.value = 0
                mount_top.value = 0
            }, false)
        }
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        } else {
            mount.setAttribute('href', '')
            mount.setAttribute('width', 0)
            mount.setAttribute('x', 0)
            mount.setAttribute('y', 0)
            mount_width.value = ''
        }
    }

    mount_width.addEventListener('change', () => {
        mount.setAttribute('width', mount_width.value)
    })

    mount_left.addEventListener('change', () => {
        mount.setAttribute('x', mount_left.value)
    })

    mount_top.addEventListener('change', () => {
        mount.setAttribute('y', mount_top.value)
    })
}



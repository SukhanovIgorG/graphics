import Device from "./classes/Device";

const container = document.querySelector('.map_devices');
const modal = document.querySelector('#devices-container');
const hideButton = document.getElementById('hide-devices');
const showButton = document.getElementById('show-devices');
const BUTTON_CLASS_NAME = 'add-device';

hideButton?.addEventListener('click', function(){
    this.classList.add('hide');
    showButton.classList.remove('hide');
    Device.hideAll();
})

showButton?.addEventListener('click', function(){
    this.classList.add('hide');
    hideButton.classList.remove('hide');
    Device.showAll();
})

export function initDevices(){
    const buttons = container.querySelectorAll(`.${BUTTON_CLASS_NAME}`);
    buttons.forEach(button => button.addEventListener(
            'click',
            () => modal.M_Modal.close()
        )
    )
    Device.init();
}

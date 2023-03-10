import { Reset } from "./map-new.js";
import { closeLableSettings } from "./map-lable-settings.js";
import {
  selectionMode,
  panned,
  svgWrapper,
  CreateStartPointRect,
} from "./map-new.js";
import { Blur } from "./map-blur.js";
import { ShowModalForItem } from "./map-item-settings.js";

function showModalWindow() {
  let Modal = document.createElement("div");
  Modal.classList = "ModalWindow";
  Modal.style.position = "absolute";
  Modal.style.right = "0";
  Modal.style.top = "30%";
  Modal.style.backgroundColor = "transparent";
  Modal.style.height = "300px";
  Modal.style.maxWidth = "185px";
  Modal.style.minWidth = "185px";

  let objSettings = document
    .querySelector(".allMarkObj")
    .content.cloneNode(true);
  let wrapper = document.querySelector(".push");
  Modal.appendChild(objSettings);
  wrapper.appendChild(Modal);

  let activeRooms = document.querySelector("#activeRooms");
  let activeLables = document.querySelector("#activeLables");
  let activeDirections = document.querySelector("#activeDirections");
  let activeLines = document.querySelector("#activeLines");

  let lables = document.querySelectorAll("#nav-label.active");
  let rooms = document.querySelectorAll("#nav-item.active");
  let directions = document.querySelectorAll("#directions.active");
  let lines = document.querySelectorAll("#line.active");

  activeRooms.textContent = `  ${rooms.length}`;
  activeLables.textContent = `  ${lables.length}`;
  activeDirections.textContent = `  ${directions.length}`;
  activeLines.textContent = `  ${lines.length}`;

  const allMarkObjButton = document.querySelector("#allMarkObjButton");
  allMarkObjButton.onclick = () => {
    let all = [...rooms, ...directions, ...lines];
    all.forEach((item) => {
      item.querySelector("path").classList.add("light");
      setTimeout(() => {
        item.querySelector("path").classList.remove("light");
      }, 2000);
    });
  };
}

function closeModalWindow() {
  document.querySelector(".ModalWindow")
    ? document.querySelector(".ModalWindow").remove()
    : null;
}

const DinamicPointRect = (startX, startY, moveX, moveY) => {
  let path = document.querySelector("#mark-rect");
  path.setAttribute(
    "d",
    `M${startX},${startY} L${moveX},${startY} L${moveX},${moveY} L${startX},${moveY} Z`
  );
};

export const MarkElement = (event) => {
  closeModalWindow();
  if (
    event.button == 0 &&
    selectionMode &&
    (event.target.id == "grid" || event.target.tagName == "path")
  ) {
    Blur();
    closeLableSettings();
    event.preventDefault();
    let lables = document.querySelectorAll("#nav-label");
    let items = document.querySelectorAll("#nav-item");
    let directions = document.querySelectorAll("#directions");
    let lines = document.querySelectorAll("#line");
    let startX = null;
    let startY = null;
    let transformM = window
      .getComputedStyle(panned)
      .getPropertyValue("transform")
      .match(/(-?[0-9\.]+)/g);
    if (!startX && !startY) {
      startX =
        (event.clientX -
          svgWrapper.offsetLeft -
          svgWrapper.offsetParent.offsetLeft -
          transformM[4]) /
        transformM[0];
      startY =
        (event.clientY -
          svgWrapper.offsetTop -
          svgWrapper.offsetParent.offsetTop +
          scrollY -
          transformM[5]) /
        transformM[3];
      CreateStartPointRect(startX, startY);
    }
    function mouseMove(event) {
      let moveX =
        (event.clientX -
          svgWrapper.offsetLeft -
          svgWrapper.offsetParent.offsetLeft -
          transformM[4]) /
        transformM[0];
      let moveY =
        (event.clientY -
          svgWrapper.offsetTop -
          svgWrapper.offsetParent.offsetTop +
          scrollY -
          transformM[5]) /
        transformM[3];
      DinamicPointRect(startX, startY, moveX, moveY); // визуальный прямоугольник области выделения

      function checkInclude(item) {
        let points =
          item.id == "nav-label"
            ? item.querySelectorAll("image")
            : item.querySelectorAll("circle");
        let itemActive = false;
        points.forEach((point) => {
          let x =
            point.tagName == "image"
              ? point.getAttribute("x")
              : point.getAttribute("cx");
          let y =
            point.tagName == "image"
              ? point.getAttribute("y")
              : point.getAttribute("cy");
          if (
            ((startX < x && x < moveX) || (startX > x && x > moveX)) &&
            ((startY < y && y < moveY) || (startY > y && y > moveY))
          ) {
            itemActive = true;
          }
        });
        return itemActive;
      }

      items.forEach((item) => {
        checkInclude(item)
          ? item.classList.add("active")
          : item.classList.remove("active");
      });
      directions.forEach((item) => {
        checkInclude(item)
          ? item.classList.add("active")
          : item.classList.remove("active");
      });
      lines.forEach((item) => {
        checkInclude(item)
          ? item.classList.add("active")
          : item.classList.remove("active");
      });
      lables.forEach((item) => {
        checkInclude(item)
          ? item.classList.add("active")
          : item.classList.remove("active");
      });
    }
    svg.onmousemove = mouseMove;
    svg.onmouseup = (e) => {
      document.querySelector("#mark-rect").remove();
      svg.onmousemove = null;
      svg.onmouseup = null;
      showModalWindow();
      ShowModalForItem(e);
    };
  }
  Reset();
};

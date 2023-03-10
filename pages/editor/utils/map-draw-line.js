import { options } from "./map-options";
import { directionOff } from "./map-directions";
import { vectorOff } from "./map-directions-vector";
import { drawAreaOff } from "./map-draw-area";

let preColor = options.color;
let preWidth = options.width;
let preDash = options.dasharray;
const drawLine = document.querySelector(".draw-line");

function drawLineOff() {
  drawLine.classList.remove("active");
  drawLine.firstElementChild.classList.remove("red-text");
  drawLine.firstElementChild.classList.add("blue-grey-text");
  options.color = preColor;
  options.width = preWidth;
  options.dasharray = preDash;
}

function drawLineOn() {
  directionOff();
  vectorOff();
  drawAreaOff();
  drawLine.classList.add("active");
  drawLine.firstElementChild.classList.add("red-text");
  drawLine.firstElementChild.classList.remove("blue-grey-text");
  preColor = options.color;
  preWidth = options.width;
  preDash = options.dasharray;
  options.color = "orange";
  options.width = 3;
  options.dasharray = 0;
}

drawLine.addEventListener("click", () => {
  event.preventDefault();
  if (drawLine.classList.contains("active")) {
    drawLineOff();
  } else {
    drawLineOn();
  }
});

export { drawLine, drawLineOff, drawLineOn };

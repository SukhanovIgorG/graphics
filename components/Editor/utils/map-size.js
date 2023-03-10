import { ShowModalForItem } from "./map-item-settings";

const svg = document.querySelector("#svg");
const gridRectangle = document.querySelector("#grid");

// gridRectangle.addEventListener('contextmenu', ShowModalForItem )

let canvasWidth = document.querySelector("#canvas_width");
canvasWidth.addEventListener("change", () => {
  svg.viewBox.baseVal.width = event.target.value;
  gridRectangle.setAttribute("width", event.target.value);
  svg.setAttribute("width", event.target.value);
  vertical_center.setAttribute(
    "d",
    `M${(svg.viewBox.baseVal.width / 2).toString()},0 ${(
      svg.viewBox.baseVal.width / 2
    ).toString()}, ${svg.viewBox.baseVal.height.toString()}`
  );
  horizontal_center.setAttribute(
    "d",
    `M0,${(
      svg.viewBox.baseVal.height / 2
    ).toString()} ${svg.viewBox.baseVal.width.toString()}, ${(
      svg.viewBox.baseVal.height / 2
    ).toString()}`
  );
});

let canvasHeight = document.querySelector("#canvas_height");
canvasHeight.addEventListener("change", () => {
  svg.viewBox.baseVal.height = event.target.value;
  gridRectangle.setAttribute("height", event.target.value);
  svg.setAttribute("height", event.target.value);
  vertical_center.setAttribute(
    "d",
    `M${(svg.viewBox.baseVal.width / 2).toString()},0 ${(
      svg.viewBox.baseVal.width / 2
    ).toString()}, ${svg.viewBox.baseVal.height.toString()}`
  );
  horizontal_center.setAttribute(
    "d",
    `M0,${(
      svg.viewBox.baseVal.height / 2
    ).toString()} ${svg.viewBox.baseVal.width.toString()}, ${(
      svg.viewBox.baseVal.height / 2
    ).toString()}`
  );
});

export { svg, gridRectangle };

import { optionsAreas } from "./map-options-areas";
import { drawAreaOn } from "./map-draw-area";

const dasharrayAreas = {
  areas: "1 3",
  zones: "1 5",
};

let prevEl = null;

function setOptions(el) {
  drawAreaOn();
  let temp = el.dataset.template;
  if (prevEl) {
    prevEl.classList.remove("active");
    el.classList.add("active");
    prevEl = el;
  } else {
    el.classList.add("active");
    prevEl = el;
  }
  if (temp == "green") {
    optionsAreas.dasharray = dasharrayAreas.areas;
    optionsAreas.fill = "rgba(0, 255, 0, 0.1)";
    optionsAreas.color = "green";
  }
  if (temp == "asphalt") {
    optionsAreas.dasharray = dasharrayAreas.areas;
    optionsAreas.fill = "rgba(90, 88, 88, 0.1)";
    optionsAreas.color = "grey";
  }
  if (temp == "water") {
    optionsAreas.dasharray = dasharrayAreas.areas;
    optionsAreas.fill = "rgba(0, 191, 255, 0.1)";
    optionsAreas.color = "blue";
  }
  if (temp == "e83945") {
    optionsAreas.dasharray = dasharrayAreas.zones;
    optionsAreas.fill = "rgba(232, 57, 69, 0.1)";
    optionsAreas.color = "red";
  }
  if (temp == "85bd57") {
    optionsAreas.dasharray = dasharrayAreas.zones;
    optionsAreas.fill = "rgba(133, 189, 87, 0.1)";
    optionsAreas.color = "green";
  }
  if (temp == "3ea3dc") {
    optionsAreas.dasharray = dasharrayAreas.zones;
    optionsAreas.fill = "rgba(62, 163, 220, 0.1)";
    optionsAreas.color = "blue";
  }
  if (temp == "f07f3c") {
    optionsAreas.dasharray = dasharrayAreas.zones;
    optionsAreas.fill = "rgba(240, 127, 60, 0.1)";
    optionsAreas.color = "orange";
  }
  if (temp == "2b4c9c") {
    optionsAreas.dasharray = dasharrayAreas.zones;
    optionsAreas.fill = "rgba(43, 76, 156, 0.1)";
    optionsAreas.color = "blue";
  }
  if (temp == "8b569e") {
    optionsAreas.dasharray = dasharrayAreas.zones;
    optionsAreas.fill = "rgba(139, 86, 158, 0.1)";
    optionsAreas.color = "purple";
  }
}

export default function () {
  let tempBtns = document.querySelectorAll("#areas li");
  tempBtns.forEach((el) => el.addEventListener("click", () => setOptions(el)));
}

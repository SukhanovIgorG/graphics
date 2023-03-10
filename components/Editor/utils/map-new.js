import { directions, directionOff, directionOn } from "./map-directions.js";
import { vector, vectorOff, vectorOn } from "./map-directions-vector.js";
import { drawLine, drawLineOff, drawLineOn } from "./map-draw-line.js";
import { drawArea, drawAreaOn, drawAreaOff } from "./map-draw-area.js";
import { svg, gridRectangle } from "./map-size";
import {
  _group,
  _directions,
  _lines,
  _areas,
  setObject,
} from "./map-set-object.js";
import { saveMap } from "./map-save.js";
import { options } from "./map-options.js";
import { optionsAreas } from "./map-options-areas";
import { snapToGrid } from "./map-snap-to-grid.js";
import { retPath } from "./map-ret-path.js";
import { CreateTag } from "./map-create-tag.js";
import { addDoor, removeDoor, removeDoorPoint } from "./map-doors.js";
import { qcb, CreateQCB } from "./map-qcb.js";
import { ccb, CreateCCB } from "./map-ccb.js";
import { CreateCenter } from "./map-center.js";
import { Blur } from "./map-blur.js";
import { MarkedGroup } from "./map-marked-group.js";
import { EditGroup } from "./map-edit-group.js";
import { ShowModal, closeLableSettings } from "./map-lable-settings.js";
import { setMapHistory } from "./map-history.js";
import { action_btn, actionLine_btn, actionOff } from "./map-action.js";
import { createCoords, removeCoords } from "./map-points-coords.js";
import { initDevices } from "./map-device";
import { ShowModalForItem } from "./map-item-settings.js";
import { ShowModalForDirections } from "./map-directions-settings.js";
import { MarkElement } from "./map-mark-element.js";
import initialize from "./map-initialize";
import grid from "./map-grid";
import borders from "./map-borders";
import fillOption from "./map-fill-options";
import circleButton from "./map-circle-btn";
import mapTemplates from "./map-templates.js";
import mapAreas from "./map-areas.js";
import mapDirectionType from "./map-direction-type.js";
import mountBackground from "./map-mount-background";
import objectBacklight from "./map-object-backlight";
import redo from "./map-redo";
import search from "./map-search";
import undo from "./map-undo";
import wall from "./map-wall";
import { directionAttribute } from "./map-direction-att.js";

export let z = "Z";
export const panned = document.querySelector(".pan-zoom");
export const svgWrapper = document.querySelector("#box");
export const ming = "http://www.w3.org/2000/svg";
export const CreateName = () =>
  "r" +
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
export const panZoom = svgPanZoom(svg, {
  viewportSelector: ".pan-zoom",
  dblClickZoomEnabled: false,
  maxZoom: 150,
  minZoom: 0.01,
});

initialize();
grid();
borders();
fillOption();
circleButton();
mountBackground();
objectBacklight();
redo();
search();
undo();
wall();
initDevices();
mapTemplates();
mapAreas();
mapDirectionType();

export const directionsWrapper = document.querySelector("#directions-group");
export const linesWrapper = document.querySelector("#lines-group");
export const areasWrapper = document.querySelector("#areas-group");

let scrollY = null;
let group = null;
let path = null;
let lastPoint = [];
let line = [];

export let selectionMode = true;
export let selectionModeClick = false;
let optionCopyMode = false;

svgWrapper.addEventListener("wheel", () => {
  closeLableSettings();
});

window.onscroll = function () {
  scrollY = window.pageYOffset || document.documentElement.scrollTop;
};

export const Reset = () => {
  group = null;
  lastPoint = [];
  line = [];
};

const CreateLine = () => {
  let transformM = window
    .getComputedStyle(panned)
    .getPropertyValue("transform")
    .match(/(-?[0-9\.]+)/g);
  let lX =
    (event.clientX -
      svgWrapper.offsetLeft -
      svgWrapper.offsetParent.offsetLeft -
      transformM[4]) /
    transformM[0];
  let lY =
    (event.clientY -
      svgWrapper.offsetTop -
      svgWrapper.offsetParent.offsetTop +
      scrollY -
      transformM[5]) /
    transformM[3];
  let snap = snapToGrid([lX, lY]);
  line = snap;
  path.setAttributeNS(
    null,
    "d",
    `${retPath(setObject(group.dataset.main)[group.dataset.main])}${snap[0]},${
      snap[1]
    } ${
      directions.classList.contains("active") ||
      drawLine.classList.contains("active")
        ? ""
        : z
    }`
  ); //z
};

const CreateGroup = (name) => {
  if (group == null) {
    let random = CreateName();
    group = CreateTag("g", {
      id: name ? `${name}` : "nav-item",
      "data-main": random,
    });
    if (directions.classList.contains("active")) {
      directionsWrapper.appendChild(group);
    }
    if (drawLine.classList.contains("active")) {
      linesWrapper.appendChild(group);
    }
    if (drawArea.classList.contains("active")) {
      areasWrapper.appendChild(group);
    }
    if (
      !drawLine.classList.contains("active") &&
      !directions.classList.contains("active") &&
      !drawArea.classList.contains("active")
    ) {
      panned.insertBefore(group, directionsWrapper);
    }
  }
};

function checkActiveModAndCreateGroup() {
  directions.classList.contains("active")
    ? CreateGroup("directions")
    : drawLine.classList.contains("active")
    ? CreateGroup("line")
    : drawArea.classList.contains("active")
    ? CreateGroup("area")
    : CreateGroup();
}

const CreatePath = () => {
  let dataObj = directions.classList.contains("active")
    ? _directions
    : drawLine.classList.contains("active")
    ? _lines
    : drawArea.classList.contains("active")
    ? _areas
    : _group;
  let fill =
    directions.classList.contains("active") ||
    drawLine.classList.contains("active")
      ? "none"
      : drawArea.classList.contains("active")
      ? optionsAreas.fill
      : options.fill;
  let color = directions.classList.contains("active")
    ? directionAttribute.color
    : drawArea.classList.contains("active")
    ? optionsAreas.color
    : options.color;
  let width = directions.classList.contains("active")
    ? directionAttribute.width
    : drawArea.classList.contains("active")
    ? optionsAreas.width
    : options.width;
  let dasharray = directions.classList.contains("active")
    ? directionAttribute.dasharray
    : drawArea.classList.contains("active")
    ? optionsAreas.dasharray
    : options.dasharray;
  path = CreateTag("path", {
    id: `${group.dataset.main}`,
    fill: fill,
    stroke: color,
    "stroke-dasharray": dasharray,
    "data-group": `${group.dataset.main}`,
    "stroke-width": width,
  });
  path.setAttributeNS(null, "d", `${retPath(dataObj[group.dataset.main])}`);
  group.appendChild(path);
};

const CreatePoint = () => {
  let objName = CreateName();
  let dataObj = directions.classList.contains("active")
    ? _directions
    : drawLine.classList.contains("active")
    ? _lines
    : drawArea.classList.contains("active")
    ? _areas
    : _group;
  let transformM = window
    .getComputedStyle(panned)
    .getPropertyValue("transform")
    .match(/(-?[0-9\.]+)/g);
  let pX =
    (event.clientX -
      svgWrapper.offsetLeft -
      svgWrapper.offsetParent.offsetLeft -
      transformM[4]) /
    transformM[0];
  let pY =
    (event.clientY -
      svgWrapper.offsetTop -
      svgWrapper.offsetParent.offsetTop +
      scrollY -
      transformM[5]) /
    transformM[3];
  let snap = snapToGrid([pX, pY]);
  lastPoint = snap;
  checkActiveModAndCreateGroup();
  CreatePath();
  let objID = `${
    directions.classList.contains("active")
      ? "point_dir"
      : drawLine.classList.contains("active")
      ? "point_line"
      : drawArea.classList.contains("active")
      ? "point_area"
      : "point"
  }`;
  let point = CreateTag("circle", {
    cx: +snap[0],
    cy: +snap[1],
    id: objID,
    "data-object": objName,
    "data-group": `${group.dataset.main}`,
    "data-type": "M",
    "data-vector": `${vector.classList.contains("active") ? "start" : "none"}`,
  });
  group.appendChild(point);
  point.addEventListener("mousedown", DragPoint);
  point.addEventListener("mouseover", createCoords);
  point.addEventListener("mouseout", removeCoords);
  let fill =
    directions.classList.contains("active") ||
    drawLine.classList.contains("active")
      ? "none"
      : drawArea.classList.contains("active")
      ? optionsAreas.fill
      : options.fill;
  let width = directions.classList.contains("active")
    ? directionAttribute.width
    : drawArea.classList.contains("active")
    ? optionsAreas.width
    : options.color;
  let color = directions.classList.contains("active")
    ? directionAttribute.color
    : drawArea.classList.contains("active")
    ? optionsAreas.color
    : options.color;
  let dasharray = directions.classList.contains("active")
    ? directionAttribute.dasharray
    : drawArea.classList.contains("active")
    ? optionsAreas.dasharray
    : options.dasharray;
  dataObj[group.dataset.main] = {
    stroke: color,
    "stroke-width": width,
    "stroke-dasharray": dasharray,
    fill: fill,
    [objName]: {
      cx: +snap[0],
      cy: +snap[1],
      id: objID,
      data_object: objName,
      data_type: "M",
      data_vector: `${vector.classList.contains("active") ? "start" : "none"}`,
    },
  };
  setMapHistory();
};

const ContCreatePoint = () => {
  let objName = CreateName();
  let transformM = window
    .getComputedStyle(panned)
    .getPropertyValue("transform")
    .match(/(-?[0-9\.]+)/g);
  let cpX =
    (event.clientX -
      svgWrapper.offsetLeft -
      svgWrapper.offsetParent.offsetLeft -
      transformM[4]) /
    transformM[0];
  let cpY =
    (event.clientY -
      svgWrapper.offsetTop -
      svgWrapper.offsetParent.offsetTop +
      scrollY -
      transformM[5]) /
    transformM[3];
  let snap = snapToGrid([cpX, cpY]);
  let objID = `${
    directions.classList.contains("active")
      ? "point_dir"
      : drawLine.classList.contains("active")
      ? "point_line"
      : drawArea.classList.contains("active")
      ? "point_area"
      : "point"
  }`;
  if (
    JSON.stringify(snap) !== JSON.stringify(lastPoint) &&
    JSON.stringify(line) !== JSON.stringify(lastPoint)
  ) {
    let point = CreateTag("circle", {
      cx: +snap[0],
      cy: +snap[1],
      id: objID,
      "data-object": objName,
      "data-group": `${group.getAttributeNS(null, "data-main")}`,
      "data-type": "L",
    });
    group.appendChild(point);
    point.addEventListener("mousedown", DragPoint);
    point.addEventListener("mouseover", createCoords);
    point.addEventListener("mouseout", removeCoords);
    setObject(group.dataset.main)[group.dataset.main][objName] = {
      cx: +snap[0],
      cy: +snap[1],
      id: objID,
      data_object: objName,
      data_type: "L",
    };
    lastPoint = snap;
  }
  setMapHistory();
};

const CreateEndPoint = () => {
  let objName = CreateName();
  let objID = `${
    directions.classList.contains("active")
      ? "point_dir"
      : drawLine.classList.contains("active")
      ? "point_line"
      : drawArea.classList.contains("active")
      ? "point_area"
      : "point"
  }`;
  if (JSON.stringify(line) !== JSON.stringify(lastPoint)) {
    let point = CreateTag("circle", {
      cx: +line[0],
      cy: +line[1],
      id: objID,
      "data-object": objName,
      "data-group": `${group.dataset.main}`,
      "data-type": "L",
      "data-vector": `${
        vector.classList.contains("active") ? "finish" : "none"
      }`,
    });
    group.appendChild(point);
    point.addEventListener("mousedown", DragPoint);
    point.addEventListener("mouseover", createCoords);
    point.addEventListener("mouseout", removeCoords);
    setObject(group.dataset.main)[group.dataset.main][objName] = {
      cx: +line[0],
      cy: +line[1],
      id: objID,
      data_object: objName,
      data_type: "L",
      data_vector: `${vector.classList.contains("active") ? "finish" : "none"}`,
    };
    path.setAttributeNS(
      null,
      "d",
      `${retPath(setObject(group.dataset.main)[group.dataset.main])}${
        directions.classList.contains("active") ||
        drawLine.classList.contains("active")
          ? ""
          : z
      }`
    ); //z
    svg.removeEventListener("mousemove", CreateLine);
    directions.classList.contains("active")
      ? path.parentElement.addEventListener(
          "contextmenu",
          ShowModalForDirections
        )
      : null;
    Reset();
  } else {
    path.setAttributeNS(
      null,
      "d",
      `${retPath(setObject(group.dataset.main)[group.dataset.main])}${
        directions.classList.contains("active") ||
        drawLine.classList.contains("active")
          ? ""
          : z
      }`
    ); //z
    svg.removeEventListener("mousemove", CreateLine);
    directions.classList.contains("active")
      ? path.parentElement.addEventListener(
          "contextmenu",
          ShowModalForDirections
        )
      : null;
    Reset();
  }
  setMapHistory();
};

export function DragPoint() {
  let point = event.target;
  let transformM = window
    .getComputedStyle(panned)
    .getPropertyValue("transform")
    .match(/(-?[0-9\.]+)/g);
  let snap = [];
  if (
    !event.ctrlKey &&
    qcb.classList.contains("active") == false &&
    ccb.classList.contains("active") == false
  ) {
    point.id == "point_dir"
      ? directions.classList.contains("active")
        ? null
        : directionOn()
      : directions.classList.contains("active")
      ? directionOff()
      : null;
    let draggedPath = document.querySelector(`#${point.dataset.group}`);
    moveAt(event);
    function moveAt(event) {
      let dX =
        (event.clientX -
          svgWrapper.offsetLeft -
          svgWrapper.offsetParent.offsetLeft -
          transformM[4]) /
        transformM[0];
      let dY =
        (event.clientY -
          svgWrapper.offsetTop -
          svgWrapper.offsetParent.offsetTop +
          scrollY -
          transformM[5]) /
        transformM[3];
      snap = snapToGrid([dX, dY]);
      point.setAttribute("cx", +snap[0]);
      point.setAttribute("cy", +snap[1]);
      setObject(point.dataset.group)[point.dataset.group][
        point.dataset.object
      ].cx = +snap[0];
      setObject(point.dataset.group)[point.dataset.group][
        point.dataset.object
      ].cy = +snap[1];
      draggedPath.setAttributeNS(
        null,
        "d",
        `${retPath(setObject(point.dataset.group)[point.dataset.group])}${
          point.id == "point_line" || point.id == "point_dir" ? "" : z
        }`
      ); //z
    }
    document.onmousemove = function (event) {
      moveAt(event);
      if (directions.classList.contains("active")) {
        removeDoor(point);
      }
    };
    document.onmouseup = function (event) {
      if (directions.classList.contains("active")) {
        let elemsfrom = document.elementsFromPoint(
          event.clientX,
          event.clientY
        );
        let targetItem = Array.from(elemsfrom).find(
          (item) =>
            item.tagName == "path" && item.parentElement.id == "nav-item"
        );
        targetItem ? addDoor(point, targetItem) : removeDoor(point);
      }
      document.onmousemove = null;
      document.onmouseup = null;
    };
  } else if (event.ctrlKey) {
    let point = event.target;
    if (point.classList.contains("active")) {
      point.classList.remove("active");
    } else {
      point.classList.add("active");
    }
  } else if (
    qcb.classList.contains("active") &&
    ccb.classList.contains("active") == false
  ) {
    CreateQCB(point);
  } else if (
    ccb.classList.contains("active") &&
    qcb.classList.contains("active") == false
  ) {
    CreateCCB(point);
  }
  setMapHistory();
}

const DeleteItems = () => {
  let items = svgWrapper.querySelectorAll(".active");
  let lablesContainer = document.querySelector("#labels-container");
  if (!lablesContainer.classList.contains("open")) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.tagName == "g") {
        if (
          setObject(item.dataset.main)[item.dataset.main].doors !== null &&
          setObject(item.dataset.main)[item.dataset.main].doors !== undefined
        ) {
          removeDoorPoint(item);
        }
        if (setObject(item.dataset.main)[item.dataset.main].inroom) {
          _group[setObject(item.dataset.main)[item.dataset.main].inroom].label =
            null;
        }
        if (
          setObject(item.dataset.main)[item.dataset.main].label !== null &&
          setObject(item.dataset.main)[item.dataset.main].label !== undefined
        ) {
          let labelName = setObject(item.dataset.main)[item.dataset.main].label;
          let labelG = document.querySelector(`[data-main=${labelName}]`);
          delete setObject(labelG.dataset.main)[labelG.dataset.main];
          labelG.remove();
        }
        delete setObject(item.dataset.main)[item.dataset.main];
        item.remove();
      } else if (
        item.parentNode.classList.contains("active") == false &&
        item.tagName !== "g" &&
        item.dataset.type !== "M" &&
        item.dataset.type !== "Q" &&
        item.dataset.type !== "C" &&
        item.dataset.type !== ""
      ) {
        if (
          Object.keys(setObject(item.dataset.group)[item.dataset.group]).filter(
            (key) =>
              key !== "stroke" &&
              key !== "stroke-width" &&
              key !== "doors" &&
              key !== "label" &&
              key !== "stroke-dasharray" &&
              key !== "fill"
          ).length > 2
        ) {
          delete setObject(item.dataset.group)[item.dataset.group][
            item.dataset.object
          ];
          item.remove();
          document
            .querySelector(`#${item.dataset.group}`)
            .setAttributeNS(
              null,
              "d",
              `${retPath(setObject(item.dataset.group)[item.dataset.group])}${
                item.id == "point" || item.id == "nav-item" ? z : "" /* z */
              }`
            ); //z : ''
        } else {
          if (
            setObject(item.dataset.group)[item.dataset.group].doors !== null &&
            setObject(item.dataset.group)[item.dataset.group].doors !==
              undefined
          ) {
            removeDoorPoint(item.parentNode);
          }
          if (
            setObject(item.dataset.group)[item.dataset.group].label !== null &&
            setObject(item.dataset.group)[item.dataset.group].label !==
              undefined
          ) {
            let labelName = setObject(item.dataset.group)[item.dataset.group]
              .label;
            let labelG = document.querySelector(`[data-main=${labelName}]`);
            delete setObject(labelG.dataset.main)[labelG.dataset.main];
            labelG.remove();
          }
          delete setObject(item.parentNode.dataset.main)[
            item.parentNode.dataset.main
          ];
          item.parentNode.remove();
        }
      } else if (item.dataset.type == "") {
        if (item.previousElementSibling.dataset.type == "Q") {
          delete setObject(item.previousElementSibling.dataset.group)[
            item.previousElementSibling.dataset.group
          ][item.previousElementSibling.dataset.object];
          delete setObject(item.dataset.group)[item.dataset.group][
            item.dataset.object
          ];
          item.previousElementSibling.remove();
          item.remove();
          document
            .querySelector(`#${item.dataset.group}`)
            .setAttributeNS(
              null,
              "d",
              `${retPath(setObject(item.dataset.group)[item.dataset.group])}${
                item.id == "point" || item.id == "nav-item" ? z : "" /* z */
              }`
            ); //z : ''
        } else if (item.previousElementSibling.dataset.type == "") {
          delete setObject(
            item.previousElementSibling.previousElementSibling.dataset.group
          )[item.previousElementSibling.previousElementSibling.dataset.group][
            item.previousElementSibling.previousElementSibling.dataset.object
          ];
          delete setObject(item.previousElementSibling.dataset.group)[
            item.previousElementSibling.dataset.group
          ][item.previousElementSibling.dataset.object];
          delete setObject(item.dataset.group)[item.dataset.group][
            item.dataset.object
          ];
          item.previousElementSibling.previousElementSibling.remove();
          item.previousElementSibling.remove();
          item.remove();
          document
            .querySelector(`#${item.dataset.group}`)
            .setAttributeNS(
              null,
              "d",
              `${retPath(setObject(item.dataset.group)[item.dataset.group])}${
                item.id == "point" || item.id == "nav-item" ? z : "" /* z */
              }`
            ); //z : ''
        } else if (item.previousElementSibling.dataset.type == "C") {
          delete setObject(item.previousElementSibling.dataset.group)[
            item.previousElementSibling.dataset.group
          ][item.previousElementSibling.dataset.object];
          delete setObject(item.dataset.group)[item.dataset.group][
            item.dataset.object
          ];
          setObject(item.nextElementSibling.dataset.group)[
            item.nextElementSibling.dataset.group
          ][item.nextElementSibling.dataset.object].data_type = "L";
          item.nextElementSibling.dataset.type = "L";
          item.previousElementSibling.remove();
          item.remove();
          document
            .querySelector(`#${item.dataset.group}`)
            .setAttributeNS(
              null,
              "d",
              `${retPath(setObject(item.dataset.group)[item.dataset.group])}${
                item.id == "point" || item.id == "nav-item" ? z : "" /* z */
              }`
            ); //z : ''
        }
      } else if (item.dataset.type == "Q") {
        delete setObject(item.dataset.group)[item.dataset.group][
          item.dataset.object
        ];
        setObject(item.nextElementSibling.dataset.group)[
          item.nextElementSibling.dataset.group
        ][item.nextElementSibling.dataset.object].data_type = "L";
        item.nextElementSibling.dataset.type = "L";
        item.remove();
        document
          .querySelector(`#${item.dataset.group}`)
          .setAttributeNS(
            null,
            "d",
            `${retPath(setObject(item.dataset.group)[item.dataset.group])}${
              item.id == "point" || item.id == "nav-item" ? z : "" /* z */
            }`
          ); //z : ''
      } else if (item.dataset.type == "C") {
        delete setObject(item.nextElementSibling.dataset.group)[
          item.nextElementSibling.dataset.group
        ][item.nextElementSibling.dataset.object];
        delete setObject(item.dataset.group)[item.dataset.group][
          item.dataset.object
        ];
        setObject(item.nextElementSibling.nextElementSibling.dataset.group)[
          item.nextElementSibling.nextElementSibling.dataset.group
        ][item.nextElementSibling.nextElementSibling.dataset.object].data_type =
          "L";
        item.nextElementSibling.nextElementSibling.dataset.type = "L";
        item.nextElementSibling.remove();
        item.remove();
        document
          .querySelector(`#${item.dataset.group}`)
          .setAttributeNS(
            null,
            "d",
            `${retPath(setObject(item.dataset.group)[item.dataset.group])}${
              item.id == "point" || item.id == "nav-item" ? z : "" /* z */
            }`
          ); //z : ''
      }
    }
  }
  setMapHistory();
};

const Draw = () => {
  Blur();
  closeLableSettings();
  if (event.button == 0) {
    event.preventDefault();
    if (
      event.type == "mousedown" &&
      event.target.tagName !== "circle" &&
      group == null &&
      action_btn.classList.contains("active")
    ) {
      CreatePoint();
      svg.addEventListener("mousemove", CreateLine);
    } else if (
      event.type == "mousedown" &&
      group != null &&
      action_btn.classList.contains("active")
    ) {
      ContCreatePoint();
    }
  }
};

export const CreateStartPointRect = (x, y) => {
  let checkGroup = document.querySelector("#mark");
  if (!checkGroup) {
    CreateGroup("mark");
  }
  let group = document.querySelector("#mark");
  path = CreateTag("path", {
    id: `mark-rect`,
    fill: `none`,
    stroke: "purple",
    "stroke-dasharray": "0",
    "data-group": `group`,
    "stroke-width": "0.5",
    d: `M${x},${y} L${x},${y} L${x},${y} L${x},${y} Z`,
  });
  group.appendChild(path);
};

const StopDraw = () => {
  Blur();
};

svg.addEventListener("mousedown", (event) => {
  if (action_btn.classList.contains("active")) {
    Draw();
  } else {
    MarkElement(event);
  }
  if (event.target.tagName == "path") {
    MarkedGroup();
    EditGroup();
  }
  if (event.target.tagName == "image") {
    MarkedGroup();
  }
  closeLableSettings();
});
document.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && line.length > 0) {
    CreateEndPoint();
    StopDraw();
  }
  if (event.key == "Delete" || event.key == "Backspace") {
    if (!document.querySelector(".edit_lable_mod")) {
      DeleteItems();
    }
  }
  if (event.key == "Escape") {
    closeLableSettings();
  }
  if (event.key == "Control") {
    actionOff();
    if (!selectionModeClick) {
      let toastHTML = `<span>Активирован режим выделения объектов кликом мыши</span>`;
      M.toast({ html: toastHTML, classes: "rounded pulse ok" });
      selectionModeClick = true;
    }
  }
  if (event.key == "Shift") {
    if (!optionCopyMode) {
      let toastHTML = `<span>Активирован режим изменения параметров объекта кликом мыши</span>`;
      M.toast({ html: toastHTML, classes: "rounded pulse ok" });
      optionCopyMode = true;
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key == "Alt") {
  }
  if (event.key == "Control") {
    selectionModeClick = false;
  }
  if (event.key == "Shift") {
    optionCopyMode = false;
  }
});

function focus(event) {
  //разобраться и вынести позже
  if (event) event.preventDefault();
  closeLableSettings();
  panZoom.zoom(1);
  panZoom.pan({ x: -svg.getBBox().width / 4, y: -svg.getBBox().height / 4 });
}

let focusBtn = document.querySelector(".focus");
focusBtn.addEventListener("click", focus); //

const options_label = {
  alignment: "right",
};

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll(".labeles");
  const instance = M.Dropdown.init(elems, options_label);
});

export function DragLabel() {
  let point = event.target;
  let transformM = window
    .getComputedStyle(panned)
    .getPropertyValue("transform")
    .match(/(-?[0-9\.]+)/g);
  function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
    };
  }
  let shiftX = event.pageX - getCoords(point).left;
  let shiftY = event.pageY - getCoords(point).top;
  if (
    !event.ctrlKey &&
    qcb.classList.contains("active") == false &&
    ccb.classList.contains("active") == false &&
    event.button == 0
  ) {
    closeLableSettings();
    moveAt(event);
    function moveAt(event) {
      let lX =
        (event.clientX -
          shiftX -
          svgWrapper.offsetLeft -
          svgWrapper.offsetParent.offsetLeft -
          transformM[4]) /
        transformM[0];
      let lY =
        (event.clientY -
          shiftY -
          svgWrapper.offsetTop -
          svgWrapper.offsetParent.offsetTop +
          scrollY -
          transformM[5]) /
        transformM[3];
      let snap = snapToGrid([lX, lY]);
      _group[point.dataset.group].shift_x = snap[0] - point.getAttribute("x");
      _group[point.dataset.group].shift_y = snap[1] - point.getAttribute("y");
      point.parentElement.setAttribute(
        "transform",
        `translate(${snap[0] - point.getAttribute("x")}, ${
          snap[1] - point.getAttribute("y")
        })`
      );
    }
    document.onmousemove = function (event) {
      moveAt(event);
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      point.onmouseup = null;
    };
  }
  setMapHistory();
}

const addLabelBtns = document.querySelectorAll(".add-label");
for (let i = 0; i < addLabelBtns.length; i++) {
  addLabelBtns[i].addEventListener("click", () => {
    let activeObjs = document.querySelectorAll("#nav-item.active");
    if (activeObjs.length > 0) {
      activeObjs.forEach((activeObj) => {
        const newImage = (random, objName) => {
          let labelImage = document.createElementNS(ming, "image");
          labelImage.setAttribute(
            "x",
            `${activeObj.getBBox().width / 2 + activeObj.getBBox().x}`
          );
          labelImage.setAttribute(
            "y",
            `${activeObj.getBBox().height / 2 + activeObj.getBBox().y}`
          );
          labelImage.setAttribute("width", "50");
          labelImage.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "href",
            `${addLabelBtns[i].dataset.logotype}`
          );
          labelImage.setAttribute("id", "label-image");
          labelImage.setAttribute("data-group", `${random}`);
          labelImage.setAttribute("data-object", `${objName}`);
          labelImage.setAttribute("transform", `rotate(${0})`);

          return labelImage;
        };
        if (!_group[activeObj.dataset.main].label) {
          let random = CreateName();
          let objName = CreateName();
          let label = CreateTag("g", {
            id: "nav-label",
            "data-main": random,
          });
          let labelImage = newImage(random, objName);
          _group[activeObj.dataset.main]["label"] = random;
          label.appendChild(labelImage);
          panned.appendChild(label);
          _group[random] = {
            shift_x: 0,
            shift_y: 0,
            inroom: `${activeObj.dataset.main}`,
            [objName]: {
              x: activeObj.getBBox().width / 2 + activeObj.getBBox().x,
              y: activeObj.getBBox().height / 2 + activeObj.getBBox().y,
              link: `${addLabelBtns[i].dataset.logotype}`,
              width: 50,
              rotate: 0,
              navobject: `${addLabelBtns[i].dataset.navobject}`,
            },
          };
          label.addEventListener("mousedown", DragLabel);
          label.addEventListener("contextmenu", ShowModal);
          let toastHTML = `<span>Объект добавлен!</span>`;
          M.toast({ html: toastHTML, classes: "rounded pulse ok" });
        } else {
          const group = document.querySelector(
            `#nav-label[data-main="${_group[activeObj.dataset.main].label}"]`
          );

          if (group) {
            let labelImage = group.querySelector(
              `image[data-group="${_group[activeObj.dataset.main].label}"]`
            );
            let objName = labelImage.dataset.object;

            labelImage.setAttribute("href", addLabelBtns[i].dataset.logotype);
            _group[_group[activeObj.dataset.main].label][objName].link =
              addLabelBtns[i].dataset.logotype;

            let toastHTML = `<span>Объект обновлён!</span>`;
            M.toast({ html: toastHTML, classes: "rounded pulse ok" });
          } else {
            let random = _group[activeObj.dataset.main].label;
            let objName = CreateName();
            let label = CreateTag("g", {
              id: "nav-label",
              "data-main": random,
            });
            let labelImage = newImage(random, objName);
            _group[activeObj.dataset.main]["label"] = random;
            label.appendChild(labelImage);
            panned.appendChild(label);
            _group[random] = {
              shift_x: 0,
              shift_y: 0,
              inroom: `${activeObj.dataset.main}`,
              [objName]: {
                x: activeObj.getBBox().width / 2 + activeObj.getBBox().x,
                y: activeObj.getBBox().height / 2 + activeObj.getBBox().y,
                link: `${addLabelBtns[i].dataset.logotype}`,
                width: 50,
                rotate: 0,
                navobject: `${addLabelBtns[i].dataset.navobject}`,
              },
            };
            label.addEventListener("mousedown", DragLabel);
            label.addEventListener("contextmenu", ShowModal);
            let toastHTML = `<span>Лейбл добавлен!</span>`;
            M.toast({ html: toastHTML, classes: "rounded pulse ok" });
          }
        }
      });
      M.toast({
        html: `<span>Добавлено ${activeObjs.length} лейбл</span>`,
        classes: "rounded pulse ok",
      });
    } else {
      let toastHTML = `<span>Необходимо выбрать минимум 1 комнату с зажатым Ctrl!</span>`;
      M.toast({ html: toastHTML, classes: "rounded pulse bad" });
    }
    setMapHistory();
  });
}

const saveBtn = document.querySelector(".save_map");
saveBtn.addEventListener("click", saveMap);

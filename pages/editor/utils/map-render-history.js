import { CreateTag } from "./map-create-tag.js";
import { panned, directionsWrapper } from "./map-new.js";
import { setGroup, setDirections, setLines } from "./map-set-object.js";
import { DragPoint, DragLabel } from "./map-new.js";
import { ShowModal } from "./map-lable-settings.js";
import { ShowModalForItem } from "./map-item-settings.js";

const InitDrag = (obj) => {
  setGroup(obj.lables, obj.rooms);
  setDirections(obj.directions);
  setLines(obj.lines);
  let circles = document.querySelectorAll("circle");
  for (let i = 0; i < circles.length; i++) {
    circles[i].addEventListener("mousedown", DragPoint);
  }
  let labeles = document.querySelectorAll("#nav-label");
  for (let i = 0; i < labeles.length; i++) {
    labeles[i].addEventListener("mousedown", DragLabel);
    labeles[i].addEventListener("contextmenu", ShowModal);
  }
  let items = document.querySelectorAll("#nav-item");
  for (let i = 0; i < items.length; i++) {
    // items[i].addEventListener('contextmenu', ShowModalForItem)
  }
};

const oldItemRemoover = () => {
  let oldItemsRooms = document.querySelectorAll("#nav-item");
  for (let i = 0; i < oldItemsRooms.length; i++) {
    oldItemsRooms[i].remove();
  }
  let oldItemsDirections = document.querySelectorAll("#directions");
  for (let i = 0; i < oldItemsDirections.length; i++) {
    oldItemsDirections[i].remove();
  }
  let oldItemsLines = document.querySelectorAll("#line");
  for (let i = 0; i < oldItemsLines.length; i++) {
    oldItemsLines[i].remove();
  }
  let oldItemsLabel = document.querySelectorAll("#nav-label");
  for (let i = 0; i < oldItemsLabel.length; i++) {
    oldItemsLabel[i].remove();
  }
};

const renderRooms = ({ rooms }) => {
  for (const key in rooms) {
    let group = CreateTag("g", { id: "nav-item", "data-main": key });
    const room = rooms[key];
    let _d = "";
    for (const _key in room) {
      const point = room[_key];
      if (typeof point === "object" && point !== null && point.length !== 0) {
        if (point.cx) {
          _d += `${point.data_type}${point.cx},${point.cy} `;
          let circle = CreateTag("circle", {
            cx: point.cx,
            cy: point.cy,
            "data-group": key,
            "data-object": _key,
            "data-type": point.data_type,
            id: "point",
          });
          group.appendChild(circle);
        }
      }
    }
    let first = group.firstChild;
    let path = CreateTag("path", {
      id: key,
      fill: room.fill,
      stroke: room.stroke,
      "stroke-dasharray": room["stroke-dasharray"],
      "stroke-width": room["stroke-width"],
      "data-group": key,
      d: `${_d}Z`,
    });
    group.insertBefore(path, first);
    panned.insertBefore(group, directionsWrapper);
  }
};

const renderDirections = ({ directions }) => {
  for (const key in directions) {
    let group = CreateTag("g", { id: "directions", "data-main": key });
    const room = directions[key];
    let _d = "";
    for (const _key in room) {
      const point = room[_key];
      if (typeof point === "object" && point !== null && point.length !== 0) {
        if (point.cx) {
          _d += `${point.data_type}${point.cx},${point.cy} `;
          if (point.door) {
            console.log(point.door.length);
          }
          let circle = CreateTag("circle", {
            cx: point.cx,
            cy: point.cy,
            "data-group": key,
            "data-object": _key,
            "data-type": point.data_type,
            id: "point_dir",
            class: point.door ? "door" : undefined,
          });
          group.appendChild(circle);
        }
      }
    }
    let first = group.firstChild;
    let path = CreateTag("path", {
      id: key,
      fill: room.fill,
      stroke: room.stroke,
      "stroke-dasharray": room["stroke-dasharray"],
      "stroke-width": room["stroke-width"],
      "data-group": key,
      d: `${_d}`,
    });
    group.insertBefore(path, first);
    directionsWrapper.appendChild(group);
  }
};
const renderLines = ({ lines }) => {
  for (const key in lines) {
    let group = CreateTag("g", { id: "line", "data-main": key });
    const room = lines[key];
    let _d = "";
    for (const _key in room) {
      const point = room[_key];
      if (typeof point === "object" && point !== null && point.length !== 0) {
        if (point.cx) {
          _d += `${point.data_type}${point.cx},${point.cy} `;
          if (point.door) {
            console.log(point.door.length);
          }
          let circle = CreateTag("circle", {
            cx: point.cx,
            cy: point.cy,
            "data-group": key,
            "data-object": _key,
            "data-type": point.data_type,
            id: "point_dir",
            class: point.door ? "door" : undefined,
          });
          group.appendChild(circle);
        }
      }
    }
    let first = group.firstChild;
    let path = CreateTag("path", {
      id: key,
      fill: room.fill,
      stroke: room.stroke,
      "stroke-dasharray": room["stroke-dasharray"],
      "stroke-width": room["stroke-width"],
      "data-group": key,
      d: `${_d}`,
    });
    group.insertBefore(path, first);
    directionsWrapper.appendChild(group);
  }
};
const renderLables = ({ lables }) => {
  for (const key in lables) {
    const lable = lables[key];
    let group = CreateTag("g", {
      id: "nav-label",
      "data-main": key,
      transform: `translate(${lable.shift_x},${lable.shift_y})`,
    });
    for (const _key in lable) {
      const imageObj = lable[_key];
      if (typeof imageObj === "object") {
        let image = CreateTag("image", {
          id: "label-image",
          x: imageObj.x,
          y: imageObj.y,
          href: imageObj.link,
          width: imageObj.width,
          "data-group": key,
          "data-object": _key,
          transform: `rotate(${imageObj.rotate})`,
        });
        group.appendChild(image);
      }
    }
    panned.appendChild(group);
  }
};

export const renderHistory = (obj) => {
  oldItemRemoover();
  renderRooms(obj);
  renderDirections(obj);
  renderLines(obj);
  renderLables(obj);
  InitDrag(obj);
};

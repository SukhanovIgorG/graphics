import { _group, _directions, _lines } from "./map-set-object.js";
import { setMapHistory } from "./map-history.js";

// ПЕРЕМЕЩАЕМ ФИГУРЫ
function moveIthem(target, pathX, pathY) {
  const startPos = target.getAttribute("d").split(" "); // стартовые координаты
  const splitStartPos = startPos.map((elem) => elem.split(",")); // деструктурируем
  splitStartPos.map((el) => el.splice(1, 1, Number(el[1]) + pathY)); // перемещаем по оси У фигуру
  splitStartPos.map((el) => {
    // перемещаем по оси Х фигуру
    if (el[0] != "") {
      // если элемент не пустая строка
      const sym = el[0].slice(0, 1); // символ
      const cord = el[0].slice(1); // координата
      if (sym !== "Z") {
        el[0] = sym + Number(Number(cord) + pathX);
      }
    }
  });
  const newPos = splitStartPos
    .map((el) => el.join(","))
    .join(" ")
    .slice(0, -4); // срезаем лишний NaN
  target.setAttribute("d", newPos);

  // ПЕРЕМЕЩАЕМ УЗЛЫ
  const parent = target.parentElement;
  const circles = parent.querySelectorAll("circle");
  circles.forEach((element) => {
    const newCY = Number(element.getAttribute("cy")) + pathY;
    const newCX = Number(element.getAttribute("cx")) + pathX;
    element.setAttribute("cy", newCY); // перемещаем узлы по экрану
    element.setAttribute("cx", newCX);
    if (target.parentElement.id == "nav-item") {
      _group[target.dataset.group][element.dataset.object].cy = newCY; // перемещаем узлы в базе данных
      _group[target.dataset.group][element.dataset.object].cx = newCX;
    }
    if (target.parentElement.id == "directions") {
      _directions[target.dataset.group][element.dataset.object].cy = newCY;
      _directions[target.dataset.group][element.dataset.object].cx = newCX;
    }
    if (target.parentElement.id == "line") {
      _lines[target.dataset.group][element.dataset.object].cy = newCY;
      _lines[target.dataset.group][element.dataset.object].cx = newCX;
    }
  });
}

// ПЕРЕМЕЩАЕМ ЛОГОТИПЫ
function moveLabel(target, pathX, pathY) {
  const parent = target.parentElement;
  const image = parent.querySelector("image");
  const newCY = Number(image.getAttribute("y")) + pathY;
  const newCX = Number(image.getAttribute("x")) + pathX;
  image.setAttribute("y", newCY); // перемещаем узлы по экрану
  image.setAttribute("x", newCX);
  _group[target.dataset.group][image.dataset.object].y = newCY; // перемещаем узлы в базе данных
  _group[target.dataset.group][image.dataset.object].x = newCX;
}

function closeLableSettings() {
  document.querySelector(".edit_lable_mod")
    ? document.querySelector(".edit_lable_mod").remove()
    : null;
}

function ShowModalForItem(event) {
  event.preventDefault();
  closeLableSettings();
  const col = document.createElement("div");
  col.className = "col edit_lable_mod";
  col.style.width = "185px";
  col.style.position = "absolute";
  col.style.padding = "0";
  col.style.top = `calc(30% + 290px)`;
  col.style.right = `${0}px`;
  col.style.backgroundColor = "rgba(255, 255, 255, .5)";
  const objSettings = document
    .querySelector(".edit_lable_item")
    .content.cloneNode(true);
  const wrapper = document.querySelector(".push");
  col.appendChild(objSettings);
  wrapper.appendChild(col);

  const activeLabel = document.querySelectorAll("#nav-label.active");
  const activeObj = document.querySelectorAll("#nav-item.active");
  const activeDirections = document.querySelectorAll("#directions.active");
  const activeLines = document.querySelectorAll("#line.active");

  const allActiveObj = [
    ...activeObj,
    ...activeDirections,
    ...activeLines,
    ...activeLabel,
  ];

  const btns = col.querySelector(".btn-container");
  const input = col.querySelector("#input-step");
  btns.addEventListener("click", (e) => {
    if (allActiveObj.length == 0) {
      const toastHTML = `<span>Выделите один или несколько объектов удерживая Ctrl или Alt</span>`;
      M.toast({ html: toastHTML, classes: "rounded pulse bad" });
    }

    if (e.target.parentElement.id == "up") {
      activeObj.forEach((el) => {
        moveIthem(el.firstChild, 0, -input.value);
      });
      activeLabel.forEach((el) => {
        moveLabel(el.firstChild, 0, -input.value);
      });
      activeDirections.forEach((el) => {
        moveIthem(el.firstChild, 0, -input.value);
      });
      activeLines.forEach((el) => {
        moveIthem(el.firstChild, 0, -input.value);
      });
    }
    if (e.target.parentElement.id == "left") {
      activeObj.forEach((el) => {
        moveIthem(el.firstChild, -input.value, 0);
      });
      activeLabel.forEach((el) => {
        moveLabel(el.firstChild, -input.value, 0);
      });
      activeDirections.forEach((el) => {
        moveIthem(el.firstChild, -input.value, 0);
      });
      activeLines.forEach((el) => {
        moveIthem(el.firstChild, -input.value, 0);
      });
    }
    if (e.target.parentElement.id == "right") {
      activeObj.forEach((el) => {
        moveIthem(el.firstChild, Number(input.value), 0);
      });
      activeLabel.forEach((el) => {
        moveLabel(el.firstChild, Number(input.value), 0);
      });
      activeDirections.forEach((el) => {
        moveIthem(el.firstChild, Number(input.value), 0);
      });
      activeLines.forEach((el) => {
        moveIthem(el.firstChild, Number(input.value), 0);
      });
    }
    if (e.target.parentElement.id == "down") {
      activeObj.forEach((el) => {
        moveIthem(el.firstChild, 0, Number(input.value));
      });
      activeLabel.forEach((el) => {
        moveLabel(el.firstChild, 0, Number(input.value));
      });
      activeDirections.forEach((el) => {
        moveIthem(el.firstChild, 0, Number(input.value));
      });
      activeLines.forEach((el) => {
        moveIthem(el.firstChild, 0, Number(input.value));
      });
    }
    setMapHistory();
  });
}

export { ShowModalForItem, closeLableSettings };

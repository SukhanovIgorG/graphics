import { options } from "./map-options.js";
import { _group, _directions, _lines } from "./map-set-object.js";
import { setMapHistory } from "./map-history.js";

export default function () {
  let primeBtnColor = document.querySelector(".color");
  let borderColorBtns = document.querySelectorAll("#border_color li");
  let prevColorButton = "blue-grey-text";
  for (let i = 0; i < borderColorBtns.length; i++) {
    const borderColorBtn = borderColorBtns[i];
    borderColorBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let newColor = e.currentTarget.dataset.color;
      // если есть выделенные объекты - присваиваем им новые значения
      let activeTriggers = document.querySelectorAll("g.active");
      if (activeTriggers) {
        activeTriggers.forEach((trigger) => {
          let activePoints = trigger.querySelectorAll("circle");
          for (let i = 0; i < activePoints.length; i++) {
            const activePoint = activePoints[i];
            const activeGroup = activePoint.dataset.group;
            if (activePoint.id == "point") {
              document
                .querySelector(`#${activeGroup}`)
                .setAttribute("stroke", `${newColor}`);
              _group[activeGroup]["stroke"] = newColor;
            } else if (activePoint.id == "point_line") {
              document
                .querySelector(`#${activeGroup}`)
                .setAttribute("stroke", `${newColor}`);
              _lines[activeGroup]["stroke"] = newColor;
            }
          }
        });
      }
      options.color = newColor;
      primeBtnColor.firstChild.classList.remove(prevColorButton);
      if (e.currentTarget.dataset.color == "none") {
        primeBtnColor.firstChild.classList.add(`grey-text`);
        prevColorButton = `grey-text`;
      } else {
        primeBtnColor.firstChild.classList.add(`${newColor}-text`);
        prevColorButton = `${newColor}-text`;
      }
      setMapHistory();
    });
  }

  let primeBtnBorder = document.querySelector(".border");
  let borderWidthBtns = document.querySelectorAll("#line li");
  for (let i = 0; i < borderWidthBtns.length; i++) {
    const borderWidthBtn = borderWidthBtns[i];
    borderWidthBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let newWidth = e.currentTarget.textContent;
      let newDash = borderWidthBtn.querySelector("a").dataset.dasharray;
      // если есть выделенные объекты - присваиваем им новые значения толщины
      let activeTriggers = document.querySelectorAll("g.active");
      if (activeTriggers) {
        activeTriggers.forEach((trigger) => {
          let activePoints = trigger.querySelectorAll("circle");
          for (let i = 0; i < activePoints.length; i++) {
            const activePoint = activePoints[i];
            let activeGroup = activePoint.dataset.group;
            if (activePoint.id == "point") {
              document
                .querySelector(`#${activeGroup}`)
                .setAttribute("stroke-width", String(newWidth));
              document
                .querySelector(`#${activeGroup}`)
                .setAttribute("stroke-dasharray", String(newDash));
              _group[activeGroup]["stroke-width"] = newWidth;
              _group[activeGroup]["stroke-dasharray"] = newDash;
            } else if (activePoint.id == "point_line") {
              document
                .querySelector(`#${activeGroup}`)
                .setAttribute("stroke-width", String(newWidth));
              document
                .querySelector(`#${activeGroup}`)
                .setAttribute("stroke-dasharray", String(newDash));
              _lines[activeGroup]["stroke-width"] = newWidth;
              _lines[activeGroup]["stroke-dasharray"] = newDash;
            }
          }
        });
        setMapHistory();
      }
      let activeBorderWidth = document.querySelector("#line .active");
      activeBorderWidth.classList.remove("active");
      options.width = newWidth;
      options.dasharray = newDash;
      borderWidthBtn.classList.add("active");
      primeBtnBorder.textContent = newWidth;
    });
  }
}

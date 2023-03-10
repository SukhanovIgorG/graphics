import { options } from "./map-options.js";
import { setMapHistory } from "./map-history.js";
import { _group, _directions } from "./map-set-object.js";

export default function () {
  let primeBtnFill = document.querySelector(".fill");
  let fillBtns = document.querySelectorAll("#fill li");
  let prevColorButton = "blue-grey-text";
  for (let i = 0; i < fillBtns.length; i++) {
    const fillBtn = fillBtns[i];
    fillBtn.addEventListener("click", (e) => {
      const newFill = e.currentTarget.dataset.fill;
      if (
        options.fill.startsWith("rgba") &&
        e.currentTarget.dataset.fill.startsWith("rgba")
      ) {
        // если заданы настройки прозрачности, они сохраняются
        let newCollor = e.currentTarget.dataset.fill
          .split(",")
          .splice(0, 3, "");
        let arr = options.fill.split(",");
        let currentTransparency = arr.splice(3, 1);
        newCollor.push(...currentTransparency);
        let newStringCollor = newCollor.join();
        options.fill = newStringCollor;
      } else {
        options.fill = e.currentTarget.dataset.fill;
      }
      // если есть активные объекты - изменияем их
      let activeTriggers = document.querySelectorAll("g.active");
      if (activeTriggers) {
        activeTriggers.forEach((trigger) => {
          let activePoints = trigger.querySelectorAll("circle");
          for (let i = 0; i < activePoints.length; i++) {
            const activePoint = activePoints[i];
            const activeGroup = activePoint.dataset.group;
            document
              .querySelector(`#${activeGroup}`)
              .setAttribute("fill", `${newFill}`);
            if (activePoint.id == "point") {
              _group[activeGroup]["fill"] = newFill;
            }
          }
        });
      }
      primeBtnFill.firstChild.classList.remove(prevColorButton);
      primeBtnFill.firstChild.classList.add(
        `${e.currentTarget.dataset.color}-text`
      );
      prevColorButton = `${e.currentTarget.dataset.color}-text`;
      setMapHistory();
    });
  }
  let primeBtnTrans = document.querySelector(".transparency");
  let transBtns = document.querySelectorAll("#transparency li");
  for (let i = 0; i < transBtns.length; i++) {
    const transBtn = transBtns[i];
    transBtn.addEventListener("click", (e) => {
      let newTransparency = e.currentTarget.dataset.transparency;
      if (options.fill.startsWith("rgba")) {
        let arr = options.fill.split(",");
        arr.splice(3, 1, ` ${newTransparency})`);
        let str = arr.join();
        options.fill = str;
      } else {
        M.toast({
          html: "Заливка должна быть цветом",
          classes: "rounded pulse bad",
        });
      }

      // если есть активные объекты - изменияем их+
      let activeTriggers = document.querySelectorAll("g.active");
      if (activeTriggers) {
        activeTriggers.forEach((trigger) => {
          let activePoints = trigger.querySelectorAll("circle");
          for (let i = 0; i < activePoints.length; i++) {
            const activePoint = activePoints[i];
            const activeGroup = activePoint.dataset.group;
            const curentElem = document.querySelector(`#${activeGroup}`);
            if (curentElem.getAttribute("fill").startsWith("rgba")) {
              let arr = curentElem.getAttribute("fill").split(",");
              arr.splice(3, 1, ` ${newTransparency})`);
              let str = arr.join();
              curentElem.setAttribute("fill", `${str}`);
              if (activePoint.id == "point") {
                _group[activeGroup]["fill"] = str;
              }
            }
          }
        });
      }

      primeBtnTrans.textContent = e.currentTarget.textContent;
      setMapHistory();
    });
  }
}

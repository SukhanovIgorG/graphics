import { _group, _directions, _lines, _areas } from "./map-set-object.js";
import { DragPoint, DragLabel } from "./map-new.js";
import { ShowModal } from "./map-lable-settings.js";
import { ShowModalForItem } from "./map-item-settings.js";
import { ShowModalForDirections } from "./map-directions-settings.js";
import { createCoords, removeCoords } from "./map-points-coords.js";

export default function () {
  location.pathname.slice(-4, -1) == "new"
    ? console.log("Создание новой карты")
    : fetch(
        `./getmap/${location.pathname.substr(location.pathname.length - 24)}`,
        {
          method: "get",
        }
      )
        .then((res) => res.json())
        .then((response) => {
          let svg = document.querySelector("svg");
          Object.assign(_group, response.lables, response.rooms);
          Object.assign(_directions, response.directions);
          Object.assign(_lines, response.lines);
          Object.assign(_areas, response.areas);
          let circles = document.querySelectorAll("circle");
          for (let i = 0; i < circles.length; i++) {
            circles[i].addEventListener("mousedown", DragPoint);
            circles[i].addEventListener("mouseover", createCoords);
            circles[i].addEventListener("mouseout", removeCoords);
          }
          let labeles = document.querySelectorAll("#nav-label");
          for (let i = 0; i < labeles.length; i++) {
            labeles[i].addEventListener("mousedown", DragLabel);
            labeles[i].addEventListener("contextmenu", ShowModal);
          }
          let items = document.querySelectorAll("#nav-item");
          for (let i = 0; i < items.length; i++) {
            // items[i].addEventListener('contextmenu', ShowModalForItem) // нужно сделать контекcтное для items по примеру путей
          }
          let directions = document.querySelectorAll("#directions");
          for (let i = 0; i < directions.length; i++) {
            directions[i].addEventListener(
              "contextmenu",
              ShowModalForDirections
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });

  window.onload = () => {
    let images = document.querySelectorAll("#label-image");
    images.forEach((image) => {
      const transform = image.getAttribute("transform");
      image.setAttribute("transform", "");
      image.dataset.transform = transform;
      const svg = document.querySelector("svg");
    });
    window.onload = () => {
      let images = document.querySelectorAll("#label-image");
      images.forEach((image) => {
        const transform = image.getAttribute("transform");
        image.setAttribute("transform", "");
        image.dataset.transform = transform;
        const svg = document.querySelector("svg");
      });

      setTimeout(() => {
        images.forEach((image) => {
          image.setAttribute("transform", image.dataset.transform);
        });
        M.toast({ html: "карта загружена", classes: "rounded pulse ok" });
      }, 0);
    };
    setTimeout(() => {
      images.forEach((image) => {
        image.setAttribute("transform", image.dataset.transform);
      });
      M.toast({ html: "карта загружена", classes: "rounded pulse ok" });
    }, 0);
  };

  window.onerror = () => {
    M.toast({
      html: "при загрузке карты произошли ошибки",
      classes: "rounded pulse bad",
    });
  };
  window.onerror = () => {
    M.toast({
      html: "при загрузке карты произошли ошибки",
      classes: "rounded pulse bad",
    });
  };
}

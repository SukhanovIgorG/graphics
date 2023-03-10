import { options } from "./map-options";
import { optionsAreas } from "./map-options-areas";
import { _group, _directions, _lines, _areas } from "./map-set-object";
import { setMapHistory } from "./map-history";
import { selectionModeClick } from "./map-new";

function setElemAttribute(ELEM) {
  ELEM.setAttribute("stroke", options.color);
  ELEM.setAttribute("stroke-dasharray", options.dasharray);
  ELEM.setAttribute("stroke-width", options.width);
}

function setElemAreaAttribute(ELEM) {
  ELEM.setAttribute("stroke", optionsAreas.color);
  ELEM.setAttribute("stroke-dasharray", optionsAreas.dasharray);
  ELEM.setAttribute("stroke-width", optionsAreas.width);
  ELEM.setAttribute("fill", optionsAreas.fill);
}

const EditGroup = () => {
  if (event.shiftKey) {
    let elem = document.getElementById(event.target.id);
    if (elem.parentElement.id == "nav-item") {
      setElemAttribute(elem);
      elem.setAttribute("fill", options.fill);
      _group[event.target.dataset.group]["stroke"] = options.color;
      _group[event.target.dataset.group]["fill"] = options.fill;
      _group[event.target.dataset.group]["stroke-dasharray"] =
        options.dasharray;
      _group[event.target.dataset.group]["stroke-width"] = options.width;
    }
    if (elem.parentElement.id == "line") {
      setElemAttribute(elem);
      _lines[event.target.dataset.group]["stroke"] = options.color;
      _lines[event.target.dataset.group]["stroke-dasharray"] =
        options.dasharray;
      _lines[event.target.dataset.group]["stroke-width"] = options.width;
    }
    if (elem.parentElement.id == "area") {
      setElemAreaAttribute(elem);
      _areas[event.target.dataset.group]["stroke"] = optionsAreas.color;
      _areas[event.target.dataset.group]["fill"] = optionsAreas.fill;
      _areas[event.target.dataset.group]["stroke-dasharray"] =
        optionsAreas.dasharray;
      _areas[event.target.dataset.group]["stroke-width"] = optionsAreas.width;
    }
  }
  setMapHistory();
};

export { EditGroup };

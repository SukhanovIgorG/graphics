//--плоскость рисования
const panned = document.querySelector(".pan-zoom");
const svg = document.querySelector("#svg");
const wrapper = document.querySelector("#box");
const panZoom = svgPanZoom(svg, {
  viewportSelector: ".pan-zoom",
  dblClickZoomEnabled: false,
  maxZoom: 150,
  minZoom: 0.01,
});

//-
//--скролл
let scrollY = null;
window.onscroll = () => {
  scrollY = window.pageYOffset || document.documentElement.scrollTop;
};
//-

const _ming = "http://www.w3.org/2000/svg";

const _options = {
  snap: 10,
  width: 1,
  color: "black",
  dasharray: "0",
  fill: "rgba(0, 0, 0, 0.03)",
  grid: true,
  object_exemplar: [],
  point_exemplar: [],
};

const create_name = () => {
  return (
    "r" +
    ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    )
  );
};

const create_tag = (name, attrs) => {
  let tag = document.createElementNS(_ming, name);
  for (let attr in attrs) {
    tag.setAttribute(attr, attrs[attr]);
  }
  return tag;
};

const snap_to_grid = (coords) => {
  let temp = null;
  if (coords.length) {
    temp = [coords[0] % _options.snap, coords[1] % _options.snap];
    coords[0] -=
      temp[0] < _options.snap / 2 ? temp[0] : temp[0] - _options.snap;
    coords[1] -=
      temp[1] < _options.snap / 2 ? temp[1] : temp[1] - _options.snap;
    return coords;
  }
};

let _dataobject = {};
let _dellabels = [];
let _delitems = [];

let context = null; //контекст для рисования
let insidecontext = null;
let pointcontext = null;
let activecontextst = [];

const layersElem = document.body.querySelector(".layers");

const createLayerGroup = (level) => {
  const layerGroup = create_tag("g", {
    "data-layer-level": level,
    "data-layer-id": "",
    class: "layerGroup",
  });
  const labels = create_tag("g", {
    class: "labels",
  });

  layerGroup.appendChild(labels);

  return panned.appendChild(layerGroup);
};

const initLayers = () => {
  const activation = (elem) => {
    const { layerId } = elem.dataset;
    const layerGroup = panned.querySelector(
      `.layerGroup[data-layer-id="${layerId}"]`
    );

    elem.classList.add("layersItem_active");
    layerGroup.classList.add("layerGroup_active");
  };

  const inactivation = () => {
    const currentActive = layersElem.querySelector(".layersItem_active");

    currentActive.classList.remove("layersItem_active");
    panned
      .querySelector(".layerGroup_active")
      .classList.remove("layerGroup_active");
  };

  layersElem.querySelectorAll(".layersItem").forEach((item) => {
    const { layerLevel } = item.dataset;

    // createLayerGroup(layerLevel);

    item.addEventListener("click", (event) => {
      const { currentTarget } = event;

      if (currentTarget.classList.contains("layersItem_active")) {
        return;
      }

      inactivation();
      activation(currentTarget);
    });
  });

  activation(layersElem.querySelector(".layersItem"));
};

initLayers();

class MapGroup {
  constructor(id, options) {
    this.id = id;
    this.group = id;
    this.points = [];
    this.options = options;
    this.path;
    this.shadow_path;
    this.pathstring;
    this.endpoint = [];
  }

  updateData() {
    _dataobject[this.id] = {
      id: this.id,
      group: this.group,
      points: this.points,
      options: this.options,
      path: this.path,
      shadow_path: this.shadow_path,
      pathstring: this.pathstring,
      endpoint: this.endpoint,
    };
  }

  setcontext() {
    if (
      this.points.filter((p) => p.active == true).length > 0 ||
      this.options.active
    ) {
      if (!activecontextst.some((i) => i.id == this.id)) {
        activecontextst.push(this);
      }
    } else {
      activecontextst = activecontextst.filter((c) => c.id !== this.id);
    }
  }

  removecontext() {
    if (!!insidecontext) {
      insidecontext.updatePoint(pointcontext, { marked: false });
      insidecontext = null;
      pointcontext = null;
    } else if (labelcontext) {
      labelcontext.options.marked = false;
      labelcontext.updateLabel();
    }
  }

  createBezier(id, type, direction = "down") {
    let currentidx = this.points.findIndex((i) => i.id == id);
    if (
      this.points[currentidx].subtype !== "ccb" &&
      this.points[currentidx].subtype !== "qcb"
    ) {
      let x = this.points[currentidx].x;
      let y = this.points[currentidx].y;
      let pointbefore = direction == "down" ? 1 : -1;
      let point = this.points[currentidx - pointbefore];
      if (point) {
        let control_one; //контролирующие точки _one, _two
        let control_two;
        this.createPoint(
          {
            id: (control_one = create_name()),
            x: point.x + 10,
            y: point.y + 10,
            type: type == "ccb" ? "C" : "Q",
            subtype: type,
            active: false,
            managed: id,
          },
          currentidx - pointbefore + pointbefore
        );
        type == "ccb"
          ? this.createPoint(
              {
                id: (control_two = create_name()),
                x: x + 10,
                y: y + 10,
                type: "",
                subtype: type,
                active: false,
                managed: id, //контролируемая точка
              },
              currentidx - pointbefore + pointbefore + 1
            )
          : null;
        let control =
          type == "ccb" ? [control_one, control_two] : [control_one];
        this.updatePoint(id, { type: "", subtype: type, control: control });
        //this.updatePath()
        this.removecontext();
      }
    }
  }

  createPoint(circle, index = null, set = false) {
    const layerGroup = panned.querySelector(
      `.layerGroup[data-layer-level="${this.options.layerLevel}"]`
    );

    if (
      this.points.filter((p) => p.x == circle.x && p.y == circle.y).length ==
        0 &&
      set == false
    ) {
      let point = create_tag("circle", {
        id: circle.id,
        cx: circle.x,
        cy: circle.y,
        /* 'stroke': this.options.stroke */
      });
      layerGroup.querySelector(`#${this.group}`).appendChild(point);
      !!index ? this.points.splice(index, 0, circle) : this.points.push(circle);
      point.addEventListener("mousedown", () => {
        this.removecontext();
        insidecontext = this;
        pointcontext = point.id;
        this.updatePoint(point.id, { marked: true });
        DragPoint();
        return this;
      });
      point.addEventListener("dblclick", () => {
        let pointobj = this.points.find((i) => i.id == point.id);
        this.updatePoint(point.id, { active: !pointobj.active });
        this.setcontext();
        this.removecontext();
        return this;
      });
    } else if (set == true) {
      let point = create_tag("circle", {
        id: circle.id,
        cx: circle.x,
        cy: circle.y,
        /* 'stroke': this.options.stroke */
      });
      layerGroup.querySelector(`#${this.group}`).appendChild(point);
      !!index ? this.points.splice(index, 0, circle) : this.points.push(circle);
      point.addEventListener("mousedown", () => {
        this.removecontext();
        insidecontext = this;
        pointcontext = point.id;
        this.updatePoint(point.id, { marked: true });
        DragPoint();
        return this;
      });
      point.addEventListener("dblclick", () => {
        let pointobj = this.points.find((i) => i.id == point.id);
        this.updatePoint(point.id, { active: !pointobj.active });
        this.setcontext();
        this.removecontext();
        return this;
      });
    }
    return this;
  }

  createPath(element, shadowid) {
    const layerGroup = panned.querySelector(
      `.layerGroup[data-layer-level="${this.options.layerLevel}"]`
    );
    let group = create_tag("g", { id: this.id });
    let path = create_tag("path", {
      id: this.options.id,
      fill: this.options.fill,
      stroke: this.options.stroke,
      "stroke-width": this.options["stroke-width"],
      "stroke-dasharray": this.options["stroke-dasharray"],
      class: this.options.active
        ? `active ${
            this.options.exemplar.short ? this.options.exemplar.short : ""
          }`
        : this.options.exemplar.short
        ? this.options.exemplar.short
        : "",
    });
    let shadow_id = shadowid || create_name();
    let shadow_path = create_tag("path", {
      id: shadow_id,
      class: "shadow_path",
      width: 1,
      stroke: "none",
      "stroke-width": +this.options["stroke-width"] + 15,
      fill: "none",
    });
    group.appendChild(path);
    group.appendChild(shadow_path);
    shadow_path.addEventListener("dblclick", () => {
      this.updateOptions({ active: !this.options.active });
      this.setcontext();
    });
    layerGroup.insertBefore(group, layerGroup.querySelector(".labels"));
    this.path = this.options.id;
    this.shadow_path = shadow_id;
    //this.updateData()//----------------
    return this;
  }

  createLine(x, y) {
    this.endpoint = [x, y];
    document
      .querySelector(`#${this.path}`)
      .setAttribute(
        "d",
        `${this.pathstring}${x},${y}${!!this.options.open ? "" : "Z"}`
      );
    return this;
  }

  updatePoint(id, circle) {
    this.points = this.points.map((point) =>
      point.id == id ? Object.assign(point, circle) : point
    );
    let pointobj = this.points.find((i) => i.id == id);
    let p = document.querySelector(`#${id}`);
    p.setAttribute("cx", !!circle.x ? circle.x : p.getAttribute("cx"));
    p.setAttribute("cy", !!circle.y ? circle.y : p.getAttribute("cy"));
    !!circle.stroke ? p.setAttribute("stroke", circle.stroke) : null;
    if (pointobj.exemplar && circle.exemplar) {
      p.setAttribute("class", "");
      if (pointobj.exemplar.short !== "null") {
        p.classList.add(pointobj.exemplar.short);
      }
    }
    p.classList.toggle("active", pointobj.active);
    p.classList.toggle("marked", pointobj.marked);
    this.updateData();
    return this;
  }

  updatePath() {
    let path = "";
    this.points.map((point) => (path += `${point.type}${point.x},${point.y} `));
    document
      .querySelector(`#${this.path}`)
      .setAttribute("d", `${path}${!!this.options.open ? "" : "Z"}`);
    document
      .querySelector(`#${this.shadow_path}`)
      .setAttribute("d", `${path}${!!this.options.open ? "" : "Z"}`);
    this.pathstring = path;
    this.updateData();
    return this;
  }

  updateOptions(options = this.options) {
    this.options = Object.assign(this.options, options);
    let visibleoptions = {
      layerLevel: parseInt(this.options.layerLevel, 10),
      id: this.options.id,
      fill: this.options.fill,
      stroke: this.options.stroke,
      "stroke-width": this.options["stroke-width"],
      "stroke-dasharray": this.options["stroke-dasharray"],
      class: this.options.active
        ? `active ${
            this.options.exemplar.short
              ? this.options.exemplar.short !== "null"
                ? this.options.exemplar.short
                : ""
              : ""
          }`
        : this.options.exemplar.short
        ? this.options.exemplar.short !== "null"
          ? this.options.exemplar.short
          : ""
        : "",
    };
    for (let attr in visibleoptions) {
      document
        .querySelector(`#${this.path}`)
        .setAttribute(attr, visibleoptions[attr]);
    }
    document
      .querySelector(`#${this.shadow_path}`)
      .setAttribute("stroke-width", +this.options["stroke-width"] + 15);
    this.updatePath();
    return this;
  }

  deleteitems() {
    this.removecontext();
    if (this.options.active) {
      document.querySelector(`g #${this.id}`).remove();
      activecontextst = activecontextst.filter((c) => c.id !== this.id);
      delete _dataobject[this.id];
      _delitems.push(this.id);
      return;
    } else {
      for (const point of this.points) {
        if (point.active && !point.subtype && point.type !== "M") {
          this.points = this.points.filter((p) => p.id !== point.id);
          document.querySelector(`#${point.id}`).remove();
        } else if (point.active && point.control && point.type !== "M") {
          point.control.map((c) => {
            this.points = this.points.filter((p) => p.id !== c);
            document.querySelector(`#${c}`).remove();
          });
          this.points = this.points.filter((p) => p.id !== point.id);
          document.querySelector(`#${point.id}`).remove();
        } else if (point.active && point.managed && point.type !== "M") {
          this.updatePoint(point.managed, { type: "L" });
          let mainpoint = this.points.find((i) => i.id == point.managed);
          mainpoint.control.map((c) => {
            this.points = this.points.filter((p) => p.id !== c);
            document.querySelector(`#${c}`).remove();
          });
          delete mainpoint.control;
          delete mainpoint.subtype;
        } else if (point.type == "M" && this.points.length == 1) {
          document.querySelector(`g #${this.id}`).remove();
          activecontextst = activecontextst.filter((c) => c.id !== this.id);
          delete _dataobject[this.id];
          _delitems.push(this.id);
          return;
        }
      }
      this.updatePath();
    }
    activecontextst = activecontextst.filter((c) => c.id !== this.id);
    return this;
  }
}

//--------------------------------------**--------------------------------------//

const CreateCoords = () => {
  let currentTransform = window
    .getComputedStyle(panned)
    .getPropertyValue("transform")
    .match(/(-?[0-9\.]+)/g);
  let x =
    (event.clientX -
      wrapper.offsetLeft -
      wrapper.offsetParent.offsetLeft -
      currentTransform[4]) /
    currentTransform[0];
  let y =
    (event.clientY -
      wrapper.offsetTop -
      wrapper.offsetParent.offsetTop +
      scrollY -
      currentTransform[5]) /
    currentTransform[3];
  return snap_to_grid([x, y]);
};

const CreatePoint = () => {
  const { tagName } = event.target;

  if (
    tagName !== "circle" &&
    tagName !== "path" &&
    tagName !== "image" &&
    tagName !== "text"
  ) {
    let [x, y] = CreateCoords();
    const { layerLevel } =
      layersElem.querySelector(".layersItem_active").dataset;
    console.log("layerLevel", layerLevel);
    let name = new MapGroup(create_name(), {
      layerLevel: parseInt(layerLevel, 10),
      id: create_name(),
      open: false,
      fill: "none",
      stroke: _options.color,
      "stroke-width": _options.width,
      "stroke-dasharray": _options.dasharray,
      active: false,
      exemplar: {},
    });
    context = name;
    name
      .createPath(panned)
      .createPoint({ id: create_name(), x: x, y: y, type: "M", active: false })
      .updatePath();
  }
};

const DragPoint = () => {
  event.stopPropagation();
  let [x, y] = CreateCoords();
  if (insidecontext) {
    insidecontext.updatePoint(pointcontext, { x: x, y: y }).updatePath();
    document.querySelector(".coord_x").textContent = insidecontext.points.find(
      (p) => p.id == pointcontext
    ).x;
    document.querySelector(".coord_y").textContent = insidecontext.points.find(
      (p) => p.id == pointcontext
    ).y;
    document.querySelector(".shift_x").textContent = 0;
    document.querySelector(".shift_y").textContent = 0;
    document.addEventListener("mousemove", DragPoint);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", DragPoint);
      document.removeEventListener("mousedown", DragPoint);
    });
  }
};

const CreateLine = () => {
  if (!!context) {
    let [x, y] = CreateCoords();
    context.createLine(x, y);
  }
};

const ContinueCreatePoint = () => {
  let [x, y] = CreateCoords();
  context
    .createPoint({ id: create_name(), x: x, y: y, type: "L", active: false })
    .updatePath();
};

const CreateEndPoint = () => {
  let [x, y] = context.endpoint;
  context
    .createPoint({ id: create_name(), x: x, y: y, type: "L", active: false })
    .updatePath();
  svg.removeEventListener("mousemove", CreateLine);
  context = null;
};

const CreateCCB = () => {
  insidecontext.createBezier(pointcontext, "ccb");
};

const CreateQCB = () => {
  insidecontext.createBezier(pointcontext, "qcb");
};

const DeleteItems = () => {
  if (activecontextst.length > 0) {
    activecontextst.map((c) => c.deleteitems());
  }
};

const ClosePath = () => {
  if (activecontextst.length > 0) {
    activecontextst.map((c) => {
      c.updateOptions({ open: !c.options.open });
    });
  }
};

const AddPoint = (i) => {
  if (!!insidecontext) {
    let prevouspoint = insidecontext.points.find((i) => i.id == pointcontext);
    if (!!!prevouspoint.subtype) {
      let currentidx = insidecontext.points.findIndex(
        (i) => i.id == pointcontext
      );
      insidecontext
        .createPoint(
          {
            id: create_name(),
            x: prevouspoint.x + 7,
            y: prevouspoint.y + 7,
            type: "L",
            active: false,
          },
          currentidx - i
        )
        .updatePath();
    }
  }
};

//---------------------------------вынести------------------------------------------------------//
let labelcontext = null;
let labelactivecontext = [];

class MapLabel {
  constructor(id, options, data) {
    this.id = id;
    this.options = options;
    this.label;
    this.dx;
    this.dy;
    this.data = data;
  }

  updateData() {
    _dataobject[this.id] = {
      id: this.id,
      options: this.options,
      label: this.label,
      dx: this.dx || 0,
      dy: this.dy || 0,
      data: this.data,
    };
  }

  removecontext() {
    if (labelcontext) {
      labelcontext.options.marked = false;
      labelcontext.updateLabel();
    }
    if (!!insidecontext) {
      insidecontext.updatePoint(pointcontext, { marked: false });
      insidecontext = null;
      pointcontext = null;
    }
  }

  createLabel() {
    const layerGroup = panned.querySelector(
      `.layerGroup[data-layer-level="${this.options.layerLevel}"]`
    );
    let group = create_tag("g", { id: this.id });
    this.label = create_name();
    let label = create_tag(!!this.options.url ? "image" : "text", {
      id: this.label,
      x: this.options.x,
      y: this.options.y,
      width: this.options.width,
      transform: `translate(${this.options.translate[0]}, ${this.options.translate[1]}) rotate(${this.options.rotate})`,
    });
    !!this.options.url
      ? label.setAttribute("href", this.options.url)
      : (label.textContent = this.options.text);
    group.appendChild(label);
    group.addEventListener("mousedown", () => {
      this.removecontext();
      labelcontext = this;
      this.options.marked = true;
      let screenMatrix = panned.getScreenCTM();
      this.dx = event.clientX / screenMatrix.a;
      this.dy = event.clientY / screenMatrix.d;
      this.updateLabel();
      DragLabelPoint();
    });
    group.addEventListener("dblclick", () => {
      this.removecontext();
      if (this.options.active) {
        labelactivecontext = labelactivecontext.filter((l) => l.id !== this.id);
        this.options.active = !this.options.active;
      } else if (!this.options.active) {
        labelactivecontext.push(this);
        this.options.active = !this.options.active;
      }
      this.updateLabel();
    });
    layerGroup.querySelector(".labels").appendChild(group);
    this.updateData();
    return this;
  }

  updateLabel() {
    let l = document.querySelector(`#${this.label}`);
    if (l) {
      l.classList.toggle("active", this.options.active);
      l.classList.toggle("marked", this.options.marked);
    }
    return this;
  }

  updateOptions(options = this.options) {
    this.options = Object.assign(this.options, options);
    this.updateData();
    //this.removecontext()
    return this;
  }

  deleteitems() {
    svg.querySelector(`g #${this.id}`).remove();
    labelactivecontext = labelactivecontext.filter((l) => l.id !== this.id);
    delete _dataobject[this.id];
    _dellabels.push(this.id);
    return this;
  }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------//

const DragLabelPoint = () => {
  if (labelcontext) {
    let screenMatrix = panned.getScreenCTM();
    let x = event.clientX / screenMatrix.a - labelcontext.dx;
    let y = event.clientY / screenMatrix.d - labelcontext.dy;
    let shiftX = labelcontext.options.translate[0] + x;
    let shiftY = labelcontext.options.translate[1] + y;
    document
      .querySelector(`#${labelcontext.label}`)
      .setAttribute(
        "transform",
        `translate(${shiftX}, ${shiftY}) rotate(${labelcontext.options.rotate})`
      );
    document.querySelector(".coord_x").textContent = labelcontext.options.x;
    document.querySelector(".coord_y").textContent = labelcontext.options.y;
    document.querySelector(".shift_x").textContent = shiftX; //.toFixed(2)
    document.querySelector(".shift_y").textContent = shiftY; //.toFixed(2)
    document.addEventListener("mousemove", DragLabelPoint);
    document.onmouseup = () => {
      labelcontext.updateOptions({ translate: [shiftX, shiftY] });
      document.removeEventListener("mousemove", DragLabelPoint);
      document.removeEventListener("mousedown", DragLabelPoint);
      document.onmouseup = null;
    };
  }
};

const CreateLabel = () => {
  let [x, y] = CreateCoords();
  const { layerLevel } = layersElem.querySelector(".layersItem_active").dataset;
  let label = new MapLabel(create_name(), {
    layerLevel: parseInt(layerLevel, 10),
    x: x,
    y: y,
    width: 100,
    translate: [0, 0],
    rotate: 45,
    active: false,
    marked: false,
    //'text': 'XYNваивыаиы'
    url: "/./uploads/nav/1571989847030-nav-Artrama-bk.svg",
  });
  label.createLabel();
};

const DeleteLabel = () => {
  if (labelactivecontext.length > 0) {
    labelactivecontext.map((l) => l.deleteitems());
  }
};

const Draw = () => {
  if (event.button == 0 && !event.ctrlKey) {
    !!context ? ContinueCreatePoint() : CreatePoint();
    svg.addEventListener("mousemove", CreateLine);
  } else if (event.ctrlKey) {
    CreateLabel();
  }
};

const StopDraw = () => {
  if (event.key == "Enter" && !!context) {
    CreateEndPoint();
  } else if (event.key == "C") {
    CreateCCB();
  } else if (event.key == "Q") {
    CreateQCB();
  } else if (event.key == "Delete" || event.key == "Backspace") {
    DeleteItems();
    DeleteLabel();
  } else if (event.key == "Z") {
    ClosePath();
  } else if (event.key == "+") {
    AddPoint(-1);
  } else if (event.key == "-") {
    AddPoint(0);
  } else if (event.key == "*") {
    console.log(_dataobject);
  }
};

//--------------------utils----------------------------------//
const border = document.querySelectorAll("#line li"); //-толщина и вид линии
for (let i = 0; i < border.length; i++) {
  const borderWidthBtn = border[i];
  borderWidthBtn.addEventListener("click", () => {
    event.preventDefault();
    let activeBorderWidth = document.querySelector("#line .active");
    activeBorderWidth.classList.remove("active");
    _options.width = borderWidthBtn.querySelector("small").textContent;
    _options.dasharray =
      borderWidthBtn.querySelector("small").dataset.dasharray;
    borderWidthBtn.classList.add("active");
    if (insidecontext) {
      insidecontext.updateOptions({
        "stroke-width": _options.width,
        "stroke-dasharray": _options.dasharray,
      });
    }
  });
}

const border_color = document.querySelectorAll("#border_color li div"); //-цвет линии
for (let i = 0; i < border_color.length; i++) {
  const border_color_btn = border_color[i];
  border_color_btn.addEventListener("click", () => {
    event.preventDefault();
    let activeColor = document.querySelector("#border_color .active");
    activeColor.classList.remove("active");

    _options.color = border_color_btn.style.backgroundColor;
    border_color_btn.parentNode.classList.add("active");
    if (insidecontext) {
      insidecontext.updateOptions({
        stroke: _options.color,
      });
    }
  });
}

const fill_color = document.querySelectorAll("#fill_color li div"); //-цвет заливки
for (let i = 0; i < fill_color.length; i++) {
  const fill_color_btn = fill_color[i];
  fill_color_btn.addEventListener("click", () => {
    event.preventDefault();
    let activeColor = document.querySelector("#fill_color .active");
    activeColor.classList.remove("active");
    _options.fill =
      fill_color_btn.style.backgroundColor.length == 0
        ? "none"
        : fill_color_btn.style.backgroundColor;
    fill_color_btn.parentNode.classList.add("active");
    if (insidecontext) {
      insidecontext.updateOptions({
        fill: _options.fill,
      });
    }
  });
}

let grid = document.querySelectorAll("#grid_cell small"); //-размер сетки///поправить область нажатия
let gridControl = document.querySelector("#grid_control");
for (let i = 0; i < grid.length; i++) {
  const gridBtn = grid[i];
  gridBtn.addEventListener("click", () => {
    let activeGrid = document.querySelector("#grid_cell .active");
    activeGrid.classList.remove("active");
    gridBtn.parentNode.classList.add("active");
    _options.grid == true
      ? gridControl.setAttribute("fill", `url(#grid${gridBtn.textContent})`)
      : gridControl.setAttribute("fill", `none`);
    _options.snap = gridBtn.textContent == "Нет" ? 1 : +gridBtn.textContent;
  });
}

document.querySelector("#object_type").addEventListener("change", () => {
  let valarr = event.target.value.split(",");
  insidecontext.updateOptions({
    exemplar: { short: !!valarr[1] ? valarr[1] : "null", name: valarr[0] },
  });
});

document.querySelector("#point_type").addEventListener("change", () => {
  let valarr = event.target.value.split(",");
  insidecontext.updatePoint(pointcontext, {
    exemplar: { short: !!valarr[1] ? valarr[1] : "null", name: valarr[0] },
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems, { edge: "right" });
});

//--------------------добавление подписей-------------------------//

let set_label_point = document.querySelectorAll(".set_point");
for (let i = 0; i < set_label_point.length; i++) {
  const btn = set_label_point[i];
  btn.addEventListener("click", () => {
    let targetpoint = insidecontext.points.find((p) => p.id == pointcontext);
    let settings = {
      x: targetpoint.x + 10,
      y: targetpoint.y + 10,
      width: 100,
      translate: [0, 0],
      rotate: 0,
      active: false,
      marked: false,
      object_link: insidecontext.id,
      point_link: pointcontext,
      category: event.target.dataset.cat == "true" ? true : false,
    };
    if (event.target.parentNode.parentNode.querySelector("input").checked) {
      settings.text = event.target.dataset.text;
    } else {
      if (event.target.dataset.logotype !== "/undefined") {
        settings.url = event.target.dataset.logotype;
      } else {
        let toastHTML = `<span>У объекта отсутствует изображение!</span>`;
        M.toast({ html: toastHTML, classes: "rounded pulse bad" });
        return;
      }
    }
    let label = new MapLabel(
      create_name(),
      settings,
      event.target.dataset.navobject
    );
    label.createLabel();
  });
}

let set_label_object = document.querySelectorAll(".set_object");
for (let i = 0; i < set_label_object.length; i++) {
  const btn = set_label_object[i];
  btn.addEventListener("click", () => {
    let targetpoint = insidecontext.points[0];
    let settings = {
      x: targetpoint.x + 10,
      y: targetpoint.y + 10,
      width: 100,
      translate: [0, 0],
      rotate: 0,
      active: false,
      marked: false,
      object_link: insidecontext.id,
      point_link: null,
      category: event.target.dataset.cat == "true" ? true : false,
    };
    if (event.target.parentNode.parentNode.querySelector("input").checked) {
      settings.text = event.target.dataset.text;
    } else {
      if (event.target.dataset.logotype !== "/undefined") {
        settings.url = event.target.dataset.logotype;
      } else {
        let toastHTML = `<span>У объекта отсутствует изображение!</span>`;
        M.toast({ html: toastHTML, classes: "rounded pulse bad" });
        return;
      }
    }
    let label = new MapLabel(
      create_name(),
      settings,
      event.target.dataset.navobject
    );
    label.createLabel();
  });
}
const loadtriger = document.querySelector(".load").dataset.edited;

function getMapScreenshot(svgElement, layerId, callback) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const svgURL = new XMLSerializer().serializeToString(svgElement);
  const div = document.createElement("div");
  let resultImage = "";

  div.innerHTML = svgURL;

  const svgCopy = div.querySelector("#svg");

  svgCopy.querySelector("#grid").remove();
  svgCopy.querySelector("#horizontal_center").remove();
  svgCopy.querySelector("#vertical_center").remove();
  svgCopy.querySelectorAll(".layerGroup").forEach((item) => {
    if (item.dataset.layerId !== layerId) {
      item.remove();
    }
  });

  const svgCopyURL = new XMLSerializer().serializeToString(svgCopy);
  const img = new Image();

  canvas.width = svgElement.clientWidth;
  canvas.height = svgElement.clientHeight;

  img.onload = function () {
    ctx.drawImage(this, 0, 0);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let minX = canvas.width;
    let maxX = 0;
    let minY = canvas.height;
    let maxY = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;

        if (imageData.data[index + 3] > 0) {
          if (minX > x) {
            minX = x;
          }

          if (x > maxX) {
            maxX = x;
          }

          if (minY > y) {
            minY = y;
          }

          if (y > maxY) {
            maxY = y;
          }
        }
      }
    }

    imageData = null;

    if (maxX > minX || maxY > minY) {
      const cropedImageData = ctx.getImageData(minX, minY, maxX, maxY);
      const cropedWidth = maxX - minX;
      const cropedHeight = maxY - minY;
      const ratioX = cropedWidth / cropedHeight;
      const offset = 25;
      const secondCanvas = document.createElement("canvas");
      const secondCtx = secondCanvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      secondCanvas.width = cropedWidth + offset * 2;
      secondCanvas.height = cropedHeight + offset * 2;

      secondCtx.putImageData(cropedImageData, offset, offset);

      canvas.width = 240;
      canvas.height = canvas.width / ratioX;
      ctx.drawImage(secondCanvas, 0, 0, canvas.width, canvas.height);

      resultImage = canvas.toDataURL("image/webp");

      console.log(resultImage);

      callback(resultImage);
    } else {
      callback(resultImage);
    }
  };

  img.src =
    "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgCopyURL);
}

const updateLayersData = () => {
  const layerItems = document.querySelectorAll(".layersItem");
  const schemaId = document.querySelector(".load").dataset.edited;
  const promises = [];

  layerItems.forEach((item, index) => {
    const { layerId } = item.dataset;

    promises[promises.length] = new Promise((resolve) => {
      getMapScreenshot(
        document.querySelector("#svg"),
        layerId,
        (resultImage) => {
          const layer = {
            id: layerId,
            image: resultImage,
          };
          const data = {
            schemaId,
            layer,
          };

          fetch(`./layers/update`, {
            method: "post",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          }).finally(resolve);
        }
      );
    });
  });

  return new Promise((resolve) => {
    Promise.all(promises).then().catch().finally(resolve);
  });
};
//----------------------------сохранение схемы---------------------------------------//
const savebtn = document.querySelector(".save_schema");
savebtn.addEventListener("click", () => {
  let schema = {
    name: document.querySelector("#schema-name").value,
    info: document
      .querySelector("#schema-info")
      .value.replace(/^\s*/, "")
      .replace(/\s*$/, ""),
    floor: document.querySelector("#schema-floor").value,
    /* center: [+center.getAttribute('cx'), +center.getAttribute('cy')], */
    _dataobject,
    _delitems,
    _dellabels,
  };
  const promises = [];

  promises[promises.length] = fetch(`./${loadtriger}`, {
    method: "post",
    body: JSON.stringify(schema),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status == 200) {
        let toastHTML = `<span>Сохранено!</span>`;
        M.toast({ html: toastHTML, classes: "rounded pulse ok" });
      } else {
        let toastHTML = `<span>Сохранение не удалось!</span>`;
        M.toast({ html: toastHTML, classes: "rounded pulse bad" });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  promises[promises.length] = updateLayersData();

  Promise.all(promises)
    .then()
    .catch()
    .finally(() => {
      console.log("all updated");
    });
});

//----------------------------загрузка схемы-----------------------------------//
// const loadtriger = document.querySelector(".load").dataset.edited;
if (loadtriger.length > 0) {
  fetch(`./getschema/${loadtriger}`, {
    method: "get",
  })
    .then((res) => res.json())
    .then((response) => {
      response.items.map((i) => {
        let name = new MapGroup(i.domid, {
          layerLevel: i.options.layerLevel || 0,
          id: i.options.id,
          open: i.options.open,
          fill: i.options.fill,
          stroke: i.options.stroke,
          "stroke-width": i.options.width,
          "stroke-dasharray": i.options.dasharray,
          active: i.options.active,
          exemplar: i.options.exemplar || {},
        });
        name.createPath(panned, i.shadow_path);
        i.points.map((p) => {
          let pointitem = { ...p, marked: false, active: false };
          if (!!!p.control.length) {
            delete pointitem.control;
          }
          name.createPoint({ ...pointitem }, null, true);
          name.updatePoint(p.id, { ...pointitem });
        });
        name.updatePath();
      });
      response.labels.map((l) => {
        let label = new MapLabel(
          l.domid,
          {
            layerLevel: l.options.layerLevel || 0,
            x: l.options.x,
            y: l.options.y,
            width: l.options.width,
            translate: l.options.translate,
            rotate: l.options.rotate,
            active: l.options.active,
            marked: l.options.marked,
            text: l.options.text,
            object_link: l.options.object_link,
            point_link: l.options.point_link,
            category: l.options.category,
          },
          l.object_ref || l.category_ref
        );
        label.createLabel();
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

svg.addEventListener("mousedown", Draw);
document.addEventListener("keydown", StopDraw);

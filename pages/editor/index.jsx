import { useRef, useState, useEffect, createElement } from "react";
import crypto from "crypto";
import {
  INITIAL_VALUE,
  ReactSVGPanZoom,
  TOOL_NONE,
  fitSelection,
  zoomOnViewerCenter,
  fitToViewer,
} from "react-svg-pan-zoom";

import { Layout, Svg } from "@/components";
import { circles } from "./constants";

import classes from "./editor.module.css";

export default function Editor() {
  const Viewer = useRef(null);
  const [tool, setTool] = useState(TOOL_NONE);
  const [value, setValue] = useState(INITIAL_VALUE);
  const [circlesArray, setCirclesArray] = useState(circles);
  const [draw, setDraw] = useState(true);

  const drawController = (event) => {
    console.log("click", event.x, event.y, event.originalEvent);
    const randomId = self.crypto
      .getRandomValues(new Uint32Array(10))
      .toString()
      .slice(0, 16);
    const N = {
      x: Math.round(event.x),
      y: Math.round(event.y),
      r: 30,
      color: "yellow",
      width: 4,
      id: randomId,
    };
    setCirclesArray((pre) => [...pre, N]);
  };
  useEffect(() => {
    Viewer.current.fitToViewer();
  }, []);

  /* Read all the available methods in the documentation */
  const _zoomOnViewerCenter1 = () => Viewer.current.zoomOnViewerCenter(1.1);
  const _fitSelection1 = () => Viewer.current.fitSelection(0, 0, 200, 200);
  const _fitToViewer1 = () => Viewer.current.fitToViewer();

  /* keep attention! handling the state in the following way doesn't fire onZoom and onPam hooks */
  const _zoomOnViewerCenter2 = () => setValue(zoomOnViewerCenter(value, 0.8));
  const _fitSelection2 = () =>
    setValue(fitSelection(value, 40, 40, 2000, 2000));
  const _fitToViewer2 = () => setValue(fitToViewer(value));

  return (
    <Layout>
      <button className="btn" onClick={() => _zoomOnViewerCenter1()}>
        Zoom on center (mode 1)
      </button>
      <button className="btn" onClick={() => _fitSelection1()}>
        Zoom area 200x200 (mode 1)
      </button>
      <button className="btn" onClick={() => _fitToViewer1()}>
        Fit (mode 1)
      </button>
      <hr />

      <button className="btn" onClick={() => _zoomOnViewerCenter2()}>
        Zoom from center (mode 2)
      </button>
      <button className="btn" onClick={() => _fitSelection2()}>
        Zoom area 2000x2000 (mode 2)
      </button>
      <button className="btn" onClick={() => _fitToViewer2()}>
        Fit (mode 2)
      </button>
      <hr />

      <ReactSVGPanZoom
        ref={Viewer}
        width={1000}
        height={600}
        tool={tool}
        onChangeTool={setTool}
        value={value}
        onChangeValue={setValue}
        onZoom={(e) => console.log("zoom", e)}
        onPan={(e) => console.log("pan", e)}
        onClick={drawController}
      >
        <svg
          onMouseMove={() => {
            console.log("onMouseMove :>> ");
          }}
          width={5000}
          height={5000}
        >
          <Svg circles={circlesArray}></Svg>
        </svg>
      </ReactSVGPanZoom>
    </Layout>
  );
}

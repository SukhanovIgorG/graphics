import { useRef, useState, useEffect, createElement } from 'react';
import ReactDOM from 'react-dom';
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE, fitSelection, zoomOnViewerCenter, fitToViewer } from 'react-svg-pan-zoom';

import { Layout } from "@/components/Layout"
import classes from "./editor.module.css"
import Svg from './svg';
import crypto from 'crypto';

// const CreateName = () =>
//   "r" +
//   String(1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
//     (
//       c ^
//       (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
//     ).toString(16)
//   );

// const CreateTag = (tagName: string, tagAttr: any) => {
//   const ming = "http://www.w3.org/2000/svg";
//   let tag = document.createElementNS(ming, tagName)
//   for (let attr in tagAttr) {
//     tag.setAttribute(attr, tagAttr[attr])
//   }
//   return tag
// }



// const ContCreatePoint = (e) => {
//   let objName = CreateName();
//   console.log('objName :>> ', objName);

//   let point = CreateTag("circle", {
//     cx: e.x,
//     cy: e.y,
//     id: objName,
//     "data-object": objName,
//     "data-type": "L",
//   });
//   const group = document.querySelector('#items-group')
//   group?.appendChild(point);
// };

// const CreatePoint = (e: any) => {
//   let objName = CreateName();

//   let pX = e.x
//   let pY = e.y
//   // let snap = snapToGrid([pX, pY]);
//   // lastPoint = snap;
//   // CreatePath();
//   let objID = "point"
//   let point = CreateTag("circle", {
//     cx: e.x,
//     cy: e.y,
//     id: objID,
//     "data-object": objName,
//     "data-group": 'group-item',
//     "data-type": "M",
//   })
//   Group?.appendChild(point);
//   let fill = "none"
//   let width = 1
//   let color = "black"
//   let dasharray = "none"
// };

// const CreateLine = (e) => {
//   let lX = e.x
//   let lY = e.y
//   let path = null
//   console.log('object :>> ', lX, lY);
// };

// const Draw = (event: any) => {
//   let objName = CreateName();
//   CreatePoint(event);
// }





export default function Editor() {

  interface ICircles {
    x: number,
    y: number,
    r: number,
    color: string,
    width: number,
    id: string
  }
  const circles: ICircles[] = [
    {
      x: 10,
      y: 10,
      r: 10,
      color: "red",
      width: 2,
      id: "898798784964"
    }, {
      x: 30,
      y: 30,
      r: 20,
      color: "yellow",
      width: 4,
      id: "898798784965"
    }
  ]

  const Viewer = useRef(null);
  const [tool, setTool] = useState(TOOL_NONE)
  const [value, setValue] = useState(INITIAL_VALUE)
  const [circlesArray, setCirclesArray] = useState(circles)
  const [draw, setDraw] = useState(true)

  const drawController = (event: any) => {
    console.log('click', event.x, event.y, event.originalEvent)
    const array = new Uint32Array(10);
    const randomId = self.crypto.getRandomValues(array).toString().slice(0, 10);
    const N = {
      x: Math.round(event.x),
      y: Math.round(event.y),
      r: 30,
      color: "yellow",
      width: 4,
      id: randomId
    }
    setCirclesArray(pre => [...pre, N])
  }
  useEffect(() => {
    Viewer.current.fitToViewer();
  }, []);

  /* Read all the available methods in the documentation */
  const _zoomOnViewerCenter1 = () => Viewer.current.zoomOnViewerCenter(1.1)
  const _fitSelection1 = () => Viewer.current.fitSelection(0, 0, 200, 200)
  const _fitToViewer1 = () => Viewer.current.fitToViewer()

  /* keep attention! handling the state in the following way doesn't fire onZoom and onPam hooks */
  const _zoomOnViewerCenter2 = () => setValue(zoomOnViewerCenter(value, 0.8))
  const _fitSelection2 = () => setValue(fitSelection(value, 40, 40, 2000, 2000))
  const _fitToViewer2 = () => setValue(fitToViewer(value))

  return (
    <Layout>
      <button className="btn" onClick={() => _zoomOnViewerCenter1()}>Zoom on center (mode 1)</button>
      <button className="btn" onClick={() => _fitSelection1()}>Zoom area 200x200 (mode 1)</button>
      <button className="btn" onClick={() => _fitToViewer1()}>Fit (mode 1)</button>
      <hr />

      <button className="btn" onClick={() => _zoomOnViewerCenter2()}>Zoom from center (mode 2)</button>
      <button className="btn" onClick={() => _fitSelection2()}>Zoom area 2000x2000 (mode 2)</button>
      <button className="btn" onClick={() => _fitToViewer2()}>Fit (mode 2)</button>
      <hr />

      <ReactSVGPanZoom
        ref={Viewer}
        width={1000} height={600}
        tool={tool} onChangeTool={setTool}
        value={value} onChangeValue={setValue}
        onZoom={e => console.log('zoom')}
        onPan={e => console.log('pan')}
        onClick={drawController}
      >
        <svg onMouseMove={() => { console.log('onMouseMove :>> ',); }} width={5000} height={5000} >
          <Svg circles={circlesArray}></Svg>
        </svg>

      </ReactSVGPanZoom>
    </Layout>
  )
}
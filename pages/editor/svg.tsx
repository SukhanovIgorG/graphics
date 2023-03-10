import { createPublicKey } from "crypto";
import { Defs } from "./defs";

export default function Svg(props: any) {

  const { circles } = props
  console.log('circles :>> ', circles);

  return (
    <>
      <Defs />
      <g >

        <rect id="grid" fill="url(#grid100)" width="5000" height="5000" y="0" x="0"></rect>
        <path id="horizontal_center" d="M0,2500 5000,2500" fill="none" stroke="#2196f3" strokeWidth="1"></path>
        <path id="vertical_center" d="M2500,0 2500,5000" fill="none" stroke="#2196f3" strokeWidth="1"></path>
        <g id="areas-group"></g>
        <g id="directions-group"></g>
        <g id="lines-group"></g>
        <g id="items-group">
          {circles.map((circle: any) => { return <circle cx={circle.x} cy={circle.y} strokeWidth={circle.width} fill={circle.color} r={circle.r} key={circle.id} id={circle.id} /> })}
        </g>
      </g>
    </>
  )
}
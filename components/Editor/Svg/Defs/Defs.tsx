export const Defs = () => {
  return (
    <defs>
      <pattern id="grid2" width="2" height="2" patternUnits="userSpaceOnUse">
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#bdbdbd" strokeWidth=".5"></path>
      </pattern>
      <pattern id="grid5" width="5" height="5" patternUnits="userSpaceOnUse">
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#bdbdbd" strokeWidth="1"></path>
      </pattern>
      <pattern id="grid10" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#bdbdbd" strokeWidth="1"></path>
      </pattern>
      <pattern id="grid20" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#bdbdbd" strokeWidth="1"></path>
      </pattern>
      <pattern id="grid25" width="25" height="25" patternUnits="userSpaceOnUse">
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#bdbdbd" strokeWidth="1"></path>
      </pattern>
      <pattern id="grid100" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect id="grid_control" width="100" height="100" fill="url(#grid10)"></rect>
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#9e9e9e" strokeWidth="1"></path>
      </pattern>
      <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="black" strokeWidth="1"></path>
      </pattern>
      <pattern id="backlight" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
        <circle id="patt" fill="blue" cx="2.5" cy="2.5" r="2"></circle>
      </pattern>
      <marker id="end-circle" markerUnits="userSpaceOnUse" markerWidth="40" markerHeight="40" refX="0" refY="0" orient="auto">
        <rect x="0" y="0" width="40" height="20" stroke="black" fill="grey" fillOpacity="0.5"></rect>
        <circle cx="10" cy="10" r="10" fill="red" strokeWidth="1px" stroke="teal"></circle>
      </marker>
    </defs>
  )
}
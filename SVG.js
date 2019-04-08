class SVG{

  setExportType(type){
    this.type = type;
  }
  generate(points, width, height){
    let svgCode = [];
    svgCode[0] = `<svg height="`+height+`" width="`+width+`">
    <polygon points="`;

    for(let i = 0; i < points.length; i++){
      svgCode[0] += "" + points[i].x + "," + points[i].y+" ";
    }

    svgCode[0] += `" style="fill:grey; stroke: black; stroke-width:1"/>
    </svg>
    `;

    saveStrings(svgCode, 'hello', this.type);
  }


}

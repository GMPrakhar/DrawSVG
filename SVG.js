class SVG{

  setExportType(type){
    this.type = type;
  }

  setFillColor(color){
    this.fill = color;
  }

  generatePolygon(figures, width, height){
    let svgCode = [];
    svgCode[0] = `<svg height="`+height+`" width="`+width+`">`;
    for(let j = 0; j < figures.length; j++){
      let points = figures[j].points;
      let translates = figures[j].translate;
      svgCode[0] += `
      <polygon points="`;

      for(let i = 0; i < points.length; i++){
        svgCode[0] += "" + (points[i].x  + translates[0]) + "," + (points[i].y + translates[1]) +" ";
      }

      svgCode[0] += `" style="fill:`+figures[j].fill+`; stroke: black; stroke-width:1"/>`
    }
    svgCode[0] += `
    </svg>
    `;


    saveStrings(svgCode, 'hello', this.type);
  }


}

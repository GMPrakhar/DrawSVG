let points = [];
let figureComplete = false; // If the figure is ready for fill or not
let captureRange = 20;      // Distance upto which mouse Click will be captured
let svg;                    // Obkect of class SVG to generate the final output
let canvasStart = 300;      // Signifying the starting X coordinate of Canvas
let maxX, maxY;             // Maximum X and Y for size of SVG
let generateButtonStyle = `
display: block;
background: #f44336;
color: white;
border: none;
padding: 15px;
font-size: 15px;
`;

let extensionSelectStyle = `
display: block;
border: 0.5px solid grey;
padding: 10px;
font-size: 15px;
`;

let ext;
function setup(){
  let canvas = createCanvas(windowWidth-canvasStart, windowHeight);
  canvas.position(canvasStart, 0);
  svg = new SVG();
  // ------------------- CODE FOR HTML ELEMENTS ---------------------

  //Export As Option Field
  ext = createSelect();
  ext.position(100, 80);
  ext.option("Export As...");
  ext.option("HTML");
  ext.option("SVG");
  ext.style(extensionSelectStyle);
  ext.changed(changeExportType);


  let button = createButton('Generate');
  button.position(100, 150);
  button.style(generateButtonStyle);
  button.mousePressed(generateSVG);



  //------------------ HTML ELEMENTS CODE END ------------------------

}

function draw(){
  background(255);
  fill(175);


  // If figure is Complete, then fill the colour in the polygon
  if(figureComplete){
    beginShape();
    for(let i = 0; i < points.length; i++){
      if(i!= points.length-1){
        vertex(points[i].x, points[i].y);
        vertex(points[(i+1)].x, points[(i+1)].y );
      }
    }
    endShape();
  }else {

    // else if figure is not complete, then just draw the line
    // between the clicked vertices
    for(let i = 0; i < points.length; i++){
      if(i!= points.length-1){
        line(points[i].x, points[i].y,points[(i+1)].x, points[(i+1)].y );
      }else if(points.length > 2){

        // If last point's location equals that of the first points,
        // then the figure is complete
        if(points[i].x == points[0].x && points[i].y == points[0].y){
          figureComplete = true;
        }
      }
    }
  }


  // If User is near the first pixel, Capture the mouse even if
  // mouse position is not exactly equal to first pixel position
  if(points.length > 2){
    if(abs(mouseX-points[0].x) < 30 && abs(mouseY-points[0].y) < captureRange){
      fill(183, 123, 58);
      ellipse(points[0].x, points[0].y, captureRange, captureRange);
      fill(0);
      ellipse(points[0].x, points[0].y, captureRange/2, captureRange/2);
    }
  }


}

function mouseClicked(){
  if(mouseX>0){
    if(points.length > 2){

      // Capture the end point to first vertex if mouse is clicked inside the captue Range
      if(abs(mouseX-points[0].x) < 30 && abs(mouseY-points[0].y) < captureRange){
        points.push(createVector(points[0].x, points[0].y));
      }else{
        points.push(createVector(mouseX, mouseY));
      }
    }else {
      points.push(createVector(mouseX, mouseY));
    }
    maxX = max(maxX, mouseX);
    maxY = max(maxY, mouseY);
  }
}


function generateSVG(){
  svg.generate(points, maxX, maxY);
}

function changeExportType(){
  svg.setExportType(ext.value());
}

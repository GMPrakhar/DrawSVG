let figures = [];           // Array of Different Figures
let currentFigure = new Figure({type: "polygon", figureComplete: false, fill: 175, points: [], translate: [0,0], bounds: [1000,1000,0,0]});  //Default Figure to be drawn is polygon
let captureRange = 20;      // Distance upto which mouse Click will be captured
let svg;                    // Obkect of class SVG to generate the final output
let canvasStart = 300;      // Signifying the starting X coordinate of Canvas
let maxX, maxY;             // Maximum X and Y for size of SVG
let movingFigure;           // Current Figure which is being moved
let dragging = false;
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
  figures.push(currentFigure);
  let canvas = createCanvas(windowWidth-canvasStart, windowHeight);
  canvas.position(canvasStart, 0);
  svg = new SVG();
  // ------------------- CODE FOR HTML ELEMENTS ---------------------


  // Dragging Figure option
  let draggable = createButton('Toggle Dragging');
  draggable.position(100, 30);
  draggable.style("padding: 10px;");
  draggable.mousePressed(startDragging);

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


  // If figure is Complete, then fill the colour in the polygon
  for(let n = 0; n < figures.length; n++){

    let points = figures[n].points;
    let translates = figures[n].translate;
    if(figures[n]==movingFigure){

      // Draw a bound around the figure which is currently selected
      let bounds = movingFigure.bounds;
      let translates = movingFigure.translate;
      stroke(255,0,0);
      fill(255,255,255,0);
      rect(translates[0]+bounds[0], translates[1]+bounds[1], bounds[2]-bounds[0], bounds[3]-bounds[1]);
    }
    stroke(0);
    if(figures[n].figureComplete){
      push();
      //translate if user is dragging the figure with the mouse
      translate(figures[n].translate[0], figures[n].translate[1]);
      fill(figures[n].fill)
      beginShape();
      for(let i = 0; i < figures[n].points.length; i++){
        if(i!= figures[n].points.length-1){
          vertex(figures[n].points[i].x, figures[n].points[i].y);
          vertex(figures[n].points[(i+1)].x, figures[n].points[(i+1)].y );
        }
      }
      endShape();
      pop();
    }else {

      // else if figure is not complete, then just draw the line
      // between the clicked vertices
      for(let i = 0; i < points.length; i++){
        if(i!= points.length-1){
          push();
          //translate if user is dragging the figure with the mouse
          translate(figures[n].translate[0], figures[n].translate[1]);
          line(points[i].x, points[i].y,points[(i+1)].x, points[(i+1)].y );
          pop();
        }else if(points.length > 2){

          // If last point's location equals that of the first points,
          // then the figure is complete
          if(points[i].x == points[0].x && points[i].y == points[0].y){
            figures[n].figureComplete = true;
            currentFigure = new Figure({type: "polygon", figureComplete: false, fill: 175, points: [], translate: [0,0], bounds: [1000,1000,0,0]});
            figures.push(currentFigure);
          }
        }
      }
    }

    // If User is near the first pixel, Capture the mouse even if
    // mouse position is not exactly equal to first pixel position

    if(points.length > 2 && !figures[n].figureComplete){
      if(abs(mouseX-points[0].x-translates[0]) < captureRange && abs(mouseY-points[0].y-translates[1]) < captureRange){
        fill(183, 123, 58);
        ellipse(points[0].x+translates[0], points[0].y+translates[1], captureRange, captureRange);
        fill(0);
        ellipse(points[0].x+translates[0], points[0].y+translates[1], captureRange/2, captureRange/2);
      }
    }
  }
}

function mouseClicked(){

  let points = currentFigure.points;
  let translates = currentFigure.translate;
  if(mouseX>0 && !dragging){
    if(points.length > 2){

      // Capture the end point to first vertex if mouse is clicked inside the captue Range
      if(abs(mouseX-points[0].x-translates[0]) < captureRange && abs(mouseY-points[0].y-translates[1]) < captureRange){
        points.push(createVector(points[0].x, points[0].y));
      }else if(!currentFigure.figureComplete){
        points.push(createVector(mouseX-translates[0], mouseY-translates[1]));
      }
    }else if(!currentFigure.figureComplete){
      points.push(createVector(mouseX, mouseY));
    }
    maxX = max(maxX, mouseX);
    maxY = max(maxY, mouseY);
    currentFigure.bounds[0] = min(currentFigure.bounds[0], mouseX);
    currentFigure.bounds[1] = min(currentFigure.bounds[1], mouseY);
    currentFigure.bounds[2] = max(currentFigure.bounds[2], mouseX);
    currentFigure.bounds[3] = max(currentFigure.bounds[3], mouseY);

  }

  for(let i = 0; i < figures.length; i++){
    let fig = figures[i] ;
    let bounds = fig.bounds;
    let translates = fig.translate;
    //console.log(fig.bounds);
    if(dragging && mouseX>=translates[0]+ bounds[0] && mouseX<=translates[0]+bounds[2] && mouseY>=translates[1]+bounds[1] && mouseY<=translates[1]+bounds[3]){
      //console.log(fig.type + "Selected");
      movingFigure = fig;
    }else if(!dragging){
      movingFigure = null;
    }
  }
}

function mouseDragged(){
  let bounds;
  if(movingFigure!=null) bounds = movingFigure.bounds;
  let points = currentFigure.points;
  let translates = currentFigure.translate;
  if(dragging && movingFigure && mouseX>=movingFigure.translate[0]+ bounds[0] && mouseX<=movingFigure.translate[0]+bounds[2] && mouseY>=movingFigure.translate[1]+bounds[1] && mouseY<=movingFigure.translate[1]+bounds[3]){
    movingFigure.translate[0] = mouseX - (bounds[0]+bounds[2])/2;
    movingFigure.translate[1] = mouseY - (bounds[1]+bounds[3])/2;
  }else if(!dragging){
    //console.log(points);
    if(points.length >= 1){

      // Capture the end point to first vertex if mouse is clicked inside the captue Range
      if(!points.length == 1 && abs(mouseX-points[0].x-translates[0]) < captureRange && abs(mouseY-points[0].y-translates[1]) < captureRange){
        points.push(createVector(points[0].x, points[0].y));
      }else if(!currentFigure.figureComplete){
        points.push(createVector(mouseX-translates[0], mouseY-translates[1]));
      }
    }
    maxX = max(maxX, mouseX);
    maxY = max(maxY, mouseY);
    currentFigure.bounds[0] = min(currentFigure.bounds[0], mouseX);
    currentFigure.bounds[1] = min(currentFigure.bounds[1], mouseY);
    currentFigure.bounds[2] = max(currentFigure.bounds[2], mouseX);
    currentFigure.bounds[3] = max(currentFigure.bounds[3], mouseY);

  }
}

function mousePressed(){
  //console.log('pressed');
  if(currentFigure.points.length == 0){
    currentFigure.points.push(createVector(mouseX, mouseY));
  }
}


function generateSVG(){
  svg.generatePolygon(currentFigure.points, maxX, maxY);
}

function changeExportType(){
  svg.setExportType(ext.value());
}

function startDragging(){
  dragging = !dragging;
}

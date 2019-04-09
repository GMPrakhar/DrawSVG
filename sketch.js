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
  fill(175);


  // If figure is Complete, then fill the colour in the polygon
  for(let n = 0; n < figures.length; n++){

    if(figures[n].figureComplete){
      push();
      //translate if user is dragging the figure with the mouse
      translate(figures[n].translate[0], figures[n].translate[1]);
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
      for(let i = 0; i < figures[n].points.length; i++){
        if(i!= figures[n].points.length-1){
          line(figures[n].points[i].x, figures[n].points[i].y,figures[n].points[(i+1)].x, figures[n].points[(i+1)].y );
        }else if(figures[n].points.length > 2){

          // If last point's location equals that of the first figures[n].points,
          // then the figure is complete
          if(figures[n].points[i].x == figures[n].points[0].x && figures[n].points[i].y == figures[n].points[0].y){
            figures[n].figureComplete = true;
            currentFigure = new Figure({type: "polygon", figureComplete: false, fill: 175, points: [], translate: [0,0], bounds: [1000,1000,0,0]});
            figures.push(currentFigure);
          }
        }
      }
    }

    // If User is near the first pixel, Capture the mouse even if
    // mouse position is not exactly equal to first pixel position

    if(figures[n].points.length > 2 && !figures[n].figureComplete){
      if(abs(mouseX-figures[n].points[0].x) < 30 && abs(mouseY-figures[n].points[0].y) < captureRange){
        fill(183, 123, 58);
        ellipse(figures[n].points[0].x, figures[n].points[0].y, captureRange, captureRange);
        fill(0);
        ellipse(figures[n].points[0].x, figures[n].points[0].y, captureRange/2, captureRange/2);
      }
    }
  }
}

function mouseClicked(){
  if(mouseX>0 && !dragging){
    if(currentFigure.points.length > 2){

      // Capture the end point to first vertex if mouse is clicked inside the captue Range
      if(abs(mouseX-currentFigure.points[0].x) < 30 && abs(mouseY-currentFigure.points[0].y) < captureRange){
        currentFigure.points.push(createVector(currentFigure.points[0].x, currentFigure.points[0].y));
      }else if(!currentFigure.figureComplete){
        currentFigure.points.push(createVector(mouseX, mouseY));
      }
    }else if(!currentFigure.figureComplete){
      currentFigure.points.push(createVector(mouseX, mouseY));
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
    if(fig.figureComplete){
      console.log(fig.bounds);
      if(mouseX>=bounds[0] && mouseX<=bounds[2] && mouseY>=bounds[1] && mouseY<=bounds[3]){
        console.log(fig.type + "Selected");
        movingFigure = fig;
      }
    }
  }
}

function mouseDragged(){

  let bounds = movingFigure.bounds;
  if(dragging && movingFigure && mouseX>=movingFigure.translate[0]+ bounds[0] && mouseX<=movingFigure.translate[0]+bounds[2] && mouseY>=movingFigure.translate[1]+bounds[1] && mouseY<=movingFigure.translate[1]+bounds[3]){
    movingFigure.translate[0] = mouseX - (bounds[0]+bounds[2])/2;
    movingFigure.translate[1] = mouseY - (bounds[1]+bounds[3])/2;
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

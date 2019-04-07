let points = [];
let figureComplete = false; // If the figure is ready for fill or not
let captureRange = 20;      // Distance upto which mouse Click will be captured
function setup(){
  createCanvas(screen.width, screen.height);
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
  if(points.length > 2){
    if(abs(mouseX-points[0].x) < 30 && abs(mouseY-points[0].y) < captureRange){
      points.push(createVector(points[0].x, points[0].y));
    }else{
      points.push(createVector(mouseX, mouseY));
    }
  }else {
    points.push(createVector(mouseX, mouseY));
  }
}

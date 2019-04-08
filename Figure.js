class Figure{

  constructor(args){
    this.type = args.type;
    this.fill = args.fill;
    this.figureComplete = args.figureComplete;
    if(this.type=="circle"){
      this.radius = args.radius;
    }else if(this.type=="polygon"){
      this.points = args.points;
    }
  }
}

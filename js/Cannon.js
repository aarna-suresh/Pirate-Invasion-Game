class Cannon {
  constructor(xInput, yInput, widthInput, heightInput, angleInput) {
    this.x = xInput;
    this.y = yInput;
    this.width = widthInput;
    this.height = heightInput;
    this.angle = angleInput;

    this.cannonImage = loadImage("./assets/canon.png");
    this.cannonBaseImage = loadImage("./assets/cannonBase.png");

  }

  //function definition to display the cannon and the cannonpipe line together
  // and add mobility to the cannon with respect to the up and down arrow
  display() {
    if (keyIsDown(DOWN_ARROW) && this.angle < 70) {
      this.angle += 1;
    }

    if (keyIsDown(UP_ARROW) && this.angle > -30) {
      this.angle -= 1;
    }

    push();
    translate(this.x, this.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(this.cannonImage, 0, 0, this.width, this.height);
    pop();
    image(this.cannonBaseImage, 70, 20, 200, 200);
    noFill();


  }

}

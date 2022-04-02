class Boat {
    constructor(xInput, yInput, widthInput, heightInput, boatPosInput, boatAnimateInput) {

        this.width = widthInput;
        this.height = heightInput;

        this.boatImage = loadImage("./assets/boat.png");
        this.boatPosition = boatPosInput;
        this.animation = boatAnimateInput;
        this.isBroken = false;
        this.speed = 0.05;

        this.body = Bodies.rectangle(xInput, yInput, widthInput, heightInput);
        World.add(userWorld, this.body);
    }
    //function definition to increase the speed of the boat once it's displayed
    animate() {
        this.speed += 0.05;
    }

    //function to display the objects of this class
    display() {
        var angle = this.body.angle;
        var pos = this.body.position;
        var index = floor(this.speed % this.animation.length);


        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.animation[index], 0, this.boatPosition, this.width, this.height);
        pop();
    }
    //function definition to remove an object once the boat has been hit by the cannonball
    remove(indexInput) {
        this.isBroken = true;

        this.animation = brokenBoatAnimation;
        this.speed = 0.05;
        this.width = 300;
        this.height = 300;
        setTimeout(() => {
            Matter.World.remove(userWorld, boatsArray[indexInput].body);
            delete boatsArray[indexInput];
        }, 2000);
    }

}
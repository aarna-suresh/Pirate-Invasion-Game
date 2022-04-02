class CannonBall {
    //set up for cannon ball object
    constructor(xInput, yInput) {
        var options = {
            isStatic: true
        };
        this.radius = 30;
        this.x = xInput;
        this.y = yInput;
        this.body = Bodies.circle(this.x, this.y, this.radius, options);
        this.cannonBallImage = loadImage("./assets/cannonball.png");
        this.trajectory = [];
        this.speed = 0.05;
        this.animation = [this.cannonBallImage];
        this.isSink = false;
        World.add(userWorld, this.body);
    }

    //function def. to shoot the cannon ball in forward trajectory/direction
    shoot() {
        console.log("inside SHOOT function");
        var newAngle = cannon.angle - 28;
        newAngle = newAngle * (3.14 / 180);
        var velocity = p5.Vector.fromAngle(newAngle);
        velocity.mult(0.5);
        Matter.Body.setStatic(this.body, false);
        Matter.Body.setVelocity(this.body, {
            x: velocity.x * (180 / 3.14), y: velocity.y * (180 / 3.14)
        });
    }
    //function definition to increase the speed of the cannonball once its released
    animate() {
        this.speed += 0.05;
    }

    //function to display cannon ball image
    display() {
        console.log("inside display cannon ball function");
        var pos = this.body.position;
        var index = floor(this.speed % this.animation.length);

        push();
        translate(pos.x, pos.y);
        rotate(this.body.angle);
        imageMode(CENTER);
        image(this.animation[index], 0, 0, this.radius, this.radius);
        pop();

        //the condition which checks if any cannonball is actively moving in the right direction after a certain point(x,y)
        //if this is true, we can capture the positions as the cannonball paves through the canvas
        //each position has 2 values in terms of (x, y)
        if (this.body.velocity.x > 0 && pos.x > 20 && !this.isSink) {
            var position = [pos.x, pos.y];
            this.trajectory.push(position); //adding position array on each index of trajectory array
        }

        /*
          trajectory =[ [x0,y0], [x1,y1], [x2,y2], [x3,y3]............      ]
          trajectory =[ [200,100], [250,100], [300,80], [350,60]............      ]
          
          if i = 0,: trajectory[0][0],   trajectory[0][1] 
          if i = 1,: trajectory[1][0],   trajectory[1][1]     
          if i = 2,: trajectory[2][0],   trajectory[2][1]         
             
          loop is running over each value of index of trajectory array
          at every index of trajectory, a position array is saved which contains 2 items--- 0 index: x value, 1 index: y value
        */
        for (var i = 0; i < this.trajectory.length; i++) {
            //image function is used to draw an image
            //image(img variable which contains the path of the image file, x, y, width, height);

            image(this.cannonBallImage, this.trajectory[i][0], this.trajectory[i][1], 5, 5);
        }
    }


    //function definition to remove an object once the cannonball hits the boat/water
    remove(indexInput) {
        this.isSink = true;
        Matter.Body.setVelocity(this.body, { x: 0, y: 0 });

        this.animation = waterSplashAnimation;
        this.speed = 0.05;
        this.radius = 150;
        setTimeout(() => {
            Matter.World.remove(userWorld, this.body);
            delete ballsArray[indexInput];
        }, 800);
    }

}
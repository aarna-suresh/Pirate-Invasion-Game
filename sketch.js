//Pirate Cannon Game by Aarna using JS


//Declare variables for game objects and behaviour indicators(FLAGS)
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

//declare variables for creation of simulation
var userEngine, userWorld;

var tower, towerImg;
var canon, cannonBall, cannonExplosionSound;
var background, backgroundImg, backgroundSound;
var score;
var gameOver, gameOverImg;
var gameState, isGameOver, isLaughing, pirateLaughingSound;
var angle;
var ballsArray;
var boat, boatsArray;
var boatAnimation, boatSpriteData, boatSpriteSheet;
var brokenBoatAnimation, brokenBoatSpriteData, brokenBoatSpriteSheet;
var waterSplashAnimation, waterSplashSpriteData, waterSplashSpriteSheet, waterSplashSound;



function preload() {
    //Create Media library and load to use it during the course of the software
    //executed only once at the start of the program
    backgroundImg = loadImage("./assets/background.gif");
    towerImg = loadImage("./assets/tower.png");
    boatSpriteData = loadJSON("./assets/boat/boat.json");
    boatSpriteSheet = loadImage("./assets/boat/boat.png");
    brokenBoatSpriteData = loadJSON("./assets/boat/brokenBoat.json");
    brokenBoatSpriteSheet = loadImage("./assets/boat/brokenBoat.png");
    waterSplashSpriteData = loadJSON("./assets/waterSplash/waterSplash.json");
    waterSplashSpriteSheet = loadImage("./assets/waterSplash/waterSplash.png");

    //loading sound files
    backgroundSound = loadSound("./assets/background_music.mp3");
    cannonExplosionSound = loadSound("./assets/cannon_explosion.mp3");
    pirateLaughingSound = loadSound("./assets/pirate_laugh.mp3");
    waterSplashSound = loadSound("./assets/cannon_water.mp3");

}

//define the intial environment of the software(before it is used)
//by defining the declared variables with default values
//executed only once at the start of the program
function setup() {
    createCanvas(1200, 600);


    //defining variables for simulation
    userEngine = Engine.create();
    userWorld = userEngine.world;
    gameState = "play";


    //creation of tower body
    var towerOptions = {
        isStatic: true
    }
    tower = Bodies.rectangle(160, 350, 160, 310, towerOptions);
    World.add(userWorld, tower);

    //creation of ground body
    var groundOptions = {
        isStatic: true
    }
    ground = Bodies.rectangle(0, height - 5, width * 2, 5, groundOptions);
    World.add(userWorld, ground);

    //creation of cannon object
    angleMode(DEGREES);
    angle = 15;
    cannon = new Cannon(180, 110, 130, 100, angle);


    ballsArray = [];
    boatsArray = [];
    boatAnimation = [];
    brokenBoatAnimation = [];
    waterSplashAnimation = [];

    var boatFrames = boatSpriteData.frames;
    //running a loop over each data object within the frames of boat.json
    for (var i = 0; i < boatFrames.length; i++) {
        var pos = boatFrames[i].position;
        var img = boatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
        boatAnimation.push(img);
    }

    var brokenBoatFrames = brokenBoatSpriteData.frames;
    //running a loop over each data object within the frames of brokenBoat.json
    for (var i = 0; i < brokenBoatFrames.length; i++) {
        var pos = brokenBoatFrames[i].position;
        var img = brokenBoatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
        brokenBoatAnimation.push(img);
    }

    var waterSplashFrames = waterSplashSpriteData.frames;
    //running a loop over each data object within the frames of waterSplash.json
    for (var i = 0; i < waterSplashFrames.length; i++) {
        var pos = waterSplashFrames[i].position;
        var img = waterSplashSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
        waterSplashAnimation.push(img);
    }
}


//All modifications, changes, conditions, manipulations, actions during the course of the program are written inside function draw.
//All commands that are supposed to be executed and checked continously or applied throughout the program are written inside function draw.
//function draw is executed for every frame created since the start of the program.
function draw() {

    //set background color 
    image(backgroundImg, 0, 0, width, height);

    //adding background music
    if (!backgroundSound.isPlaying()) {
        backgroundSound.play();
        backgroundSound.setVolume(0.1);
    }

    //activating simulation
    Engine.update(userEngine);

    //display score
    // text("SCORE: " + score, width * (3 / 4), height / 16);

    //display of tower body
    push();
    imageMode(CENTER);
    image(towerImg, tower.position.x, tower.position.y, 160, 310);
    pop();

    //display of ground body
    push();
    fill("brown");
    rectMode(CENTER);
    rect(ground.position.x, ground.position.y, width * 2, 5)
    pop();




    //display of cannon object
    cannon.display();

    //function call to show boats at particular positions ONE AFTER THE OTHER and assign 
    //velocityX so that they move in left direction...
    showboats();


    //display of cannon ball object
    //if ballsArray has length 5 that means it has cannonball objects as items 
    //in indices: 0, 1, 2, 3, 4
    //if i = 0, showCannonBalls(ballsArray[0]);
    for (var i = 0; i < ballsArray.length; i++) {
        //function call to display cannon ball only if the said input has a valid value
        showCannonBalls(ballsArray[i], i);
        //function call to set behaviour when the cannonball collides with any of the boat objects
        collisionWithBoat(i);

    }
}

//function which is triggered when the given assigned key is released on the keyboard
function keyReleased() {
    if (keyCode === 32 && !isGameOver) {
        // console.log("inside function");
        //function call to shoot the cannon ball in forward trajectory/direction
        console.log("inside key released space bar clicked");
        console.log(ballsArray);
        ballsArray[ballsArray.length - 1].shoot();
    }
}

function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        //creation of cannon ball object
        cannonBall = new CannonBall(cannon.x, cannon.y);
        //setting the position against the given angle
        Matter.Body.setAngle(cannonBall.body, cannon.angle);
        //pushing single cannon objects as soon as they are created, on the array
        ballsArray.push(cannonBall);
        cannonExplosionSound.play();
    }

}

//function defintion to display cannon ball only if the said input has a valid value
function showCannonBalls(singleCannonBallFromBallsArray, indexInput) {
    //if the recieved parameter has defined values
    if (singleCannonBallFromBallsArray) {
        singleCannonBallFromBallsArray.display();
        //function call to increased the speed of the cannonball once it's released
        singleCannonBallFromBallsArray.animate();

        //condition to remove the cannonball once it has hit the water
        if (singleCannonBallFromBallsArray.body.position.x >= width ||
            singleCannonBallFromBallsArray.body.position.y >= height - 50) {
            singleCannonBallFromBallsArray.remove(indexInput);
            waterSplashSound.play();
        }
    }
}

//function definition to show boats at particular positions ONE AFTER THE OTHER and 
//assign velocityX so that they move in left direction...
function showboats() {
    if (boatsArray.length > 0) {
        if (boatsArray[boatsArray.length - 1] == undefined || boatsArray[boatsArray.length - 1].body.position.x < width - 300) {
            var positionsArray = [-40, -60, -70, -20];
            var randomPosition = random(positionsArray);
            boat = new Boat(width, height - 100, 170, 170, randomPosition, boatAnimation);
            boatsArray.push(boat);

        }
        for (var i = 0; i < boatsArray.length; i++) {
            //if the the given index of boatsArray has a definite value  it is defined then the condition is true
            if (boatsArray[i]) {
                Matter.Body.setVelocity(boatsArray[i].body, { x: -0.9, y: 0 });
                boatsArray[i].display();
                //function call to increased the speed of the boat once it's displayed
                boatsArray[i].animate();
                var hasCollided = Matter.SAT.collides(this.tower, boatsArray[i].body);
                if (hasCollided.collided && !boatsArray[i].isBroken) {
                    //adding isLaughing flag and setting it to true
                    if (isLaughing == false && pirateLaughingSound.isPlaying == false) {
                        pirateLaughingSound.play();
                        isLaughing = true;
                    }
                    //setting the game over flag to true
                    isGameOver = true;
                    //function call to set the enviorment after the game is over
                    setGameOver();

                }
            }
        }
    }
    else {
        boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
        boatsArray.push(boat);

    }
}

//function defintion to set behaviour when the cannonball collides with any of the boat objects
function collisionWithBoat(indexInput) {
    for (var i = 0; i < boatsArray.length; i++) {
        if (ballsArray[indexInput] !== undefined && boatsArray[i] !== undefined) {

            //Detect collision between two bodies using the Separating Axis Theorem.
            var collision = Matter.SAT.collides(ballsArray[indexInput].body, boatsArray[i].body);

            if (collision.collided) {
                boatsArray[i].remove(i);

                Matter.World.remove(userWorld, ballsArray[indexInput].body);
                delete ballsArray[indexInput];
            }
        }
    }
}
//function defintion to set the enviorment after the game is over
function setGameOver() {
    swal({
        title: 'GAME OVER',
        text: 'BETTER LUCK NEXT TIME',
        imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
        imageSize: "150x150",
        confirmButtonText: "Play Again"

    },
        function (isConfirm) {
            if (isConfirm) {
                location.reload();
            }
        }
    );
}